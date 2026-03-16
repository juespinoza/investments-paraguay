import "server-only";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import type { SessionPayload } from "@/lib/data/types";

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

async function assertInmobiliariaScope(session: SessionPayload, id: string) {
  const agency = await prisma.inmobiliaria.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });

  if (!agency) {
    throw new InmobiliariaRepoError("Inmobiliaria no encontrada.", 404);
  }

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

  return prisma.inmobiliaria.findUnique({
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

  await prisma.inmobiliaria.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
