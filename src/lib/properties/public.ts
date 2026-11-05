import { resolveImageSource } from "@/lib/image-source";
import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type {
  PublicPropertyDetail,
  PublicPropertyListItem,
} from "@/lib/api/types";

// Etiqueta de caché compartida por home, listado, fichas y API pública.
// La oficina virtual la invalida al crear, editar o borrar una propiedad
// (ver revalidatePublicProperties), así todas las páginas muestran el mismo
// precio y el mismo inventario.
export const PUBLIC_PROPERTIES_TAG = "public-properties";

// Respaldo por si una edición se hace por fuera de la oficina virtual
// (por ejemplo, directo en la base).
const PUBLIC_PROPERTIES_REVALIDATE_SECONDS = 300;

// Estados que nunca se muestran en el sitio público.
export const HIDDEN_PUBLIC_STATUSES = ["BORRADOR", "RETIRADA"] as const;

export type PublicPropertyDetailRecord = PublicPropertyDetail & {
  areaM2: number | null;
  bedrooms: string | null;
  bathrooms: number | null;
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

const propertyTypeSelect = {
  select: {
    code: true,
    label: true,
    isProject: true,
    hasResidentialDetails: true,
  },
} as const;

async function queryPublicProperties(): Promise<PublicPropertyListItem[]> {
  const properties = await prisma.property.findMany({
    where: {
      deletedAt: null,
      status: { notIn: [...HIDDEN_PUBLIC_STATUSES] },
    },
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
      price: true,
      currency: true,
      status: true,
      hasPropertyDocuments: true,
      city: true,
      neighborhood: true,
      locationUrl: true,
      latitude: true,
      longitude: true,
      roiAnnualPct: true,
      appreciationAnnualPct: true,
      updatedAt: true,
      isFeatured: true,
      featuredOrder: true,
      propertyType: propertyTypeSelect,
      advisor: {
        select: {
          slug: true,
          fullName: true,
        },
      },
    },
  });

  const items: PublicPropertyListItem[] = properties.map((p) => {
    const price = toNumber(p.price);
    return {
      slug: p.slug,
      title: p.title,
      subtitle: p.description,
      coverImageUrl: p.coverImageUrl ? resolveImageSource(p.coverImageUrl) : null,
      price,
      // Se mantiene por compatibilidad: componentes viejos leen priceUsd.
      priceUsd: price,
      currency: p.currency,
      status: p.status,
      hasPropertyDocuments: p.hasPropertyDocuments,
      city: p.city,
      neighborhood: p.neighborhood,
      locationUrl: p.locationUrl,
      latitude: toNumber(p.latitude),
      longitude: toNumber(p.longitude),
      propertyType: p.propertyType.label,
      propertyTypeCode: p.propertyType.code,
      isProject: p.propertyType.isProject,
      hasResidentialDetails: p.propertyType.hasResidentialDetails,
      updatedAt: p.updatedAt.toISOString(),
      isFeatured: p.isFeatured,
      featuredOrder: p.featuredOrder,
      roiAnnualPct: toNumber(p.roiAnnualPct),
      appreciationAnnualPct: toNumber(p.appreciationAnnualPct),
      advisor: p.advisor
        ? { slug: p.advisor.slug, fullName: p.advisor.fullName }
        : null,
    };
  });

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
    where: {
      slug,
      deletedAt: null,
      status: { notIn: [...HIDDEN_PUBLIC_STATUSES] },
    },
    include: {
      propertyType: propertyTypeSelect,
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

  const price = toNumber(property.price);

  return {
    slug: property.slug,
    title: property.title,
    subtitle: property.description,
    description: property.description,
    coverImageUrl: property.coverImageUrl ? resolveImageSource(property.coverImageUrl) : null,
    gallery: property.gallery.map(resolveImageSource),
    price,
    priceUsd: price,
    currency: property.currency,
    status: property.status,
    hasPropertyDocuments: property.hasPropertyDocuments,
    propertyType: property.propertyType.label,
    propertyTypeCode: property.propertyType.code,
    isProject: property.propertyType.isProject,
    hasResidentialDetails: property.propertyType.hasResidentialDetails,
    // Dormitorios y baños pasan a los detalles residenciales del rediseño;
    // la ficha pública todavía no los muestra.
    bedrooms: null,
    bathrooms: null,
    areaM2: toNumber(property.areaM2),
    city: property.city,
    neighborhood: property.neighborhood,
    address: property.address,
    locationUrl: property.locationUrl,
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

// Precio de entrada más bajo entre propiedades en dólares con ROI cargado.
// Se usa en la home para que el dato "USD X" coincida con el inventario real.
export function getEntryPriceUsd(properties: PublicPropertyListItem[]) {
  const prices = properties
    .filter(
      (property) =>
        property.currency === "USD" && property.roiAnnualPct !== null,
    )
    .map((property) => property.price)
    .filter((price): price is number => typeof price === "number" && price > 0);

  return prices.length ? Math.min(...prices) : null;
}
