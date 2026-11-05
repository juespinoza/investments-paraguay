import "server-only";

import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { hashPassword, normalizeEmail } from "@/lib/auth/user-bootstrap";
import {
  RESET_MAX_REQUESTS,
  RESET_TOKEN_TTL_MINUTES,
  RESET_WINDOW_MINUTES,
  generateResetToken,
  hashResetToken,
  isWellFormedToken,
  passwordProblem,
  resetBaseUrl,
  resetTokenExpiry,
  tokenState,
  type TokenState,
} from "@/lib/auth/password-reset-core";
import { EmailNotConfiguredError, sendEmail } from "@/lib/email/send";

export const RESET_PATH = "/virtual-office/restablecer-contrasena";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string,
  );
}

function buildResetEmail(name: string | null, link: string) {
  const greeting = name ? `Hola ${name},` : "Hola,";
  const text = [
    greeting,
    "",
    `Recibimos un pedido para restablecer tu contraseña de la oficina virtual de ${SITE_NAME}.`,
    `Abrí este link para elegir una nueva (vence en ${RESET_TOKEN_TTL_MINUTES} minutos y sirve una sola vez):`,
    "",
    link,
    "",
    "Si no lo pediste vos, ignorá este email: tu contraseña no cambia.",
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#f5f3ef;font-family:Arial,sans-serif;color:#1a1a1a">
<div style="max-width:520px;margin:0 auto;padding:32px 24px">
<p style="font-size:18px;margin:0 0 24px"><strong>${escapeHtml(SITE_NAME)}</strong></p>
<p>${escapeHtml(greeting)}</p>
<p>Recibimos un pedido para restablecer tu contraseña de la oficina virtual.</p>
<p style="margin:28px 0"><a href="${escapeHtml(link)}" style="background:#0a0a0a;color:#fafaf8;padding:14px 22px;text-decoration:none;border-radius:2px;display:inline-block">Elegir nueva contraseña</a></p>
<p style="font-size:14px;color:#555">El link vence en ${RESET_TOKEN_TTL_MINUTES} minutos y sirve una sola vez.</p>
<p style="font-size:14px;color:#555">Si no lo pediste vos, ignorá este email: tu contraseña no cambia.</p>
<p style="font-size:12px;color:#888;word-break:break-all">Si el botón no funciona, copiá este link: ${escapeHtml(link)}</p>
</div></body></html>`;

  return { text, html };
}

export type ResetRequestResult =
  | "sent"
  | "no_user"
  | "rate_limited"
  | "email_not_configured";

// Crea un token y manda el link al email registrado del usuario.
// El resultado es solo para logs: hacia afuera la respuesta es siempre la
// misma, para no revelar qué emails tienen cuenta.
export async function requestPasswordReset(rawEmail: string): Promise<ResetRequestResult> {
  const email = normalizeEmail(rawEmail);
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
    select: { id: true, email: true, name: true },
  });

  if (!user) return "no_user";
  return sendResetLinkToUser(user);
}

export async function sendResetLinkToUser(user: {
  id: string;
  email: string;
  name: string | null;
}): Promise<ResetRequestResult> {
  const windowStart = new Date(Date.now() - RESET_WINDOW_MINUTES * 60_000);
  const recent = await prisma.passwordResetToken.count({
    where: { userId: user.id, createdAt: { gte: windowStart } },
  });
  if (recent >= RESET_MAX_REQUESTS) return "rate_limited";

  const token = generateResetToken();
  const link = `${resetBaseUrl(process.env, SITE_URL)}${RESET_PATH}?token=${token}`;

  // Solo un link activo por usuario: pedir uno nuevo anula los anteriores.
  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashResetToken(token),
        expiresAt: resetTokenExpiry(),
      },
    }),
  ]);

  const message = buildResetEmail(user.name, link);

  try {
    await sendEmail({
      to: user.email,
      subject: `Restablecer tu contraseña — ${SITE_NAME}`,
      ...message,
    });
    return "sent";
  } catch (error) {
    if (error instanceof EmailNotConfiguredError) {
      if (process.env.NODE_ENV === "development") {
        // En local, sin Resend, el link se ve en la terminal.
        console.info(`[password-reset] Link para ${user.email}: ${link}`);
        return "sent";
      }
      console.error(`[password-reset] ${error.message}`);
      return "email_not_configured";
    }
    throw error;
  }
}

export async function checkResetToken(token: unknown): Promise<TokenState> {
  if (!isWellFormedToken(token)) return "invalid";
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashResetToken(token) },
    select: { expiresAt: true, usedAt: true, user: { select: { deletedAt: true } } },
  });
  if (record?.user.deletedAt) return "invalid";
  return tokenState(record);
}

export class ResetError extends Error {
  status: number;
  code: TokenState | "weak_password";

  constructor(code: ResetError["code"], message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const TOKEN_MESSAGES: Record<Exclude<TokenState, "valid">, string> = {
  invalid: "El link no es válido. Pedí uno nuevo.",
  expired: "El link venció. Pedí uno nuevo.",
  used: "Este link ya se usó. Si necesitás cambiar la contraseña otra vez, pedí uno nuevo.",
};

export async function confirmPasswordReset(token: unknown, password: string) {
  const problem = passwordProblem(password);
  if (problem) throw new ResetError("weak_password", problem);
  if (!isWellFormedToken(token)) throw new ResetError("invalid", TOKEN_MESSAGES.invalid);

  const passwordHash = await hashPassword(password);
  const tokenHash = hashResetToken(token);

  return prisma.$transaction(async (tx) => {
    const record = await tx.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        usedAt: true,
        user: { select: { deletedAt: true } },
      },
    });

    const state = record?.user.deletedAt ? "invalid" : tokenState(record);
    if (state !== "valid" || !record) {
      throw new ResetError(state as Exclude<TokenState, "valid">, TOKEN_MESSAGES[state as Exclude<TokenState, "valid">]);
    }

    // Marcar como usado solo si sigue sin usar: dos envíos simultáneos del
    // mismo link no pueden cambiar la contraseña dos veces.
    const claimed = await tx.passwordResetToken.updateMany({
      where: { id: record.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (claimed.count !== 1) throw new ResetError("used", TOKEN_MESSAGES.used);

    await tx.user.update({
      where: { id: record.userId },
      data: { password: passwordHash, passwordChangedAt: new Date() },
    });

    // Cualquier otro link pendiente del usuario queda anulado.
    await tx.passwordResetToken.updateMany({
      where: { userId: record.userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    return { userId: record.userId };
  });
}
