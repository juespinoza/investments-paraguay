import "server-only";

import { Role } from "@/generated/prisma";
import { z } from "zod";
import { hashPassword, normalizeEmail } from "@/lib/auth/user-bootstrap";
import { can, scopeFor } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import {
  canCreateInmobiliaria,
  canManageInmobiliariaAssignments,
  isAdmin,
} from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/require-session";
import type { SessionPayload } from "@/lib/data/types";
import {
  countInmobiliariaDependencies,
  syncAdvisorTenantAssignments,
} from "@/lib/virtualoffice/assignment-sync";
import {
  buildInmobiliariaCoreCreateData,
  buildInmobiliariaCoreUpdateData,
  InmobiliariaCoreSchema,
  type InmobiliariaCoreInput,
} from "@/lib/virtualoffice/inmobiliaria-core";
import {
  buildInmobiliariaLandingJson,
  InmobiliariaLandingThemeSchema,
  parseInmobiliariaLandingTheme,
} from "@/lib/virtualoffice/inmobiliaria-landing";
export { parseInmobiliariaLandingTheme } from "@/lib/virtualoffice/inmobiliaria-landing";

export class InmobiliariaRepoError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "InmobiliariaRepoError";
    this.status = status;
  }
}

export const InmobiliariaSchema = z.object({
  ...InmobiliariaCoreSchema.shape,
  landing: InmobiliariaLandingThemeSchema.optional(),
});

export type InmobiliariaInput = z.output<typeof InmobiliariaSchema>;
export type InmobiliariaLandingInput = z.output<
  typeof InmobiliariaLandingThemeSchema
>;

export type InmobiliariaWorkflowUserInput = {
  email: string;
  password: string;
  name?: string | null;
};

function resolveLandingThemeFromRecord(record: {
  themeJson?: unknown;
  landing?: { themeJson: unknown; deletedAt: Date | null } | null;
}) {
  return parseInmobiliariaLandingTheme(
    (record.landing?.deletedAt ? null : record.landing?.themeJson) ??
      record.themeJson,
  );
}

export async function requireInmobiliariaRoles() {
  const session = await requireSession();

  if (
    !can(session, "inmobiliaria_core", "read") &&
    !can(session, "inmobiliaria_landing", "read")
  ) {
    throw new InmobiliariaRepoError("Forbidden", 403);
  }

  return session;
}

async function requireInmobiliariaCoreSession(
  action: "read" | "update" | "delete_soft",
) {
  const session = await requireSession();
  if (!can(session, "inmobiliaria_core", action)) {
    throw new InmobiliariaRepoError("Forbidden", 403);
  }
  return session;
}

async function requireInmobiliariaLandingSession(
  action: "read" | "update" | "delete_soft",
) {
  const session = await requireSession();
  if (!can(session, "inmobiliaria_landing", action)) {
    throw new InmobiliariaRepoError("Forbidden", 403);
  }
  return session;
}

async function requireAdminInmobiliariaSession() {
  const session = await requireInmobiliariaRoles();

  if (!canManageInmobiliariaAssignments(session)) {
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

async function assertScopedInmobiliariaAccess(
  session: SessionPayload,
  resource: "inmobiliaria_core" | "inmobiliaria_landing",
  action: "read" | "update" | "delete_soft",
  id: string,
) {
  const agency = await assertInmobiliariaExists(id);
  const scope = scopeFor(session, resource, action);

  if (scope === "all") return agency;
  if (scope === "own" && session.inmobiliariaId === id) return agency;

  throw new InmobiliariaRepoError("Forbidden", 403);
}

export async function listInmobiliarias() {
  const session = await requireInmobiliariaCoreSession("read");
  const scope = scopeFor(session, "inmobiliaria_core", "read");

  return prisma.inmobiliaria.findMany({
    where: {
      deletedAt: null,
      ...(scope === "all" ? {} : { id: session.inmobiliariaId ?? "__none__" }),
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

async function validateFeaturedPropertyIds(
  inmobiliariaId: string,
  featuredPropertyIds: string[] | undefined,
) {
  const ids = (featuredPropertyIds ?? []).filter(Boolean).slice(0, 6);
  if (!ids.length) return [];

  const found = await prisma.property.findMany({
    where: {
      id: { in: ids },
      deletedAt: null,
      inmobiliariaId,
    },
    select: { id: true },
  });

  if (found.length !== ids.length) {
    throw new InmobiliariaRepoError(
      "Solo puedes destacar propiedades activas de tu propia inmobiliaria.",
      400,
    );
  }

  return ids;
}

export async function getInmobiliariaById(id: string) {
  const session = await requireInmobiliariaCoreSession("read");
  await assertScopedInmobiliariaAccess(session, "inmobiliaria_core", "read", id);

  const inmobiliaria = await prisma.inmobiliaria.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      themeJson: true,
      landing: {
        select: { themeJson: true, deletedAt: true },
      },
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

  const [users, advisorUsers, advisors, properties, availableUsers, availableAdvisors] =
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
      prisma.property.findMany({
        where: { inmobiliariaId: id, deletedAt: null },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      }),
      isAdmin(session)
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
      isAdmin(session)
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
    landingTheme: resolveLandingThemeFromRecord(inmobiliaria),
    users,
    advisors: advisors.map((advisor) => ({
      ...advisor,
      linkedUsers: linkedUsersByAdvisorId.get(advisor.id) ?? [],
    })),
    properties,
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

function normalizeWorkflowUserInput(
  user?: InmobiliariaWorkflowUserInput,
): InmobiliariaWorkflowUserInput | null {
  if (!user) return null;

  const email = normalizeEmail(user.email);
  if (!email) {
    throw new InmobiliariaRepoError("El email del usuario es obligatorio.", 400);
  }

  if (user.password.trim().length < 8) {
    throw new InmobiliariaRepoError(
      "La contraseña del usuario debe tener al menos 8 caracteres.",
      400,
    );
  }

  return {
    email,
    password: user.password,
    name: user.name?.trim() || null,
  };
}

export async function createInmobiliaria(
  input: InmobiliariaInput,
  workflowUser?: InmobiliariaWorkflowUserInput,
) {
  const session = await requireInmobiliariaRoles();
  if (!canCreateInmobiliaria(session)) {
    throw new InmobiliariaRepoError("Solo un admin puede crear inmobiliarias.", 403);
  }

  const user = normalizeWorkflowUserInput(workflowUser);

  try {
    return await prisma.$transaction(async (tx) => {
      const inmobiliaria = await tx.inmobiliaria.create({
        data: {
          ...buildInmobiliariaCoreCreateData(input as InmobiliariaCoreInput),
          themeJson: buildInmobiliariaLandingJson(input.landing),
        },
        select: { id: true },
      });

      if (input.landing) {
        await tx.inmobiliariaLanding.create({
          data: {
            inmobiliariaId: inmobiliaria.id,
            themeJson: buildInmobiliariaLandingJson(input.landing),
          },
          select: { id: true },
        });
      }

      if (user) {
        await tx.user.create({
          data: {
            email: user.email,
            name: user.name ?? null,
            password: await hashPassword(user.password),
            role: Role.INMOBILIARIA,
            inmobiliariaId: inmobiliaria.id,
            advisorId: null,
          },
          select: { id: true },
        });
      }

      return inmobiliaria;
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      const target =
        "meta" in error &&
        typeof (error as { meta?: { target?: unknown } }).meta?.target !==
          "undefined"
          ? String((error as { meta?: { target?: unknown } }).meta?.target)
          : "";

      if (target.includes("email")) {
        throw new InmobiliariaRepoError(
          "Ya existe un usuario con ese email.",
          409,
        );
      }

      throw new InmobiliariaRepoError("El slug ya existe.", 409);
    }
    throw error;
  }
}

export async function updateInmobiliaria(id: string, input: InmobiliariaInput) {
  await updateInmobiliariaCore(id, input as InmobiliariaCoreInput);
  return updateInmobiliariaLanding(id, input.landing);
}

export async function updateInmobiliariaCore(
  id: string,
  input: InmobiliariaCoreInput,
) {
  const session = await requireInmobiliariaCoreSession("update");
  await assertScopedInmobiliariaAccess(
    session,
    "inmobiliaria_core",
    "update",
    id,
  );

  try {
    return await prisma.inmobiliaria.update({
      where: { id },
      data: buildInmobiliariaCoreUpdateData(input),
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

export async function updateInmobiliariaLanding(
  id: string,
  input?: InmobiliariaLandingInput,
) {
  const session = await requireInmobiliariaLandingSession("update");
  await assertScopedInmobiliariaAccess(
    session,
    "inmobiliaria_landing",
    "update",
    id,
  );
  const featuredPropertyIds = await validateFeaturedPropertyIds(
    id,
    input?.featuredPropertyIds,
  );

  try {
    const landingJson = buildInmobiliariaLandingJson(input, featuredPropertyIds);

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.inmobiliaria.update({
        where: { id },
        data: {
          themeJson: landingJson,
        },
        select: { id: true },
      });

      await tx.inmobiliariaLanding.upsert({
        where: { inmobiliariaId: id },
        create: {
          inmobiliariaId: id,
          themeJson: landingJson,
        },
        update: {
          themeJson: landingJson,
          deletedAt: null,
        },
        select: { id: true },
      });

      return updated;
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
  const session = await requireInmobiliariaCoreSession("delete_soft");
  if (!isAdmin(session)) {
    throw new InmobiliariaRepoError(
      "Solo un admin puede desactivar inmobiliarias.",
      403,
    );
  }

  await assertScopedInmobiliariaAccess(
    session,
    "inmobiliaria_core",
    "delete_soft",
    id,
  );

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
