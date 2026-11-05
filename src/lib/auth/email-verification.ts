import "server-only";

import { randomBytes } from "node:crypto";
import { Prisma, type EmailTokenPurpose } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { hashPassword, normalizeEmail } from "@/lib/auth/user-bootstrap";
import {
  generateResetToken,
  hashResetToken,
  isWellFormedToken,
  passwordProblem,
  resetBaseUrl,
  tokenState,
  type TokenState,
} from "@/lib/auth/password-reset-core";
import {
  EMAIL_CHANGE_TTL_HOURS,
  EMAIL_TOKEN_MAX_REQUESTS,
  EMAIL_TOKEN_WINDOW_MINUTES,
  INVITE_TTL_HOURS,
  emailTokenMatchesUser,
  expiryAfterHours,
} from "@/lib/auth/email-token-core";
import { EmailNotConfiguredError, sendEmail } from "@/lib/email/send";
import { buildActionEmail } from "@/lib/email/templates";

export const ACCEPT_INVITE_PATH = "/virtual-office/activar-cuenta";
export const CONFIRM_EMAIL_PATH = "/virtual-office/confirmar-email";

export type EmailSendResult = "sent" | "rate_limited" | "email_not_configured";

// Contraseña que nadie conoce para las cuentas invitadas: la persona elige
// la suya al aceptar la invitación.
export async function unusablePasswordHash() {
  return hashPassword(randomBytes(32).toString("base64url"));
}

async function deliver(to: string, subject: string, message: { text: string; html: string }, link?: string) {
  try {
    await sendEmail({ to, subject, ...message });
    return "sent" as const;
  } catch (error) {
    if (error instanceof EmailNotConfiguredError) {
      if (process.env.NODE_ENV === "development") {
        console.info(`[email] ${subject} → ${to}${link ? `: ${link}` : ""}`);
        return "sent" as const;
      }
      console.error(`[email] ${error.message}`);
      return "email_not_configured" as const;
    }
    throw error;
  }
}

// Crea un token nuevo (anulando los anteriores del mismo tipo) y devuelve el
// link, o null si se superó el límite de envíos.
async function issueToken(userId: string, purpose: EmailTokenPurpose, email: string, ttlHours: number, path: string) {
  const windowStart = new Date(Date.now() - EMAIL_TOKEN_WINDOW_MINUTES * 60_000);
  const recent = await prisma.emailToken.count({
    where: { userId, purpose, createdAt: { gte: windowStart } },
  });
  if (recent >= EMAIL_TOKEN_MAX_REQUESTS) return null;

  const token = generateResetToken();
  await prisma.$transaction([
    prisma.emailToken.updateMany({
      where: { userId, purpose, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.emailToken.create({
      data: {
        userId,
        purpose,
        email,
        tokenHash: hashResetToken(token),
        expiresAt: expiryAfterHours(ttlHours),
      },
    }),
  ]);

  return `${resetBaseUrl(process.env, SITE_URL)}${path}?token=${token}`;
}

// --- Invitación (alta de usuario) -------------------------------------------

export async function sendInvitation(user: { id: string; email: string; name: string | null }): Promise<EmailSendResult> {
  const link = await issueToken(user.id, "INVITE", user.email, INVITE_TTL_HOURS, ACCEPT_INVITE_PATH);
  if (!link) return "rate_limited";

  const message = buildActionEmail({
    name: user.name,
    paragraphs: [
      `Te crearon una cuenta en la oficina virtual de ${SITE_NAME}.`,
      "Para activarla, confirmá que este email es tuyo y elegí tu contraseña.",
    ],
    action: { label: "Activar mi cuenta", url: link },
    footnotes: [
      `El link vence en ${INVITE_TTL_HOURS / 24} días y sirve una sola vez.`,
      "Si no esperabas esta invitación, ignorá este email.",
    ],
  });

  return deliver(user.email, `Activá tu cuenta — ${SITE_NAME}`, message, link);
}

// Después de crear la cuenta: si el email no sale, la cuenta igual queda
// creada y la invitación se puede reenviar desde Usuarios.
export async function inviteCreatedUser(user: { id: string; email: string; name: string | null }) {
  try {
    const result = await sendInvitation(user);
    if (result !== "sent") console.warn(`[email] invitación a ${user.id} no enviada: ${result}`);
    return result;
  } catch (error) {
    console.error(`[email] error al enviar la invitación a ${user.id}`, error);
    return "email_not_configured" as const;
  }
}

// Reenvía la invitación de una cuenta que todavía no se activó.
export async function resendInvitation(userId: string): Promise<EmailSendResult | "already_active"> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { id: true, email: true, name: true, emailVerifiedAt: true },
  });
  if (!user) throw new Error("Usuario no encontrado.");
  if (user.emailVerifiedAt) return "already_active";
  return sendInvitation(user);
}

// --- Cambio de email --------------------------------------------------------

export class EmailChangeError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

// El email vigente no cambia: se guarda como pendiente y se envía un link al
// nuevo. Al email anterior se le avisa, por si el cambio no lo pidió la persona.
export async function requestEmailChange(userId: string, rawEmail: string): Promise<EmailSendResult | "unchanged"> {
  const newEmail = normalizeEmail(rawEmail);
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { id: true, email: true, name: true, pendingEmail: true, emailVerifiedAt: true },
  });
  if (!user) throw new EmailChangeError("Usuario no encontrado.", 404);

  if (newEmail === user.email) {
    // Volver al email vigente cancela un cambio pendiente.
    if (user.pendingEmail) await cancelEmailChange(user.id);
    return "unchanged";
  }

  const taken = await prisma.user.findFirst({
    where: { email: newEmail, id: { not: user.id } },
    select: { id: true },
  });
  if (taken) throw new EmailChangeError("Ya existe un usuario con ese email.", 409);

  // Una invitación todavía sin aceptar se corrige directamente: no hay un
  // email confirmado que proteger. La invitación nueva va al email corregido.
  if (!user.emailVerifiedAt) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { email: newEmail, pendingEmail: null },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new EmailChangeError("Ya existe un usuario con ese email.", 409);
      }
      throw error;
    }
    return sendInvitation({ id: user.id, email: newEmail, name: user.name });
  }

  const link = await issueToken(user.id, "EMAIL_CHANGE", newEmail, EMAIL_CHANGE_TTL_HOURS, CONFIRM_EMAIL_PATH);
  if (!link) return "rate_limited";

  await prisma.user.update({ where: { id: user.id }, data: { pendingEmail: newEmail } });

  const result = await deliver(
    newEmail,
    `Confirmá tu nuevo email — ${SITE_NAME}`,
    buildActionEmail({
      name: user.name,
      paragraphs: [
        `Se pidió cambiar el email de tu cuenta de la oficina virtual de ${SITE_NAME} a esta dirección.`,
        "Hasta que lo confirmes, la cuenta sigue usando el email anterior.",
      ],
      action: { label: "Confirmar este email", url: link },
      footnotes: [
        `El link vence en ${EMAIL_CHANGE_TTL_HOURS} horas y sirve una sola vez.`,
        "Si no reconocés este pedido, ignorá este email.",
      ],
    }),
    link,
  );

  if (result === "sent") {
    // Aviso al email anterior, sin link. Si falla no frena el cambio.
    await deliver(
      user.email,
      `Pedido de cambio de email — ${SITE_NAME}`,
      buildActionEmail({
        name: user.name,
        paragraphs: [
          `Se pidió cambiar el email de tu cuenta de la oficina virtual de ${SITE_NAME} a ${newEmail}.`,
          "El cambio solo se aplica si se confirma desde esa dirección.",
        ],
        footnotes: ["Si no lo pediste vos, avisá al administrador del sitio."],
      }),
    ).catch((error) => console.error("[email] aviso al email anterior", error));
  }

  return result;
}

export async function cancelEmailChange(userId: string) {
  await prisma.$transaction([
    prisma.emailToken.updateMany({
      where: { userId, purpose: "EMAIL_CHANGE", usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({ where: { id: userId }, data: { pendingEmail: null } }),
  ]);
}

// --- Consumir los links -----------------------------------------------------

export class EmailTokenError extends Error {
  status: number;
  code: Exclude<TokenState, "valid"> | "weak_password" | "email_taken";
  constructor(code: EmailTokenError["code"], message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const TOKEN_MESSAGES: Record<Exclude<TokenState, "valid">, string> = {
  invalid: "El link no es válido.",
  expired: "El link venció.",
  used: "Este link ya se usó.",
};

type LoadedToken = {
  id: string;
  userId: string;
  purpose: EmailTokenPurpose;
  email: string;
  expiresAt: Date;
  usedAt: Date | null;
  user: { email: string; pendingEmail: string | null; deletedAt: Date | null; emailVerifiedAt: Date | null };
};

function evaluate(record: LoadedToken | null, purpose: EmailTokenPurpose): TokenState {
  if (!record || record.purpose !== purpose || record.user.deletedAt) return "invalid";
  const state = tokenState(record);
  if (state !== "valid") return state;
  return emailTokenMatchesUser(purpose, record.email, record.user) ? "valid" : "invalid";
}

const tokenSelect = {
  id: true,
  userId: true,
  purpose: true,
  email: true,
  expiresAt: true,
  usedAt: true,
  user: { select: { email: true, pendingEmail: true, deletedAt: true, emailVerifiedAt: true } },
} as const;

export async function checkEmailToken(token: unknown, purpose: EmailTokenPurpose) {
  if (!isWellFormedToken(token)) return { state: "invalid" as TokenState, email: null };
  const record = await prisma.emailToken.findUnique({
    where: { tokenHash: hashResetToken(token) },
    select: tokenSelect,
  });
  const state = evaluate(record, purpose);
  return { state, email: state === "valid" ? record!.email : null };
}

async function claim(tx: Prisma.TransactionClient, token: unknown, purpose: EmailTokenPurpose) {
  if (!isWellFormedToken(token)) throw new EmailTokenError("invalid", TOKEN_MESSAGES.invalid);
  const record = await tx.emailToken.findUnique({
    where: { tokenHash: hashResetToken(token) },
    select: tokenSelect,
  });
  const state = evaluate(record, purpose);
  if (state !== "valid" || !record) {
    throw new EmailTokenError(state as Exclude<TokenState, "valid">, TOKEN_MESSAGES[state as Exclude<TokenState, "valid">]);
  }
  // Atómico: dos envíos simultáneos del mismo link no se aplican dos veces.
  const claimed = await tx.emailToken.updateMany({
    where: { id: record.id, usedAt: null },
    data: { usedAt: new Date() },
  });
  if (claimed.count !== 1) throw new EmailTokenError("used", TOKEN_MESSAGES.used);
  return record;
}

// Invitación: confirma el email y fija la contraseña elegida por la persona.
export async function acceptInvitation(token: unknown, password: string) {
  const problem = passwordProblem(password);
  if (problem) throw new EmailTokenError("weak_password", problem);
  if (!isWellFormedToken(token)) throw new EmailTokenError("invalid", TOKEN_MESSAGES.invalid);
  const passwordHash = await hashPassword(password);

  return prisma.$transaction(async (tx) => {
    const record = await claim(tx, token, "INVITE");
    const now = new Date();
    await tx.user.update({
      where: { id: record.userId },
      data: { password: passwordHash, passwordChangedAt: now, emailVerifiedAt: now },
    });
    return { email: record.email };
  });
}

// Cambio de email: el email pendiente pasa a ser el vigente.
export async function confirmEmailChange(token: unknown) {
  if (!isWellFormedToken(token)) throw new EmailTokenError("invalid", TOKEN_MESSAGES.invalid);
  try {
    return await prisma.$transaction(async (tx) => {
      const record = await claim(tx, token, "EMAIL_CHANGE");
      await tx.user.update({
        where: { id: record.userId },
        data: { email: record.email, pendingEmail: null, emailVerifiedAt: new Date() },
      });
      // Los links de contraseña enviados al email anterior dejan de valer.
      await tx.passwordResetToken.updateMany({
        where: { userId: record.userId, usedAt: null },
        data: { usedAt: new Date() },
      });
      return { email: record.email };
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new EmailTokenError("email_taken", "Ese email ya lo usa otra cuenta.", 409);
    }
    throw error;
  }
}
