import "server-only";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { SessionPayload } from "@/lib/data/types";
import { Prisma } from "@/generated/prisma";

export class PropertyRepoError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "PropertyRepoError";
    this.status = status;
  }
}

export const PropertyUpsertSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().min(3),
  city: z.string().trim().nullable().optional(),
  neighborhood: z.string().trim().nullable().optional(),
  address: z.string().trim().nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  roiAnnualPct: z.number().min(0).max(100).nullable().optional(),
  appreciationAnnualPct: z.number().min(0).max(100).nullable().optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().int().nullable().optional(),
  priceUsd: z.number().int().positive().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  coverImageUrl: z.string().trim().nullable().optional(),
  gallery: z.array(z.string().trim()).default([]),
  advisorId: z.string().trim().nullable().optional(),
  inmobiliariaId: z.string().trim().nullable().optional(),
});

export type PropertyUpsertInput = z.output<typeof PropertyUpsertSchema>;

type ScopedProperty = {
  id: string;
  inmobiliariaId: string | null;
  advisorId: string | null;
  isFeatured: boolean;
  featuredOrder: number | null;
};

export function canCreateProperty(session: SessionPayload) {
  return session.role === "ADMIN" || session.role === "INMOBILIARIA";
}

export function canDeleteProperty(session: SessionPayload) {
  return session.role === "ADMIN" || session.role === "INMOBILIARIA";
}

export function canEditProperty(session: SessionPayload) {
  return (
    session.role === "ADMIN" ||
    session.role === "INMOBILIARIA" ||
    session.role === "ASESOR"
  );
}

export async function getPropertyFormOptions(session: SessionPayload) {
  const [inmobiliarias, advisors] = await Promise.all([
    session.role === "ADMIN"
      ? prisma.inmobiliaria.findMany({
          where: { deletedAt: null },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
    prisma.advisor.findMany({
      where: {
        deletedAt: null,
        ...(session.role === "ADMIN"
          ? {}
          : session.role === "INMOBILIARIA"
            ? { inmobiliariaId: session.inmobiliariaId ?? "__none__" }
            : { id: session.advisorId ?? "__none__" }),
      },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, inmobiliariaId: true },
    }),
  ]);

  return { inmobiliarias, advisors };
}

export async function assertPropertyScope(
  session: SessionPayload,
  propertyId: string,
): Promise<ScopedProperty> {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, deletedAt: null },
    select: {
      id: true,
      inmobiliariaId: true,
      advisorId: true,
      isFeatured: true,
      featuredOrder: true,
    },
  });

  if (!property) {
    throw new PropertyRepoError("Not found", 404);
  }

  if (session.role === "ADMIN") return property;

  if (session.role === "INMOBILIARIA") {
    if (
      !session.inmobiliariaId ||
      property.inmobiliariaId !== session.inmobiliariaId
    ) {
      throw new PropertyRepoError("Forbidden", 403);
    }
    return property;
  }

  if (session.role === "ASESOR") {
    if (!session.advisorId || property.advisorId !== session.advisorId) {
      throw new PropertyRepoError("Forbidden", 403);
    }
    return property;
  }

  throw new PropertyRepoError("Forbidden", 403);
}

async function getAdvisorIfValid(advisorId: string) {
  const advisor = await prisma.advisor.findFirst({
    where: { id: advisorId, deletedAt: null },
    select: { id: true, inmobiliariaId: true },
  });

  if (!advisor) {
    throw new PropertyRepoError("El asesor seleccionado no existe.", 400);
  }

  return advisor;
}

export async function resolvePropertyAssignments(
  session: SessionPayload,
  data: PropertyUpsertInput,
  current?: ScopedProperty,
) {
  if (session.role === "ASESOR") {
    if (!session.advisorId) {
      throw new PropertyRepoError("Missing advisor scope", 403);
    }

    const advisor = await getAdvisorIfValid(session.advisorId);

    return {
      advisorId: advisor.id,
      inmobiliariaId:
        advisor.inmobiliariaId ?? current?.inmobiliariaId ?? session.inmobiliariaId ?? null,
      isFeatured: current?.isFeatured ?? false,
      featuredOrder: current?.featuredOrder ?? null,
    };
  }

  let inmobiliariaId =
    session.role === "ADMIN"
      ? data.inmobiliariaId ?? current?.inmobiliariaId ?? null
      : session.inmobiliariaId ?? null;

  if (session.role !== "ADMIN" && !inmobiliariaId) {
    throw new PropertyRepoError("Missing inmobiliaria scope", 403);
  }

  const advisorId = data.advisorId ?? null;
  if (advisorId) {
    const advisor = await getAdvisorIfValid(advisorId);

    if (inmobiliariaId && advisor.inmobiliariaId !== inmobiliariaId) {
      throw new PropertyRepoError(
        "El asesor no pertenece a la inmobiliaria seleccionada.",
        400,
      );
    }

    if (!inmobiliariaId && advisor.inmobiliariaId) {
      inmobiliariaId = advisor.inmobiliariaId;
    }
  }

  return {
    advisorId,
    inmobiliariaId,
    isFeatured: data.isFeatured ?? false,
    featuredOrder: data.featuredOrder ?? null,
  };
}

export function buildPropertyListWhere(
  session: SessionPayload,
  query?: { q?: string; advisorId?: string },
): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = { deletedAt: null };

  if (session.role === "INMOBILIARIA") {
    where.inmobiliariaId = session.inmobiliariaId ?? "__none__";
  } else if (session.role === "ASESOR") {
    where.advisorId = session.advisorId ?? "__none__";
  } else if (session.role !== "ADMIN") {
    throw new PropertyRepoError("Forbidden", 403);
  }

  if (query?.advisorId && session.role !== "ASESOR") {
    where.advisorId = query.advisorId;
  }

  const q = query?.q?.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
      { slug: { contains: q, mode: Prisma.QueryMode.insensitive } },
      { city: { contains: q, mode: Prisma.QueryMode.insensitive } },
    ];
  }

  return where;
}
