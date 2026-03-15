import { Prisma, Role } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { hashPassword, normalizeEmail } from "@/lib/auth/user-bootstrap";

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
  password: string;
  name?: string | null;
  role: Role;
  inmobiliariaId?: string | null;
  advisorId?: string | null;
};

type UserUpdateInput = Omit<UserInput, "password">;

type ResolvedAssignments = {
  inmobiliariaId: string | null;
  advisorId: string | null;
};

async function resolveAssignments({
  role,
  inmobiliariaId,
  advisorId,
}: Pick<UserInput, "role" | "inmobiliariaId" | "advisorId">): Promise<ResolvedAssignments> {
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
  if (session.role !== "ADMIN") {
    throw new UserRepoError("Forbidden", 403);
  }
  return session;
}

export async function listUsers() {
  await requireAdminSession();

  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      inmobiliariaId: true,
      advisorId: true,
      createdAt: true,
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
  await requireAdminSession();

  return prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      inmobiliariaId: true,
      advisorId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createUser(input: UserInput) {
  await requireAdminSession();

  const email = normalizeEmail(input.email);
  if (!email) {
    throw new UserRepoError("El email es obligatorio.", 400);
  }
  if (input.password.trim().length < 8) {
    throw new UserRepoError(
      "La contraseña debe tener al menos 8 caracteres.",
      400,
    );
  }

  const assignments = await resolveAssignments(input);

  try {
    return await prisma.user.create({
      data: {
        email,
        name: input.name?.trim() || null,
        password: await hashPassword(input.password),
        role: input.role,
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
}

export async function softDeleteUser(id: string) {
  const session = await requireAdminSession();

  if (session.id === id || session.sub === id) {
    throw new UserRepoError("No puedes desactivar tu propio usuario.", 400);
  }

  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
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
  const session = await requireAdminSession();
  const email = normalizeEmail(input.email);

  if (!email) {
    throw new UserRepoError("El email es obligatorio.", 400);
  }

  const existing = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });

  if (!existing) {
    throw new UserRepoError("Usuario no encontrado.", 404);
  }

  if (session.id === id && input.role !== Role.ADMIN) {
    throw new UserRepoError(
      "No puedes quitarte a ti mismo el rol de admin.",
      400,
    );
  }

  const assignments = await resolveAssignments(input);

  try {
    return await prisma.user.update({
      where: { id },
      data: {
        email,
        name: input.name?.trim() || null,
        role: input.role,
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
}

export async function updateUserPassword(id: string, password: string) {
  await requireAdminSession();

  if (password.trim().length < 8) {
    throw new UserRepoError(
      "La contraseña debe tener al menos 8 caracteres.",
      400,
    );
  }

  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });

  if (!user) {
    throw new UserRepoError("Usuario no encontrado.", 404);
  }

  await prisma.user.update({
    where: { id },
    data: { password: await hashPassword(password) },
  });
}

export async function listUserFormOptions() {
  await requireAdminSession();

  const [inmobiliarias, advisors] = await Promise.all([
    prisma.inmobiliaria.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.advisor.findMany({
      where: { deletedAt: null },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, inmobiliariaId: true },
    }),
  ]);

  return { inmobiliarias, advisors };
}
