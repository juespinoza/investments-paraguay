import { apiGet } from "@/lib/api/public";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { resolveLocale } from "@/lib/content/public-pages";
import { StructuredData } from "@/components/seo/StructuredData";
import { PropertyContactSidebar } from "@/components/landing/property-detail/PropertyContactSidebar";
import { PropertyImageGallery } from "@/components/landing/property-detail/PropertyImageGallery";
import { PropertyMap } from "@/components/PropertyMap";
import { buildCloudinaryOpenGraphImageUrl } from "@/lib/cloudinary";
import { buildRealEstateListingJsonLd } from "@/lib/structured-data";
import {
  RichPropertyText,
  toPlainPropertyText,
} from "@/components/landing/property-detail/RichPropertyText";
import { Link } from "@/i18n/navigation";
import {
  Bath,
  Bed,
  Building2,
  MapPin,
  Maximize2,
  type LucideIcon,
} from "lucide-react";

export const revalidate = 120;

type PublicPropertyDetail = {
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
  const property = await apiGet<PublicPropertyDetail>(
    `/api/public/bienes-raices/${slug}`,
    revalidate,
  );

  if (!property) {
    return buildMetadata({
      title: "Propiedad en Paraguay | Investments Paraguay",
      description:
        "Explora oportunidades inmobiliarias en Paraguay con asesoría profesional.",
      pathname: `/bienes-raices/propiedades/${slug}`,
      locale: resolvedLocale,
      noIndex: true,
    });
  }

  const descriptionSource =
    property.description ??
    property.subtitle ??
    `Propiedad en ${property.city ?? "Paraguay"} con potencial de inversión.`;
  const description = toPlainPropertyText(descriptionSource);

  return buildMetadata({
    title: `${property.title} | Inversión inmobiliaria en Paraguay`,
    description,
    pathname: `/bienes-raices/propiedades/${slug}`,
    locale: resolvedLocale,
    image:
      buildCloudinaryOpenGraphImageUrl(property.coverImageUrl) ||
      "/images/logo.png",
    keywords: [
      property.title,
      property.city ?? "paraguay",
      "propiedad en venta paraguay",
      "inversión inmobiliaria paraguay",
    ],
  });
}

export default async function PropertyPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const resolvedLocale = resolveLocale(locale);

  const property = await apiGet<PublicPropertyDetail>(
    `/api/public/bienes-raices/${slug}`,
    120,
  );

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
            priceUsd: property.priceUsd,
            latitude: property.latitude,
            longitude: property.longitude,
          },
        ]
      : [];
  const hasCoordinates = mapProperties.length > 0;
  const validAreaM2 = numberValue(property.areaM2);
  const validBathrooms = numberValue(property.bathrooms);
  const featureTags = [
    textValue(property.propertyType)
      ? {
          label: "Tipo",
          value: textValue(property.propertyType),
          icon: Building2,
        }
      : null,
    validAreaM2 !== null
      ? {
          label: "Superficie",
          value: `${validAreaM2.toLocaleString("es-PY")} m²`,
          icon: Maximize2,
        }
      : null,
    textValue(property.bedrooms)
      ? {
          label: "Dormitorios",
          value: textValue(property.bedrooms),
          icon: Bed,
        }
      : null,
    validBathrooms !== null
      ? {
          label: "Baños",
          value: String(validBathrooms),
          icon: Bath,
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
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-[12px] text-muted"
            >
              <Link href="/" className="transition-colors hover:text-primary">
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/bienes-raices"
                className="transition-colors hover:text-primary"
              >
                Bienes raíces
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-primary">{property.title}</span>
            </nav>

            <div className="mt-6">
              <span className="inline-flex rounded-xs bg-[rgba(10,10,10,0.72)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white">
                En venta
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
                priceUsd={property.priceUsd}
                roiAnnualPct={property.roiAnnualPct}
                propertySlug={property.slug}
                advisor={property.advisor}
              />
            </div>

            <div className="my-8 h-px bg-(--line)" />

            {property.description ? (
              <section>
                <h2 className="font-cormorant text-[30px] font-normal text-primary">
                  Sobre la propiedad
                </h2>
                <div className="mt-5 text-base leading-[1.8] text-secondary">
                  <RichPropertyText value={property.description} />
                </div>
              </section>
            ) : null}

            {hasCoordinates ? (
              <section className="mt-10">
                <h2 className="font-cormorant text-[30px] font-normal text-primary">
                  Ubicación
                </h2>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  Ubicación exacta por coordenadas geográficas.
                </p>
                <div className="mt-5">
                  <PropertyMap properties={mapProperties} />
                </div>
              </section>
            ) : null}
          </div>

          <div className="hidden lg:block">
            <div className="lg:sticky lg:top-22">
              <PropertyContactSidebar
                priceUsd={property.priceUsd}
                roiAnnualPct={property.roiAnnualPct}
                propertySlug={property.slug}
                advisor={property.advisor}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
