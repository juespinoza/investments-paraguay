import { Prisma, Role } from "@/generated/prisma";
import { can, scopeFor } from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/require-session";
import type { SessionPayload } from "@/lib/data/types";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/auth/user-bootstrap";
import { sendResetLinkToUser } from "@/lib/auth/password-reset";
import {
  EmailChangeError,
  cancelEmailChange,
  inviteCreatedUser,
  requestEmailChange,
  resendInvitation,
  unusablePasswordHash,
  type EmailSendResult,
} from "@/lib/auth/email-verification";

export class UserRepoError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "UserRepoError";
    this.status = status;
  }
}

export type UserInput = {
  email: string;
  name?: string | null;
  role: Role;
  inmobiliariaId?: string | null;
  advisorId?: string | null;
};

type UserUpdateInput = UserInput;

type ResolvedAssignments = {
  inmobiliariaId: string | null;
  advisorId: string | null;
};

type UserAction = "create" | "read" | "update" | "delete_soft";

type UserFormOptions = {
  scope: "all" | "advisor_users";
  availableRoles: Role[];
  inmobiliarias: Array<{ id: string; name: string }>;
  advisors: Array<{ id: string; fullName: string; inmobiliariaId: string | null }>;
  lockedInmobiliariaId: string | null;
};

function getUserScope(session: SessionPayload, action: UserAction) {
  return scopeFor(session, "users", action);
}

async function buildScopedUserWhere(
  session: SessionPayload,
  action: UserAction,
): Promise<Prisma.UserWhereInput> {
  const scope = getUserScope(session, action);

  if (scope === "all") {
    return { deletedAt: null } satisfies Prisma.UserWhereInput;
  }

  if (scope === "advisor_users") {
    if (!session.inmobiliariaId) {
      throw new UserRepoError(
        "Tu sesión no tiene una inmobiliaria válida para operar usuarios.",
        403,
      );
    }

    const advisors = await prisma.advisor.findMany({
      where: {
        deletedAt: null,
        inmobiliariaId: session.inmobiliariaId,
      },
      select: { id: true },
    });

    return {
      deletedAt: null,
      role: Role.ASESOR,
      advisorId: { in: advisors.map((advisor) => advisor.id) },
    } satisfies Prisma.UserWhereInput;
  }

  throw new UserRepoError("Forbidden", 403);
}

async function findAdvisorForAssignments(
  advisorId: string,
  session: SessionPayload,
  action: UserAction,
) {
  const scope = getUserScope(session, action);
  const advisor = await prisma.advisor.findFirst({
    where: {
      id: advisorId,
      deletedAt: null,
      ...(scope === "advisor_users" && session.inmobiliariaId
        ? { inmobiliariaId: session.inmobiliariaId }
        : {}),
    },
    select: { id: true, inmobiliariaId: true },
  });

  if (!advisor) {
    throw new UserRepoError("El asesor seleccionado no existe.", 400);
  }

  return advisor;
}

async function resolveAssignmentsForSession(
  session: SessionPayload,
  action: UserAction,
  {
    role,
    inmobiliariaId,
    advisorId,
  }: Pick<UserInput, "role" | "inmobiliariaId" | "advisorId">,
): Promise<ResolvedAssignments> {
  const scope = getUserScope(session, action);

  if (scope === "advisor_users") {
    if (role !== Role.ASESOR) {
      throw new UserRepoError(
        "Las inmobiliarias solo pueden gestionar usuarios de asesores de su tenant.",
        403,
      );
    }

    if (!advisorId) {
      throw new UserRepoError(
        "Debes seleccionar un asesor de tu inmobiliaria.",
        400,
      );
    }

    const advisor = await findAdvisorForAssignments(advisorId, session, action);
    if (!advisor.inmobiliariaId) {
      throw new UserRepoError(
        "El asesor seleccionado no pertenece a una inmobiliaria válida.",
        400,
      );
    }

    return {
      advisorId: advisor.id,
      inmobiliariaId: advisor.inmobiliariaId,
    };
  }

  if (role === Role.ADMIN || role === Role.BLOGUERO) {
    return { inmobiliariaId: null, advisorId: null };
  }

  if (inmobiliariaId) {
    const inmobiliaria = await prisma.inmobiliaria.findFirst({
      where: { id: inmobiliariaId, deletedAt: null },
      select: { id: true },
    });

    if (!inmobiliaria) {
      throw new UserRepoError("La inmobiliaria seleccionada no existe.", 400);
    }
  }

  if (advisorId) {
    const advisor = await prisma.advisor.findFirst({
      where: { id: advisorId, deletedAt: null },
      select: { id: true, inmobiliariaId: true },
    });

    if (!advisor) {
      throw new UserRepoError("El asesor seleccionado no existe.", 400);
    }

    if (inmobiliariaId && advisor.inmobiliariaId !== inmobiliariaId) {
      throw new UserRepoError(
        "El asesor no pertenece a la inmobiliaria seleccionada.",
        400,
      );
    }

    if (role === Role.ASESOR) {
      return {
        advisorId: advisor.id,
        inmobiliariaId: advisor.inmobiliariaId ?? inmobiliariaId ?? null,
      };
    }
  }

  if (role === Role.INMOBILIARIA) {
    if (!inmobiliariaId) {
      throw new UserRepoError(
        "Los usuarios de inmobiliaria deben tener una inmobiliaria asignada.",
        400,
      );
    }
    if (advisorId) {
      throw new UserRepoError(
        "Los usuarios de inmobiliaria no deben tener un asesor asignado.",
        400,
      );
    }
    return { inmobiliariaId, advisorId: null };
  }

  if (role === Role.ASESOR) {
    if (!advisorId) {
      throw new UserRepoError(
        "Los usuarios asesores deben tener un asesor asignado.",
        400,
      );
    }
    throw new UserRepoError("El asesor seleccionado no existe.", 400);
  }

  return {
    inmobiliariaId: inmobiliariaId ?? null,
    advisorId: advisorId ?? null,
  };
}

export async function requireAdminSession() {
  const session = await requireSession();
  if (session.role !== Role.ADMIN) {
    throw new UserRepoError("Forbidden", 403);
  }
  return session;
}

export async function requireUsersSession(action: UserAction = "read") {
  const session = await requireSession();
  if (!can(session, "users", action)) {
    throw new UserRepoError("Forbidden", 403);
  }
  return session;
}

export async function listUsers() {
  const session = await requireUsersSession("read");

  const users = await prisma.user.findMany({
    where: await buildScopedUserWhere(session, "read"),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      inmobiliariaId: true,
      advisorId: true,
      createdAt: true,
      emailVerifiedAt: true,
      pendingEmail: true,
    },
  });

  const inmobiliariaIds = Array.from(
    new Set(users.map((user) => user.inmobiliariaId).filter(Boolean)),
  ) as string[];
  const advisorIds = Array.from(
    new Set(users.map((user) => user.advisorId).filter(Boolean)),
  ) as string[];

  const [inmobiliarias, advisors] = await Promise.all([
    inmobiliariaIds.length
      ? prisma.inmobiliaria.findMany({
          where: { id: { in: inmobiliariaIds } },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
    advisorIds.length
      ? prisma.advisor.findMany({
          where: { id: { in: advisorIds } },
          select: { id: true, fullName: true },
        })
      : Promise.resolve([]),
  ]);

  const inmobiliariaMap = new Map(
    inmobiliarias.map((item) => [item.id, item.name]),
  );
  const advisorMap = new Map(advisors.map((item) => [item.id, item.fullName]));

  return users.map((user) => ({
    ...user,
    inmobiliariaName: user.inmobiliariaId
      ? inmobiliariaMap.get(user.inmobiliariaId) ?? null
      : null,
    advisorName: user.advisorId ? advisorMap.get(user.advisorId) ?? null : null,
  }));
}

export async function getUserById(id: string) {
  const session = await requireUsersSession("read");

  return prisma.user.findFirst({
    where: {
      ...(await buildScopedUserWhere(session, "read")),
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      inmobiliariaId: true,
      advisorId: true,
      createdAt: true,
      updatedAt: true,
      emailVerifiedAt: true,
      pendingEmail: true,
    },
  });
}

export async function createUser(input: UserInput) {
  const session = await requireUsersSession("create");
  const email = normalizeEmail(input.email);

  if (!email) {
    throw new UserRepoError("El email es obligatorio.", 400);
  }

  const assignments = await resolveAssignmentsForSession(session, "create", input);

  let created: { id: string; email: string; name: string | null };
  try {
    created = await prisma.user.create({
      data: {
        email,
        name: input.name?.trim() || null,
        // Nadie elige la contraseña por otra persona: la cuenta se activa
        // desde la invitación que llega al email, que así queda confirmado.
        password: await unusablePasswordHash(),
        emailVerifiedAt: null,
        role:
          getUserScope(session, "create") === "advisor_users"
            ? Role.ASESOR
            : input.role,
        inmobiliariaId: assignments.inmobiliariaId,
        advisorId: assignments.advisorId,
      },
      select: { id: true, email: true, name: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new UserRepoError("Ya existe un usuario con ese email.", 409);
    }
    throw error;
  }

  const invitation = await inviteCreatedUser(created);
  return { id: created.id, invitation };
}

export async function softDeleteUser(id: string) {
  const session = await requireUsersSession("delete_soft");

  if (session.id === id || session.sub === id) {
    throw new UserRepoError("No puedes desactivar tu propio usuario.", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      ...(await buildScopedUserWhere(session, "delete_soft")),
      id,
    },
    select: { id: true },
  });

  if (!user) {
    throw new UserRepoError("Usuario no encontrado.", 404);
  }

  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function updateUser(id: string, input: UserUpdateInput) {
  const session = await requireUsersSession("update");
  const email = normalizeEmail(input.email);

  if (!email) {
    throw new UserRepoError("El email es obligatorio.", 400);
  }

  const existing = await prisma.user.findFirst({
    where: {
      ...(await buildScopedUserWhere(session, "update")),
      id,
    },
    select: { id: true, email: true, pendingEmail: true },
  });

  if (!existing) {
    throw new UserRepoError("Usuario no encontrado.", 404);
  }

  const emailChanged = email !== existing.email;
  if (emailChanged) {
    const taken = await prisma.user.findFirst({
      where: { email, id: { not: id } },
      select: { id: true },
    });
    if (taken) throw new UserRepoError("Ya existe un usuario con ese email.", 409);
  }

  if (session.role === Role.ADMIN && session.id === id && input.role !== Role.ADMIN) {
    throw new UserRepoError(
      "No puedes quitarte a ti mismo el rol de admin.",
      400,
    );
  }

  const assignments = await resolveAssignmentsForSession(session, "update", input);

  try {
    await prisma.user.update({
      where: { id },
      data: {
        // El email no se cambia acá: ver requestEmailChange más abajo.
        name: input.name?.trim() || null,
        role:
          getUserScope(session, "update") === "advisor_users"
            ? Role.ASESOR
            : input.role,
        inmobiliariaId: assignments.inmobiliariaId,
        advisorId: assignments.advisorId,
      },
      select: { id: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new UserRepoError("Ya existe un usuario con ese email.", 409);
    }
    throw error;
  }

  // Un email nuevo queda pendiente hasta que se confirme desde esa casilla.
  // Volver a poner el email vigente cancela un cambio pendiente.
  let emailChange: EmailSendResult | "unchanged" | null = null;
  if (emailChanged || existing.pendingEmail) {
    try {
      emailChange = await requestEmailChange(id, email);
    } catch (error) {
      if (error instanceof EmailChangeError) {
        throw new UserRepoError(error.message, error.status);
      }
      throw error;
    }
  }

  return { id, emailChange };
}

async function findScopedUser(id: string) {
  const session = await requireUsersSession("update");
  const user = await prisma.user.findFirst({
    where: {
      ...(await buildScopedUserWhere(session, "update")),
      id,
    },
    select: { id: true },
  });
  if (!user) throw new UserRepoError("Usuario no encontrado.", 404);
  return user;
}

export async function resendUserInvitation(id: string) {
  await findScopedUser(id);
  const result = await resendInvitation(id);
  if (result === "already_active") {
    throw new UserRepoError("La cuenta ya está activada.", 400);
  }
  return result;
}

export async function cancelUserEmailChange(id: string) {
  await findScopedUser(id);
  await cancelEmailChange(id);
}

// El admin (o la inmobiliaria, para sus asesores) no elige la contraseña de
// otra persona: le envía un link al email registrado de esa cuenta.
export async function sendUserPasswordResetLink(id: string) {
  const session = await requireUsersSession("update");

  const user = await prisma.user.findFirst({
    where: {
      ...(await buildScopedUserWhere(session, "update")),
      id,
    },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    throw new UserRepoError("Usuario no encontrado.", 404);
  }

  const result = await sendResetLinkToUser(user);
  if (result === "rate_limited") {
    throw new UserRepoError(
      "Ya se enviaron varios links a esta cuenta en la última hora. Esperá un rato antes de pedir otro.",
      429,
    );
  }
  if (result === "email_not_configured") {
    throw new UserRepoError(
      "El envío de emails no está configurado (faltan RESEND_API_KEY y EMAIL_FROM).",
      500,
    );
  }

  return { email: user.email };
}

export async function listUserFormOptions(): Promise<UserFormOptions> {
  const session = await requireUsersSession("read");
  const scope = getUserScope(session, "read");

  const [inmobiliarias, advisors] = await Promise.all([
    scope === "all"
      ? prisma.inmobiliaria.findMany({
          where: { deletedAt: null },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        })
      : session.inmobiliariaId
        ? prisma.inmobiliaria.findMany({
            where: { id: session.inmobiliariaId, deletedAt: null },
            orderBy: { name: "asc" },
            select: { id: true, name: true },
          })
        : Promise.resolve([]),
    prisma.advisor.findMany({
      where: {
        deletedAt: null,
        ...(scope === "advisor_users" && session.inmobiliariaId
          ? { inmobiliariaId: session.inmobiliariaId }
          : {}),
      },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, inmobiliariaId: true },
    }),
  ]);

  return {
    scope: scope === "advisor_users" ? "advisor_users" : "all",
    availableRoles: scope === "advisor_users" ? [Role.ASESOR] : Object.values(Role),
    inmobiliarias,
    advisors,
    lockedInmobiliariaId:
      scope === "advisor_users" ? session.inmobiliariaId ?? null : null,
  };
}
