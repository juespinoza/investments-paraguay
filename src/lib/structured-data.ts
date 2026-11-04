import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { AppLocale } from "@/lib/i18n";

type JsonLdObject = Record<string, unknown>;

type RealEstateListingInput = {
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  coverImageUrl?: string | null;
  gallery?: string[];
  price?: number | null;
  priceUsd?: number | null;
  currency?: "GS" | "USD" | null;
  city?: string | null;
  areaM2?: number | null;
};

type RealEstateListingOptions = {
  locale: AppLocale;
};

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function textValue(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized || null;
}

function numberValue(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function withLocalePrefix(locale: AppLocale, pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

function resolveImageUrl(imageUrl: string | null | undefined) {
  const value = textValue(imageUrl);
  if (!value) return null;

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/")) {
    return absoluteUrl(value);
  }

  if (!CLOUDINARY_CLOUD_NAME) return null;

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${value}`;
}

function cleanObject<T extends JsonLdObject>(input: T) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === "object" && !Array.isArray(value)) {
        return Object.keys(value as JsonLdObject).length > 0;
      }
      return true;
    }),
  ) as T;
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+595985444801",
      contactType: "sales",
    },
  } satisfies JsonLdObject;
}

export function buildRealEstateListingJsonLd(
  property: RealEstateListingInput,
  options: RealEstateListingOptions,
) {
  const pathname = `/bienes-raices/propiedades/${property.slug}`;
  const description = textValue(property.description) ?? textValue(property.subtitle);
  const primaryImage =
    resolveImageUrl(property.coverImageUrl) ??
    (property.gallery ?? []).map(resolveImageUrl).find(Boolean) ??
    null;
  const price = numberValue(property.price ?? property.priceUsd);
  const currency = textValue(property.currency) ?? "USD";
  const city = textValue(property.city);
  const areaM2 = numberValue(property.areaM2);

  return cleanObject({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description,
    url: absoluteUrl(withLocalePrefix(options.locale, pathname)),
    image: primaryImage ? [primaryImage] : undefined,
    offers:
      price !== null
        ? {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            availability: "https://schema.org/InStock",
          }
        : undefined,
    address: city
      ? {
          "@type": "PostalAddress",
          addressLocality: city,
          addressCountry: "PY",
        }
      : undefined,
    floorSize:
      areaM2 !== null
        ? {
            "@type": "QuantitativeValue",
            value: areaM2,
            unitCode: "MTK",
          }
        : undefined,
  });
}
