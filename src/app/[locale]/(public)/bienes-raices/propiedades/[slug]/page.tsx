import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { resolveLocale } from "@/lib/content/public-pages";
import { StructuredData } from "@/components/seo/StructuredData";
import { PropertyContactSidebar } from "@/components/landing/property-detail/PropertyContactSidebar";
import { PropertyImageGallery } from "@/components/landing/property-detail/PropertyImageGallery";
import { PropertyMap } from "@/components/PropertyMap";
import { GuideLeadMagnet } from "@/components/leads/GuideLeadMagnet";
import { buildCloudinaryOpenGraphImageUrl } from "@/lib/cloudinary";
import { buildRealEstateListingJsonLd } from "@/lib/structured-data";
import { getPublicProperty } from "@/lib/properties/public";
import { DEFAULT_LOCALE, formatLocale } from "@/lib/i18n";
import { formatPropertyPrice } from "@/lib/properties/format";
import {
  RichPropertyText,
  toPlainPropertyText,
} from "@/components/landing/property-detail/RichPropertyText";
import { Link } from "@/i18n/navigation";
import {
  Building2,
  MapPin,
  Maximize2,
  type LucideIcon,
} from "lucide-react";

export const revalidate = 120;

// Sin rutas en el build: cada página se genera en la primera visita y queda
// en la caché de Vercel hasta que vence el revalidate o se invalida.
export function generateStaticParams() {
  return [];
}

type PageProps = { params: Promise<{ locale: string; slug: string }> };

function textValue(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized || null;
}

function numberValue(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations({ locale, namespace: "site.detail" });
  const property = await getPublicProperty(slug);

  if (!property) {
    return buildMetadata({
      title: t("metaFallbackTitle"),
      description: t("metaFallbackDescription"),
      pathname: `/bienes-raices/propiedades/${slug}`,
      locale: resolvedLocale,
      noIndex: true,
    });
  }

  const numberFormat = formatLocale(locale);
  const priceLabel = formatPropertyPrice(
    property.price,
    property.currency,
    locale,
  );
  const location = [property.neighborhood, property.city]
    .filter(Boolean)
    .join(", ");
  // Resumen con los datos que decide un inversor (zona, precio, ROI) y, en
  // español, el comienzo de la descripción. buildMetadata lo corta a ~155.
  const summary = [
    location
      ? t("metaLocation", { title: property.title, location })
      : `${property.title}.`,
    priceLabel ? t("metaPrice", { price: priceLabel }) : null,
    property.roiAnnualPct !== null
      ? t("metaRoi", {
          roi: property.roiAnnualPct.toLocaleString(numberFormat, {
            maximumFractionDigits: 1,
          }),
        })
      : null,
    resolvedLocale === DEFAULT_LOCALE && property.description
      ? toPlainPropertyText(property.description)
      : null,
  ]
    .filter(Boolean)
    .join(" ");
  const ogImageUrl =
    buildCloudinaryOpenGraphImageUrl(property.coverImageUrl) ??
    `${SITE_URL}/images/og-home.jpg`;

  return buildMetadata({
    title: t("metaTitle", { title: property.title }),
    description: summary,
    pathname: `/bienes-raices/propiedades/${slug}`,
    locale: resolvedLocale,
    // La descripción de la propiedad todavía existe solo en español: las
    // versiones EN y PT apuntan su canonical a la española y no declaran
    // hreflang, para que Google no las marque como duplicadas. Cuando lleguen
    // las traducciones automáticas, cada idioma tendrá su propia URL canónica.
    contentLocale: DEFAULT_LOCALE,
    image: ogImageUrl,
    keywords: [
      property.title,
      property.city ?? "paraguay",
      t("keywordSale"),
      t("keywordInvestment"),
    ],
  });
}

export default async function PropertyPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations("site.detail");
  const tStatus = await getTranslations("site.status");
  const numberFormat = formatLocale(locale);

  const property = await getPublicProperty(slug);

  if (!property) notFound();

  const locationParts = [
    property.neighborhood,
    property.city,
    property.address,
  ].filter(Boolean);
  const mapProperties =
    property.latitude !== null && property.longitude !== null
      ? [
          {
            slug: property.slug,
            title: property.title,
            coverImageUrl: property.coverImageUrl,
            price: property.price,
            priceUsd: property.priceUsd,
            currency: property.currency,
            latitude: property.latitude,
            longitude: property.longitude,
          },
        ]
      : [];
  const hasCoordinates = mapProperties.length > 0;
  const validAreaM2 = numberValue(property.areaM2);
  const featureTags = [
    textValue(property.propertyType)
      ? {
          label: t("type"),
          value: textValue(property.propertyType),
          icon: Building2,
        }
      : null,
    validAreaM2 !== null
      ? {
          label: t("area"),
          value: `${validAreaM2.toLocaleString(numberFormat)} m²`,
          icon: Maximize2,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    icon: LucideIcon;
  }>;

  return (
    <>
      <StructuredData
        data={buildRealEstateListingJsonLd(property, {
          locale: resolvedLocale,
        })}
      />

      <PropertyImageGallery
        title={property.title}
        coverImageUrl={property.coverImageUrl}
        gallery={property.gallery}
      />

      <section className="px-4 pb-12 pt-2 md:px-6 md:pb-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,65fr)_minmax(320px,35fr)] lg:gap-12">
          <div>
            <nav
              aria-label={t("breadcrumbLabel")}
              className="flex flex-wrap items-center gap-2 text-[12px] text-muted"
            >
              <Link href="/" className="transition-colors hover:text-primary">
                {t("home")}
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/bienes-raices"
                className="transition-colors hover:text-primary"
              >
                {t("realEstate")}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-primary">{property.title}</span>
            </nav>

            <div className="mt-6">
              <span className="inline-flex rounded-xs bg-[rgba(10,10,10,0.72)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white">
                {tStatus(property.status)}
              </span>
            </div>

            <h1 className="mt-5 font-cormorant text-[36px] font-normal leading-[1.1] text-primary">
              {property.title}
            </h1>

            {locationParts.length ? (
              <p className="mt-4 flex items-start gap-2 text-[15px] leading-7 text-secondary">
                <MapPin
                  size={18}
                  strokeWidth={1.8}
                  className="mt-1 shrink-0 text-(--gold)"
                  aria-hidden="true"
                />
                <span>{locationParts.join(", ")}</span>
              </p>
            ) : null}

            {featureTags.length ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {featureTags.map((tag) => {
                  const Icon = tag.icon;

                  return (
                    <div
                      key={tag.label}
                      className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--stone) px-4 py-2 text-[13px] text-primary"
                    >
                      <Icon
                        size={15}
                        strokeWidth={1.8}
                        className="text-(--gold)"
                        aria-hidden="true"
                      />
                      <span className="font-medium">{tag.value}</span>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-8 lg:hidden">
              <PropertyContactSidebar
                price={property.price}
                priceUsd={property.priceUsd}
                currency={property.currency}
                roiAnnualPct={property.roiAnnualPct}
                propertySlug={property.slug}
                propertyTitle={property.title}
                advisor={property.advisor}
              />
            </div>

            <div className="my-8 h-px bg-(--line)" />

            {property.description ? (
              <section>
                <h2 className="font-cormorant text-[30px] font-normal text-primary">
                  {t("about")}
                </h2>
                {resolvedLocale !== DEFAULT_LOCALE ? (
                  <p
                    lang={resolvedLocale}
                    className="mt-3 rounded-xs border border-(--line) bg-(--stone) px-4 py-3 text-sm leading-6 text-secondary"
                  >
                    {t("originalLanguage")}
                  </p>
                ) : null}
                <div
                  lang={DEFAULT_LOCALE}
                  className="mt-5 text-base leading-[1.8] text-secondary"
                >
                  <RichPropertyText value={property.description} />
                </div>
              </section>
            ) : null}

            {hasCoordinates ? (
              <section className="mt-10">
                <h2 className="font-cormorant text-[30px] font-normal text-primary">
                  {t("location")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  {t("locationNote")}
                </p>
                <div className="mt-5">
                  <PropertyMap properties={mapProperties} />
                </div>
              </section>
            ) : null}

            <div className="mt-10">
              <GuideLeadMagnet
                location="property"
                propertySlug={property.slug}
                variant="card"
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="lg:sticky lg:top-22">
              <PropertyContactSidebar
                price={property.price}
                priceUsd={property.priceUsd}
                currency={property.currency}
                roiAnnualPct={property.roiAnnualPct}
                propertySlug={property.slug}
                propertyTitle={property.title}
                advisor={property.advisor}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
