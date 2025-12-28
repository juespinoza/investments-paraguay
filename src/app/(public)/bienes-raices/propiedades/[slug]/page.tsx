import { apiGet } from "@/lib/api/public";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ImageCloudinary } from "@/components/ui/ImageCloudinary";
import { AboutSection } from "@/components/landing/AboutSection";
import { SectionTitle } from "@/components/landing/SectionTitle";

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
  advisor: {
    slug: string;
    fullName: string;
    headline: string | null;
    photoUrl: string;
    whatsapp: string | null;
  } | null;
};

type PageProps = { params: Promise<{ slug: string }> };

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

            {property.description ? (
              <p className="mt-6 text-secondary">{property.description}</p>
            ) : null}
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
