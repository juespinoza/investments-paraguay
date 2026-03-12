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
      <section className="px-4 py-8 md:py-10">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="surface-card relative aspect-[16/10] overflow-hidden rounded-[2rem]">
              <ImageCloudinary
                imageUrl={property.coverImageUrl ?? "intentoPortada_wku8ef"}
                alt={property.title}
              />
            </div>

            <div className="surface-card rounded-[2rem] p-6 md:p-8">
              <div className="eyebrow">Propiedad</div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-primary md:text-6xl">
                {property.title}
              </h1>
              {property.subtitle ? (
                <p className="mt-4 text-base leading-8 text-secondary md:text-lg">
                  {property.subtitle}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-secondary">
                {property.city ? (
                  <span className="rounded-full border border-soft bg-white/70 px-4 py-2">
                    {property.city}
                  </span>
                ) : null}
                {property.neighborhood ? (
                  <span className="rounded-full border border-soft bg-white/70 px-4 py-2">
                    {property.neighborhood}
                  </span>
                ) : null}
                {property.priceUsd ? (
                  <span className="rounded-full border border-[rgba(201,164,92,0.32)] bg-[#f7efdf] px-4 py-2 font-semibold text-primary">
                    USD {property.priceUsd.toLocaleString("en-US")}
                  </span>
                ) : null}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-soft bg-white/65 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
                    ROI anual exacto
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-primary">
                    {property.roiAnnualPct !== null
                      ? `${property.roiAnnualPct.toFixed(2)}%`
                      : "No cargado"}
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-soft bg-white/65 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
                    Plusvalía anual exacta
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-primary">
                    {property.appreciationAnnualPct !== null
                      ? `${property.appreciationAnnualPct.toFixed(2)}%`
                      : "No cargado"}
                  </div>
                </div>
              </div>

              {property.description ? (
                <p className="mt-8 text-base leading-8 text-secondary">
                  {property.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="container-page section-shell surface-card p-4 md:p-6">
          <h2 className="text-2xl font-semibold text-primary">Mapa de ubicación</h2>
          <p className="mt-2 text-sm text-secondary">
            Ubicación exacta por coordenadas geográficas.
          </p>
          {property.latitude !== null && property.longitude !== null ? (
            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-soft bg-white">
              <iframe
                title={`Mapa de ${property.title}`}
                className="h-[320px] w-full"
                src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="mt-4 rounded-[1.5rem] border border-soft bg-white/70 p-4 text-sm text-secondary">
              Esta propiedad aún no tiene coordenadas exactas cargadas.
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="container-page">
          <div className="max-w-2xl rounded-[2rem] border border-soft bg-[linear-gradient(180deg,#fffdf9_0%,#f5ede1_100%)] p-6 shadow-[0_18px_48px_rgba(15,23,38,0.1)] md:p-8">
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
      </section>

      {property.advisor && (
        <section className="px-4 py-8 md:py-10">
          <div className="container-page">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:items-center">
              <div className="surface-card order-2 rounded-[2rem] p-6 md:order-1 md:p-8">
                <div className="eyebrow">Asesor inmobiliario</div>
                <div className="mt-5">
                  <SectionTitle
                    title={property.advisor.fullName}
                    subtitle=""
                    align="left"
                  />
                </div>

                <div className="mt-5 text-base font-light leading-8 text-secondary">
                  {property.advisor.headline}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

              <div className="surface-card relative order-1 aspect-[4/4.5] overflow-hidden rounded-[2rem] md:order-2">
                <ImageCloudinary
                  imageUrl={property.advisor.photoUrl}
                  alt={property.advisor.fullName}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
