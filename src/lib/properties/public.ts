import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { PublicPropertyListItem } from "@/lib/api/types";

// Etiqueta de caché compartida por home, listado, fichas y API pública.
// La oficina virtual la invalida al crear, editar o borrar una propiedad
// (ver revalidatePublicProperties), así todas las páginas muestran el mismo
// precio y el mismo inventario.
export const PUBLIC_PROPERTIES_TAG = "public-properties";

// Respaldo por si una edición se hace por fuera de la oficina virtual
// (por ejemplo, directo en la base).
const PUBLIC_PROPERTIES_REVALIDATE_SECONDS = 300;

export type PublicPropertyDetailRecord = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  coverImageUrl: string | null;
  gallery: string[];
  priceUsd: number | null;
  propertyType: string | null;
  bedrooms: string | null;
  bathrooms: number | null;
  areaM2: number | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  roiAnnualPct: number | null;
  appreciationAnnualPct: number | null;
  advisor: {
    slug: string;
    fullName: string;
    headline: string | null;
    photoUrl: string | null;
    whatsapp: string | null;
    phone: string | null;
  } | null;
};

function toNumber(value: { toString(): string } | null | undefined) {
  if (value === null || value === undefined) return null;
  const parsed = Number(value.toString());
  return Number.isFinite(parsed) ? parsed : null;
}

async function queryPublicProperties(): Promise<PublicPropertyListItem[]> {
  const properties = await prisma.property.findMany({
    where: { deletedAt: null },
    orderBy: [
      { isFeatured: "desc" },
      { featuredOrder: "asc" },
      { updatedAt: "desc" },
    ],
    select: {
      slug: true,
      title: true,
      description: true,
      coverImageUrl: true,
      priceUsd: true,
      city: true,
      neighborhood: true,
      latitude: true,
      longitude: true,
      roiAnnualPct: true,
      appreciationAnnualPct: true,
      updatedAt: true,
      isFeatured: true,
      featuredOrder: true,
      advisor: {
        select: {
          slug: true,
          fullName: true,
        },
      },
    },
  });

  const items = properties.map((p) => ({
    slug: p.slug,
    title: p.title,
    subtitle: p.description,
    coverImageUrl: p.coverImageUrl,
    priceUsd: p.priceUsd,
    city: p.city,
    neighborhood: p.neighborhood,
    latitude: toNumber(p.latitude),
    longitude: toNumber(p.longitude),
    updatedAt: p.updatedAt.toISOString(),
    isFeatured: p.isFeatured,
    featuredOrder: p.featuredOrder,
    roiAnnualPct: toNumber(p.roiAnnualPct),
    appreciationAnnualPct: toNumber(p.appreciationAnnualPct),
    advisor: p.advisor
      ? { slug: p.advisor.slug, fullName: p.advisor.fullName }
      : null,
  }));

  // Postgres ordena los NULL de featuredOrder al final en ASC, pero lo
  // repetimos acá para que el orden no dependa del motor.
  return items.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    const aOrder = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

async function queryPublicProperty(
  slug: string,
): Promise<PublicPropertyDetailRecord | null> {
  const property = await prisma.property.findFirst({
    where: { slug, deletedAt: null },
    include: {
      advisor: {
        select: {
          slug: true,
          fullName: true,
          headline: true,
          photoUrl: true,
          whatsapp: true,
          phone: true,
        },
      },
    },
  });

  if (!property) return null;

  return {
    slug: property.slug,
    title: property.title,
    subtitle: property.description,
    description: property.description,
    coverImageUrl: property.coverImageUrl,
    gallery: property.gallery,
    priceUsd: property.priceUsd,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaM2: toNumber(property.areaM2),
    city: property.city,
    neighborhood: property.neighborhood,
    address: property.address,
    latitude: toNumber(property.latitude),
    longitude: toNumber(property.longitude),
    roiAnnualPct: toNumber(property.roiAnnualPct),
    appreciationAnnualPct: toNumber(property.appreciationAnnualPct),
    advisor: property.advisor
      ? {
          slug: property.advisor.slug,
          fullName: property.advisor.fullName,
          headline: property.advisor.headline,
          photoUrl: property.advisor.photoUrl,
          whatsapp: property.advisor.whatsapp,
          phone: property.advisor.phone,
        }
      : null,
  };
}

export const listPublicProperties = unstable_cache(
  queryPublicProperties,
  ["public-properties:list"],
  {
    tags: [PUBLIC_PROPERTIES_TAG],
    revalidate: PUBLIC_PROPERTIES_REVALIDATE_SECONDS,
  },
);

export const getPublicProperty = unstable_cache(
  queryPublicProperty,
  ["public-properties:detail"],
  {
    tags: [PUBLIC_PROPERTIES_TAG],
    revalidate: PUBLIC_PROPERTIES_REVALIDATE_SECONDS,
  },
);

// Precio de entrada más bajo entre propiedades con ROI cargado. Se usa en
// la home para que el dato "desde USD X" coincida con el inventario real.
export function getEntryPriceUsd(properties: PublicPropertyListItem[]) {
  const prices = properties
    .filter((property) => property.roiAnnualPct !== null)
    .map((property) => property.priceUsd)
    .filter((price): price is number => typeof price === "number" && price > 0);

  return prices.length ? Math.min(...prices) : null;
}
