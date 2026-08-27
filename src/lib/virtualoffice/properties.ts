import "server-only";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { SessionPayload } from "@/lib/data/types";
import { Prisma, type Supercategory } from "@/generated/prisma";
import {
  can,
  scopeFor,
  isAdmin,
  isAdvisor,
  isInmobiliaria,
} from "@/lib/auth/permissions";

export class PropertyRepoError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "PropertyRepoError";
    this.status = status;
  }
}

export const PropertySupercategorySchema = z.enum([
  "CONOCER",
  "VIVIR",
  "INVERTIR",
]);

export const CurrencySchema = z.enum(["GS", "USD"]);

export const PropertyStatusSchema = z.enum([
  "EN_VENTA",
  "EN_ALQUILER",
  "RESERVADA",
  "BORRADOR",
  "VENDIDA",
  "ALQUILADA",
  "RETIRADA",
]);

export const PropertyUpsertSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().min(3),
  city: z.string().trim().nullable().optional(),
  neighborhood: z.string().trim().nullable().optional(),
  address: z.string().trim().nullable().optional(),
  locationUrl: z.string().trim().nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  roiAnnualPct: z.number().min(0).max(100).nullable().optional(),
  appreciationAnnualPct: z.number().min(0).max(100).nullable().optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().int().nullable().optional(),
  price: z.number().positive().nullable().optional(),
  currency: CurrencySchema.default("USD"),
  status: PropertyStatusSchema.default("BORRADOR"),
  hasPropertyDocuments: z.boolean().optional(),
  propertyTypeId: z.string().trim().min(1),
  areaM2: z.number().positive().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  coverImageUrl: z.string().trim().nullable().optional(),
  gallery: z.array(z.string().trim()).default([]),
  categories: z.array(PropertySupercategorySchema).optional(),
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

function uniqueCategories(categories: Supercategory[]) {
  return Array.from(new Set(categories));
}

export async function assignCategoriesInTransaction(
  tx: Prisma.TransactionClient,
  propertyId: string,
  categories: Supercategory[],
) {
  const nextCategories = uniqueCategories(categories);

  await tx.propertyCategory.deleteMany({
    where: {
      propertyId,
      ...(nextCategories.length
        ? { category: { notIn: nextCategories } }
        : {}),
    },
  });

  if (nextCategories.length) {
    await tx.propertyCategory.createMany({
      data: nextCategories.map((category) => ({
        propertyId,
        category,
      })),
      skipDuplicates: true,
    });
  }

  return tx.propertyCategory.findMany({
    where: { propertyId },
    orderBy: { createdAt: "asc" },
  });
}

export async function assignCategories(
  propertyId: string,
  categories: Supercategory[],
) {
  return prisma.$transaction((tx) =>
    assignCategoriesInTransaction(tx, propertyId, categories),
  );
}

export function canCreateProperty(session: SessionPayload) {
  return can(session, "properties", "create");
}

export function canDeleteProperty(session: SessionPayload) {
  return can(session, "properties", "delete_soft");
}

export function canEditProperty(session: SessionPayload) {
  return can(session, "properties", "update");
}

export async function getPropertyFormOptions(session: SessionPayload) {
  const [inmobiliarias, advisors, propertyTypes] = await Promise.all([
    isAdmin(session)
      ? prisma.inmobiliaria.findMany({
          where: { deletedAt: null },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
    prisma.advisor.findMany({
      where: {
        deletedAt: null,
        ...(isAdmin(session)
          ? {}
          : isInmobiliaria(session)
            ? { inmobiliariaId: session.inmobiliariaId ?? "__none__" }
            : { id: session.advisorId ?? "__none__" }),
      },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, inmobiliariaId: true },
    }),
    prisma.propertyType.findMany({
      where: { isActive: true },
      orderBy: { label: "asc" },
      select: {
        id: true,
        code: true,
        label: true,
        isProject: true,
        hasResidentialDetails: true,
      },
    }),
  ]);

  return { inmobiliarias, advisors, propertyTypes };
}

export async function assertPropertyScope(
  session: SessionPayload,
  propertyId: string,
  action: "read" | "update" | "delete_soft" = "read",
): Promise<ScopedProperty> {
  if (!can(session, "properties", action)) {
    throw new PropertyRepoError("Forbidden", 403);
  }

  const property = await prisma.property.findFirst({
    where: { id: propertyId, deletedAt: null, status: { not: "RETIRADA" } },
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

  const scope = scopeFor(session, "properties", action);
  if (scope === "all") return property;

  if (scope === "advisor_properties") {
    if (
      !session.inmobiliariaId ||
      property.inmobiliariaId !== session.inmobiliariaId
    ) {
      throw new PropertyRepoError("Forbidden", 403);
    }
    return property;
  }

  if (scope === "self") {
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
  const propertyScope = scopeFor(
    session,
    "properties",
    current ? "update" : "create",
  );
  const advisorId = isAdvisor(session)
    ? session.advisorId ?? null
    : data.advisorId ?? null;

  let inmobiliariaId: string | null = null;
  if (advisorId) {
    const advisor = await getAdvisorIfValid(advisorId);
    if (
      propertyScope === "advisor_properties" &&
      advisor.inmobiliariaId !== (session.inmobiliariaId ?? null)
    ) {
      throw new PropertyRepoError(
        "Solo puedes asignar propiedades a asesores de tu inmobiliaria.",
        403,
      );
    }
    inmobiliariaId = advisor.inmobiliariaId ?? null;
  }

  return {
    advisorId,
    inmobiliariaId,
    isFeatured: isAdvisor(session)
      ? current?.isFeatured ?? false
      : data.isFeatured ?? false,
    featuredOrder: isAdvisor(session)
      ? current?.featuredOrder ?? null
      : data.featuredOrder ?? null,
  };
}

export function buildPropertyListWhere(
  session: SessionPayload,
  query?: { q?: string; advisorId?: string },
): Prisma.PropertyWhereInput {
  if (!can(session, "properties", "read")) {
    throw new PropertyRepoError("Forbidden", 403);
  }

  const where: Prisma.PropertyWhereInput = {
    deletedAt: null,
    status: { not: "RETIRADA" },
  };
  const scope = scopeFor(session, "properties", "read");

  if (scope === "advisor_properties") {
    where.inmobiliariaId = session.inmobiliariaId ?? "__none__";
  } else if (scope === "self") {
    where.advisorId = session.advisorId ?? "__none__";
  } else if (scope !== "all") {
    throw new PropertyRepoError("Forbidden", 403);
  }

  if (query?.advisorId && scope !== "self") {
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
