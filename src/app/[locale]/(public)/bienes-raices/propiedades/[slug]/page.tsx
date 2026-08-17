import { apiGet } from "@/lib/api/public";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LeadCaptureForm } from "@/components/leads/LeadCaptureForm";
import { resolveLocale } from "@/lib/content/public-pages";
import { PropertyAdvisorCard } from "@/components/landing/property-detail/PropertyAdvisorCard";
import { PropertyImageGallery } from "@/components/landing/property-detail/PropertyImageGallery";
import { PropertySpecs } from "@/components/landing/property-detail/PropertySpecs";
import { PropertyMap } from "@/components/PropertyMap";
import {
  RichPropertyText,
  toPlainPropertyText,
} from "@/components/landing/property-detail/RichPropertyText";

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
    image: property.coverImageUrl || "/images/logo.png",
    keywords: [
      property.title,
      property.city ?? "paraguay",
      "propiedad en venta paraguay",
      "inversión inmobiliaria paraguay",
    ],
  });
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;

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
  const investmentStats = [
    property.priceUsd
      ? {
          label: "Precio",
          value: `USD ${property.priceUsd.toLocaleString("en-US")}`,
        }
      : null,
    property.roiAnnualPct !== null
      ? {
          label: "ROI Anual aproximado",
          value: `${property.roiAnnualPct.toFixed(2)}%`,
        }
      : null,
    property.appreciationAnnualPct !== null
      ? {
          label: "Plusvalía Anual aproximada",
          value: `${property.appreciationAnnualPct.toFixed(2)}%`,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <>
      <section className="px-4 py-8 md:py-10">
        <div className="container-page">
          <div className="border-b border-soft pb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="eyebrow">Propiedad</div>
                  {property.propertyType ? (
                    <span className="rounded-full border border-soft bg-[var(--stone)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {property.propertyType}
                    </span>
                  ) : null}
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-primary md:text-6xl">
                  {property.title}
                </h1>
                {locationParts.length ? (
                  <p className="mt-4 text-base leading-7 text-secondary">
                    {locationParts.join(", ")}
                  </p>
                ) : null}
              </div>

              {property.priceUsd ? (
                <div className="surface-card min-w-[230px] rounded-[1.5rem] p-5 lg:text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                    Precio desde
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-primary">
                    USD {property.priceUsd.toLocaleString("en-US")}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <PropertyImageGallery
        title={property.title}
        coverImageUrl={property.coverImageUrl}
        gallery={property.gallery}
      />

      <PropertySpecs
        propertyType={property.propertyType}
        bedrooms={property.bedrooms}
        bathrooms={property.bathrooms}
        areaM2={property.areaM2}
      />

      {property.description || investmentStats.length ? (
        <section className="px-4 py-8 md:py-10">
          <div className="container-page">
            <div className="surface-card rounded-[1.75rem] p-6 md:p-8">
              {property.description ? (
                <>
                  <h2 className="text-3xl font-semibold tracking-tight text-primary">
                    Sobre la propiedad
                  </h2>
                  <div className="mt-5">
                    <RichPropertyText value={property.description} />
                  </div>
                </>
              ) : null}

              {investmentStats.length ? (
                <div className="mt-8 grid gap-4 border-t border-soft pt-6 md:grid-cols-3">
                  {investmentStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[1.25rem] border border-soft bg-[var(--stone)] p-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent1">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-primary">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {hasCoordinates ? (
        <section className="px-4 pb-4">
          <div className="container-page section-shell surface-card p-4 md:p-6">
            <h2 className="text-2xl font-semibold text-primary">
              Mapa de ubicación
            </h2>
            <p className="mt-2 text-sm text-secondary">
              Ubicación exacta por coordenadas geográficas.
            </p>
            <div className="mt-4">
              <PropertyMap properties={mapProperties} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-4 py-8">
        <div className="container-page grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="rounded-[1.75rem] border border-soft bg-[linear-gradient(180deg,var(--ivory)_0%,var(--stone)_100%)] p-6 shadow-[0_18px_48px_rgba(10,10,10,0.1)] md:p-8 lg:col-span-7">
            <div className="max-w-2xl">
              <div className="eyebrow">Contacto</div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-primary">
                Solicitar información
              </h2>
              <p className="mt-3 text-sm leading-7 text-secondary">
                Recibí asesoría y detalles de esta oportunidad de inversión.
              </p>
              <div className="mt-6">
                <LeadCaptureForm
                  compact
                  sourcePage={`/bienes-raices/propiedades/${property.slug}`}
                  propertySlug={property.slug}
                  advisorSlug={property.advisor?.slug}
                />
              </div>
            </div>
          </div>

          {property.advisor ? (
            <div className="lg:col-span-5">
              <PropertyAdvisorCard advisor={property.advisor} />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
