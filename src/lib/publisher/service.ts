import "server-only";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { revalidatePublicProperties } from "@/lib/cache/revalidate";
import { assignCategoriesInTransaction } from "@/lib/virtualoffice/properties";
import { SITE_URL } from "@/lib/seo";
import { buildPropertySlug, resolveStatus } from "@/lib/publisher/core";
import type { PublisherPropertyInput } from "@/lib/publisher/schema";
import { syncPublisherImages } from "@/lib/publisher/images";

export class PublisherError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const propertySelect = {
  id: true,
  slug: true,
  title: true,
  status: true,
  externalSource: true,
  externalId: true,
  coverImageUrl: true,
  gallery: true,
  updatedAt: true,
  deletedAt: true,
} as const;

type StoredProperty = Prisma.PropertyGetPayload<{ select: typeof propertySelect }>;

export function describeProperty(property: StoredProperty) {
  return {
    id: property.id,
    source: property.externalSource,
    externalId: property.externalId,
    slug: property.slug,
    title: property.title,
    status: property.status,
    deleted: Boolean(property.deletedAt),
    imageCount: property.gallery.length,
    // Los borradores no se ven en el sitio: url sirve una vez publicada.
    url: `${SITE_URL}/es/bienes-raices/propiedades/${property.slug}`,
    reviewUrl: `${SITE_URL}/virtual-office/propiedades/${property.id}/edit`,
    updatedAt: property.updatedAt.toISOString(),
  };
}

export async function findPublisherProperty(source: string, externalId: string) {
  return prisma.property.findUnique({
    where: { externalSource_externalId: { externalSource: source, externalId } },
    select: propertySelect,
  });
}

async function resolvePropertyTypeId(code: string) {
  const type = await prisma.propertyType.findUnique({
    where: { code },
    select: { id: true, isActive: true },
  });

  if (!type || !type.isActive) {
    const valid = await prisma.propertyType.findMany({
      where: { isActive: true },
      select: { code: true },
      orderBy: { code: "asc" },
    });
    throw new PublisherError(422, "unknown_property_type", `Tipo de propiedad desconocido: ${code}`, {
      validCodes: valid.map((item) => item.code),
    });
  }

  return type.id;
}

async function resolveAdvisor(slug: string | null | undefined) {
  if (slug === null) return { advisorId: null, inmobiliariaId: null };
  if (!slug) return undefined;

  const advisor = await prisma.advisor.findFirst({
    where: { slug, deletedAt: null },
    select: { id: true, inmobiliariaId: true },
  });

  if (!advisor) {
    throw new PublisherError(422, "unknown_advisor", `Asesor desconocido: ${slug}`);
  }

  return { advisorId: advisor.id, inmobiliariaId: advisor.inmobiliariaId ?? null };
}

async function uniqueSlug(base: string) {
  let candidate = base;
  for (let attempt = 2; attempt < 50; attempt++) {
    const taken = await prisma.property.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
    candidate = `${base}-${attempt}`;
  }
  throw new PublisherError(409, "slug_conflict", "No se pudo generar un slug único.");
}

// Solo los campos presentes en el pedido: omitido = no se toca, null = se borra.
function dataFields(input: PublisherPropertyInput) {
  const fields: Prisma.PropertyUncheckedUpdateInput = { title: input.title };
  const keys = [
    "description",
    "price",
    "currency",
    "city",
    "neighborhood",
    "address",
    "locationUrl",
    "latitude",
    "longitude",
    "areaM2",
    "roiAnnualPct",
    "appreciationAnnualPct",
    "hasPropertyDocuments",
  ] as const;

  for (const key of keys) {
    if (input[key] !== undefined) {
      (fields as Record<string, unknown>)[key] = input[key];
    }
  }

  return fields;
}

export type UpsertResult = {
  created: boolean;
  property: ReturnType<typeof describeProperty>;
  warnings: string[];
};

export async function upsertPublisherProperty(
  source: string,
  externalId: string,
  input: PublisherPropertyInput,
): Promise<UpsertResult> {
  const current = await findPublisherProperty(source, externalId);
  const isCreate = !current;

  if (isCreate && !input.propertyTypeCode) {
    throw new PublisherError(422, "missing_property_type", "propertyTypeCode es obligatorio al crear una propiedad.");
  }

  const propertyTypeId = input.propertyTypeCode
    ? await resolvePropertyTypeId(input.propertyTypeCode)
    : undefined;

  const advisor =
    (await resolveAdvisor(input.advisorSlug)) ??
    (isCreate
      ? await resolveAdvisor(process.env.PUBLISHER_DEFAULT_ADVISOR_SLUG || undefined)
      : undefined);

  const warnings: string[] = [];
  let images: { coverImageUrl: string | null; gallery: string[] } | undefined;

  if (input.images !== undefined) {
    const synced = await syncPublisherImages(source, externalId, input.images);
    warnings.push(...synced.warnings);

    if (synced.imageUrls.length || !input.images.length) {
      images = {
        coverImageUrl: synced.imageUrls[0] ?? null,
        gallery: synced.imageUrls,
      };
    } else if (current?.gallery.length) {
      warnings.push("No se pudo subir ninguna foto: se mantienen las fotos anteriores.");
    }
  }

  const status = resolveStatus(isCreate, current?.status ?? null, input.status);

  const saved = await prisma.$transaction(async (tx) => {
    const common = {
      ...dataFields(input),
      ...(propertyTypeId ? { propertyTypeId } : {}),
      ...(advisor ? advisor : {}),
      ...(images ?? {}),
    };

    const property = current
      ? await tx.property.update({
          where: { id: current.id },
          data: {
            ...common,
            status: status as Prisma.PropertyUncheckedUpdateInput["status"],
            // Reenviar una propiedad borrada desde el publicador la restaura.
            deletedAt: null,
          },
          select: propertySelect,
        })
      : await tx.property.create({
          data: {
            ...(common as Prisma.PropertyUncheckedCreateInput),
            title: input.title,
            propertyTypeId: propertyTypeId as string,
            slug: await uniqueSlug(buildPropertySlug(input.title, externalId)),
            status: "BORRADOR",
            externalSource: source,
            externalId,
          },
          select: propertySelect,
        });

    if (input.categories) {
      await assignCategoriesInTransaction(tx, property.id, input.categories);
    }

    return property;
  });

  revalidatePublicProperties();

  return { created: isCreate, property: describeProperty(saved), warnings };
}

export async function retirePublisherProperty(source: string, externalId: string) {
  const current = await findPublisherProperty(source, externalId);
  if (!current) {
    throw new PublisherError(404, "not_found", "No existe una propiedad con ese origen e id.");
  }

  const saved = await prisma.property.update({
    where: { id: current.id },
    data: { status: "RETIRADA", deletedAt: current.deletedAt ?? new Date() },
    select: propertySelect,
  });

  revalidatePublicProperties();
  return describeProperty(saved);
}
