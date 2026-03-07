import { apiGet } from "@/lib/api/public";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ImageCloudinary } from "@/components/ui/ImageCloudinary";
import { SectionTitle } from "@/components/landing/SectionTitle";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LeadCaptureForm } from "@/components/leads/LeadCaptureForm";

export const revalidate = 120;

type PublicPropertyDetail = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  coverImageUrl: string | null;
  gallery: string[];
  priceUsd: number | null;
  city: string | null;
  mapQuery: string;
  roiAnnualApproxPct: number;
  appreciationAnnualApproxPct: number;
  advisor: {
    slug: string;
    fullName: string;
    headline: string | null;
    photoUrl: string;
    whatsapp: string | null;
  } | null;
};

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
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
      locale: "es",
      noIndex: true,
    });
  }

  const description =
    property.description ??
    property.subtitle ??
    `Propiedad en ${property.city ?? "Paraguay"} con potencial de inversión.`;

  return buildMetadata({
    title: `${property.title} | Inversión inmobiliaria en Paraguay`,
    description,
    pathname: `/bienes-raices/propiedades/${slug}`,
    locale: "es",
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
    120
  );

  if (!property) notFound();

  return (
    <>
      <section className="container-page container-narrow py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative w-full max-w-137.5 aspect-video overflow-hidden border-xs bg-white">
            <ImageCloudinary
              imageUrl={property.coverImageUrl ?? "intentoPortada_wku8ef"}
              // width={1200}
              // height={800}
              alt={property.title}
            />
          </div>

          <div>
            <h1 className="text-4xl font-semibold">{property.title}</h1>
            {property.subtitle ? (
              <p className="mt-2 text-secondary">{property.subtitle}</p>
            ) : null}

            <div className="mt-4 flex gap-4 text-sm text-secondary">
              {property.city ? <span>{property.city}</span> : null}
              {property.priceUsd ? <span>{property.priceUsd} USD</span> : null}
            </div>

            <div className="mt-6 grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-sm border bg-white p-3">
                <div className="text-secondary">ROI anual aproximado</div>
                <div className="text-xl font-semibold">
                  {property.roiAnnualApproxPct.toFixed(1)}%
                </div>
              </div>
              <div className="rounded-sm border bg-white p-3">
                <div className="text-secondary">Plusvalía anual estimada</div>
                <div className="text-xl font-semibold">
                  {property.appreciationAnnualApproxPct.toFixed(1)}%
                </div>
              </div>
            </div>

            {property.description ? (
              <p className="mt-6 text-secondary">{property.description}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-page container-narrow py-2">
        <h2 className="text-2xl font-semibold">Mapa de ubicación</h2>
        <p className="mt-2 text-sm text-secondary">
          Ubicación referencial para análisis de zona y conectividad.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border bg-white">
          <iframe
            title={`Mapa de ${property.title}`}
            className="h-[320px] w-full"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              property.mapQuery,
            )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            loading="lazy"
          />
        </div>
      </section>

      <section className="container-page container-narrow py-8">
        <div className="max-w-2xl rounded-xl border bg-white p-6">
          <h2 className="text-2xl font-semibold">Solicitar información</h2>
          <p className="mt-2 text-sm text-secondary">
            Recibí asesoría y detalles de esta oportunidad de inversión.
          </p>
          <div className="mt-4">
            <LeadCaptureForm
              compact
              sourcePage={`/bienes-raices/propiedades/${property.slug}`}
              propertySlug={property.slug}
              advisorSlug={property.advisor?.slug}
            />
          </div>
        </div>
      </section>

      {property.advisor && (
        <section className="container-page container-narrow py-6">
          <div className="flex flex-col md:flex-row gap-8 md:items-center">
            <div className="order-2 md:order-1 flex-1">
              <p className="text-sm uppercase tracking-widest text-secondary">
                Asesor inmobiliario
              </p>
              {/* <h2 className="mt-2 text-4xl font-semibold">{title}</h2> */}
              <SectionTitle
                title={property.advisor.fullName}
                subtitle=""
                align="left"
              />

              <div className="mt-5 space-y-3 text-secondary font-light">
                {property.advisor.headline}
              </div>

              <div className="mt-8 flex gap-x-1">
                <Button
                  href={`/bienes-raices/asesores/${property.advisor.slug}`}
                >
                  Ver asesor
                </Button>

                {property.advisor.whatsapp ? (
                  <Button
                    variant="secondary"
                    href={property.advisor.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Contactar al whatsapp
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="relative w-full max-w-80 aspect-video overflow-hidden bg-accent2 order-1 md:order-2">
              <ImageCloudinary
                imageUrl={property.advisor.photoUrl}
                alt={property.advisor.fullName}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
