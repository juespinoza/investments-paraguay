import "server-only";
import { resolveImageSource } from "@/lib/image-source";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { formatPropertyTitle, positiveOrNull } from "@/lib/properties/text";
import {
  investmentAreaM2,
  toPublicStrategy,
  type PublicStrategy,
} from "@/lib/properties/strategy";
import { TRANSLATED_LOCALES } from "@/lib/properties/translate-locales";
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
  builtM2: number | null;
  landM2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  garages: number | null;
  amenities: string[];
  strategy: PublicStrategy | null;
  // Idiomas con contenido propio (español + traducciones existentes).
  contentLocales: string[];
  // true cuando título y descripción están en el idioma pedido.
  isTranslated: boolean;
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

const strategySelect = {
  select: {
    status: true,
    summary: true,
    rentStrategy: true,
    rentKind: true,
    monthlyRent: true,
    occupancyPct: true,
    managementFeePct: true,
    monthlyExpenses: true,
    annualTaxes: true,
    acquisitionCostsPct: true,
    appreciationPct: true,
    zonePricePerM2: true,
    zonePriceSource: true,
    comparables: true,
    businessOptions: true,
    zoneSummary: true,
    risks: true,
    methodology: true,
    updatedAt: true,
  },
} as const;

type StrategyRow = {
  status: "PENDING" | "READY";
  summary: string | null;
  rentStrategy: "LONG_TERM" | "SHORT_TERM" | "COMMERCIAL" | "RESALE" | null;
  rentKind: "ACTUAL" | "ESTIMATED" | null;
  monthlyRent: { toString(): string } | null;
  occupancyPct: { toString(): string } | null;
  managementFeePct: { toString(): string } | null;
  monthlyExpenses: { toString(): string } | null;
  annualTaxes: { toString(): string } | null;
  acquisitionCostsPct: { toString(): string } | null;
  appreciationPct: { toString(): string } | null;
  zonePricePerM2: { toString(): string } | null;
  zonePriceSource: string | null;
  comparables: unknown;
  businessOptions: unknown;
  zoneSummary: string | null;
  risks: string | null;
  methodology: string | null;
  updatedAt: Date;
};

function strategyRecord(row: StrategyRow) {
  return {
    ...row,
    monthlyRent: toNumber(row.monthlyRent),
    occupancyPct: toNumber(row.occupancyPct),
    managementFeePct: toNumber(row.managementFeePct),
    monthlyExpenses: toNumber(row.monthlyExpenses),
    annualTaxes: toNumber(row.annualTaxes),
    acquisitionCostsPct: toNumber(row.acquisitionCostsPct),
    appreciationPct: toNumber(row.appreciationPct),
    zonePricePerM2: toNumber(row.zonePricePerM2),
  };
}

// Un ROI solo se publica cuando la estrategia está lista: es el rendimiento
// bruto calculado con la renta de la estrategia, no un número suelto.
function publicRoi(strategy: PublicStrategy | null) {
  return strategy?.status === "READY"
    ? positiveOrNull(strategy.metrics.grossYieldPct)
    : null;
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
      updatedAt: true,
      isFeatured: true,
      featuredOrder: true,
      areaM2: true,
      builtM2: true,
      landM2: true,
      propertyType: propertyTypeSelect,
      strategy: strategySelect,
      translations: { select: { locale: true, title: true } },
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
    const strategy = p.strategy
      ? toPublicStrategy(
          strategyRecord(p.strategy),
          {
            price,
            areaM2: investmentAreaM2({
              propertyTypeCode: p.propertyType.code,
              areaM2: toNumber(p.areaM2),
              builtM2: toNumber(p.builtM2),
              landM2: toNumber(p.landM2),
            }),
          },
          null,
        )
      : null;
    return {
      slug: p.slug,
      title: formatPropertyTitle(p.title),
      titleTranslations: Object.fromEntries(
        p.translations.map((item) => [item.locale, item.title]),
      ),
      strategyStatus: strategy?.status ?? "PENDING",
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
      roiAnnualPct: publicRoi(strategy),
      appreciationAnnualPct:
        strategy?.status === "READY"
          ? positiveOrNull(strategy.appreciationPct)
          : null,
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
  locale: string = "es",
): Promise<PublicPropertyDetailRecord | null> {
  const property = await prisma.property.findFirst({
    where: {
      slug,
      deletedAt: null,
      status: { notIn: [...HIDDEN_PUBLIC_STATUSES] },
    },
    include: {
      propertyType: propertyTypeSelect,
      residentialDetails: {
        select: { bedrooms: true, bathrooms: true, garages: true },
      },
      strategy: strategySelect,
      translations: true,
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
  const translation =
    property.translations.find((item) => item.locale === locale) ?? null;
  const builtM2 = toNumber(property.builtM2);
  const landM2 = toNumber(property.landM2);
  const areaM2 = toNumber(property.areaM2);
  const strategy = property.strategy
    ? toPublicStrategy(
        strategyRecord(property.strategy),
        {
          price,
          areaM2: investmentAreaM2({
            propertyTypeCode: property.propertyType.code,
            areaM2,
            builtM2,
            landM2,
          }),
        },
        translation,
      )
    : null;
  const description = translation
    ? translation.description
    : property.description;
  const contentLocales = [
    "es",
    ...TRANSLATED_LOCALES.filter((code) =>
      property.translations.some((item) => item.locale === code),
    ),
  ];

  return {
    slug: property.slug,
    title: translation?.title ?? formatPropertyTitle(property.title),
    subtitle: description,
    description,
    isTranslated: locale === "es" || Boolean(translation),
    contentLocales,
    strategy,
    builtM2,
    landM2,
    amenities: property.amenities,
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
    bedrooms: property.residentialDetails?.bedrooms ?? null,
    bathrooms: property.residentialDetails?.bathrooms ?? null,
    garages: property.residentialDetails?.garages ?? null,
    areaM2,
    city: property.city,
    neighborhood: property.neighborhood,
    address: property.address,
    locationUrl: property.locationUrl,
    latitude: toNumber(property.latitude),
    longitude: toNumber(property.longitude),
    roiAnnualPct: publicRoi(strategy),
    appreciationAnnualPct:
      strategy?.status === "READY"
        ? positiveOrNull(strategy.appreciationPct)
        : null,
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

// Precio de entrada más bajo entre propiedades en dólares.
// Se usa en la home para que el dato "USD X" coincida con el inventario real.
export function getEntryPriceUsd(properties: PublicPropertyListItem[]) {
  const prices = properties
    .filter((property) => property.currency === "USD")
    .map((property) => property.price)
    .filter((price): price is number => typeof price === "number" && price > 0);

  return prices.length ? Math.min(...prices) : null;
}
