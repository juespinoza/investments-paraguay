import "server-only";

import { Role } from "@/generated/prisma";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import type { SessionPayload } from "@/lib/data/types";
import {
  countInmobiliariaDependencies,
  syncAdvisorTenantAssignments,
} from "@/lib/virtualoffice/assignment-sync";

export class InmobiliariaRepoError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "InmobiliariaRepoError";
    this.status = status;
  }
}

export const InmobiliariaSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  description: z.string().trim().nullable().optional(),
  logoUrl: z.string().trim().nullable().optional(),
});

export type InmobiliariaInput = z.output<typeof InmobiliariaSchema>;

export async function requireInmobiliariaRoles() {
  const session = await requireSession();

  if (session.role !== "ADMIN" && session.role !== "INMOBILIARIA") {
    throw new InmobiliariaRepoError("Forbidden", 403);
  }

  return session;
}

async function requireAdminInmobiliariaSession() {
  const session = await requireInmobiliariaRoles();

  if (session.role !== "ADMIN") {
    throw new InmobiliariaRepoError(
      "Solo un admin puede gestionar asignaciones.",
      403,
    );
  }

  return session;
}

async function assertInmobiliariaExists(id: string) {
  const agency = await prisma.inmobiliaria.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });

  if (!agency) {
    throw new InmobiliariaRepoError("Inmobiliaria no encontrada.", 404);
  }

  return agency;
}

async function assertInmobiliariaScope(session: SessionPayload, id: string) {
  const agency = await assertInmobiliariaExists(id);

  if (session.role === "INMOBILIARIA" && session.inmobiliariaId !== id) {
    throw new InmobiliariaRepoError("Forbidden", 403);
  }

  return agency;
}

export async function listInmobiliarias() {
  const session = await requireInmobiliariaRoles();

  return prisma.inmobiliaria.findMany({
    where: {
      deletedAt: null,
      ...(session.role === "ADMIN" ? {} : { id: session.inmobiliariaId ?? "__none__" }),
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      updatedAt: true,
      _count: {
        select: {
          advisors: { where: { deletedAt: null } },
          properties: { where: { deletedAt: null } },
          blogs: { where: { deletedAt: null } },
        },
      },
    },
  });
}

export async function getInmobiliariaById(id: string) {
  const session = await requireInmobiliariaRoles();
  await assertInmobiliariaScope(session, id);

  const inmobiliaria = await prisma.inmobiliaria.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      updatedAt: true,
      createdAt: true,
      _count: {
        select: {
          advisors: { where: { deletedAt: null } },
          properties: { where: { deletedAt: null } },
          blogs: { where: { deletedAt: null } },
        },
      },
    },
  });

  if (!inmobiliaria) {
    return null;
  }

  const [users, advisorUsers, advisors, availableUsers, availableAdvisors] =
    await Promise.all([
      prisma.user.findMany({
        where: { inmobiliariaId: id, deletedAt: null },
        orderBy: [{ role: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          advisorId: true,
          createdAt: true,
        },
      }),
      prisma.user.findMany({
        where: {
          deletedAt: null,
          advisorId: { not: null },
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          advisorId: true,
          name: true,
          email: true,
        },
      }),
      prisma.advisor.findMany({
        where: { inmobiliariaId: id, deletedAt: null },
        orderBy: { fullName: "asc" },
        select: {
          id: true,
          fullName: true,
          slug: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              properties: { where: { deletedAt: null } },
              blogs: { where: { deletedAt: null } },
            },
          },
        },
      }),
      session.role === "ADMIN"
        ? prisma.user.findMany({
            where: {
              deletedAt: null,
              role: Role.INMOBILIARIA,
            },
            orderBy: { email: "asc" },
            select: {
              id: true,
              email: true,
              name: true,
              inmobiliariaId: true,
            },
          })
        : Promise.resolve([]),
      session.role === "ADMIN"
        ? prisma.advisor.findMany({
            where: { deletedAt: null },
            orderBy: { fullName: "asc" },
            select: {
              id: true,
              fullName: true,
              inmobiliariaId: true,
              inmobiliaria: {
                select: { id: true, name: true },
              },
            },
          })
        : Promise.resolve([]),
    ]);

  const linkedUsersByAdvisorId = new Map<
    string,
    Array<{ id: string; name: string | null; email: string }>
  >();

  for (const user of advisorUsers) {
    if (!user.advisorId) continue;
    const current = linkedUsersByAdvisorId.get(user.advisorId) ?? [];
    current.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    linkedUsersByAdvisorId.set(user.advisorId, current);
  }

  return {
    ...inmobiliaria,
    users,
    advisors: advisors.map((advisor) => ({
      ...advisor,
      linkedUsers: linkedUsersByAdvisorId.get(advisor.id) ?? [],
    })),
    availableUsers: availableUsers.map((user) => ({
      ...user,
      isAssignedHere: user.inmobiliariaId === id,
    })),
    availableAdvisors: availableAdvisors.map((advisor) => ({
      id: advisor.id,
      fullName: advisor.fullName,
      inmobiliariaId: advisor.inmobiliariaId,
      inmobiliariaName: advisor.inmobiliaria?.name ?? null,
      isAssignedHere: advisor.inmobiliariaId === id,
    })),
  };
}

export async function createInmobiliaria(input: InmobiliariaInput) {
  const session = await requireInmobiliariaRoles();
  if (session.role !== "ADMIN") {
    throw new InmobiliariaRepoError("Solo un admin puede crear inmobiliarias.", 403);
  }

  try {
    return await prisma.inmobiliaria.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        logoUrl: input.logoUrl ?? null,
      },
      select: { id: true },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      throw new InmobiliariaRepoError("El slug ya existe.", 409);
    }
    throw error;
  }
}

export async function updateInmobiliaria(id: string, input: InmobiliariaInput) {
  const session = await requireInmobiliariaRoles();
  await assertInmobiliariaScope(session, id);

  try {
    return await prisma.inmobiliaria.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        logoUrl: input.logoUrl ?? null,
      },
      select: { id: true },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      throw new InmobiliariaRepoError("El slug ya existe.", 409);
    }
    throw error;
  }
}

export async function softDeleteInmobiliaria(id: string) {
  const session = await requireInmobiliariaRoles();
  if (session.role !== "ADMIN") {
    throw new InmobiliariaRepoError(
      "Solo un admin puede desactivar inmobiliarias.",
      403,
    );
  }

  await assertInmobiliariaScope(session, id);

  const dependencies = await countInmobiliariaDependencies(prisma, id);
  if (
    dependencies.users > 0 ||
    dependencies.advisors > 0 ||
    dependencies.properties > 0 ||
    dependencies.blogs > 0
  ) {
    const parts = [
      dependencies.users ? `${dependencies.users} usuarios` : null,
      dependencies.advisors ? `${dependencies.advisors} asesores` : null,
      dependencies.properties ? `${dependencies.properties} propiedades` : null,
      dependencies.blogs ? `${dependencies.blogs} posts` : null,
    ].filter(Boolean);

    throw new InmobiliariaRepoError(
      `No se puede desactivar la inmobiliaria mientras tenga relaciones activas: ${parts.join(", ")}.`,
      400,
    );
  }

  await prisma.inmobiliaria.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function assignUserToInmobiliaria(
  inmobiliariaId: string,
  userId: string,
) {
  await requireAdminInmobiliariaSession();
  await assertInmobiliariaExists(inmobiliariaId);

  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      role: true,
      advisorId: true,
    },
  });

  if (!user) {
    throw new InmobiliariaRepoError("Usuario no encontrado.", 404);
  }

  if (user.role !== Role.INMOBILIARIA) {
    throw new InmobiliariaRepoError(
      "Solo se pueden vincular usuarios con rol INMOBILIARIA.",
      400,
    );
  }

  if (user.advisorId) {
    throw new InmobiliariaRepoError(
      "El usuario ya está vinculado a un asesor y no puede actuar como usuario de inmobiliaria.",
      400,
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { inmobiliariaId },
  });
}

export async function unassignUserFromInmobiliaria(
  inmobiliariaId: string,
  userId: string,
) {
  await requireAdminInmobiliariaSession();
  await assertInmobiliariaExists(inmobiliariaId);

  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      inmobiliariaId: true,
      role: true,
    },
  });

  if (!user || user.inmobiliariaId !== inmobiliariaId) {
    throw new InmobiliariaRepoError(
      "Usuario no vinculado a esta inmobiliaria.",
      404,
    );
  }

  if (user.role !== Role.INMOBILIARIA) {
    throw new InmobiliariaRepoError(
      "Solo se pueden desvincular usuarios de inmobiliaria desde este módulo.",
      400,
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { inmobiliariaId: null },
  });
}

export async function assignAdvisorToInmobiliaria(
  inmobiliariaId: string,
  advisorId: string,
) {
  await requireAdminInmobiliariaSession();
  await assertInmobiliariaExists(inmobiliariaId);

  const advisor = await prisma.advisor.findFirst({
    where: { id: advisorId, deletedAt: null },
    select: { id: true },
  });

  if (!advisor) {
    throw new InmobiliariaRepoError("Asesor no encontrado.", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.advisor.update({
      where: { id: advisorId },
      data: { inmobiliariaId },
    });

    await syncAdvisorTenantAssignments(tx, advisorId, inmobiliariaId);
  });
}

export async function unassignAdvisorFromInmobiliaria(
  inmobiliariaId: string,
  advisorId: string,
) {
  await requireAdminInmobiliariaSession();
  await assertInmobiliariaExists(inmobiliariaId);

  const advisor = await prisma.advisor.findFirst({
    where: { id: advisorId, deletedAt: null },
    select: {
      id: true,
      inmobiliariaId: true,
    },
  });

  if (!advisor || advisor.inmobiliariaId !== inmobiliariaId) {
    throw new InmobiliariaRepoError(
      "Asesor no vinculado a esta inmobiliaria.",
      404,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.advisor.update({
      where: { id: advisorId },
      data: { inmobiliariaId: null },
    });

    await syncAdvisorTenantAssignments(tx, advisorId, null);
  });
}
