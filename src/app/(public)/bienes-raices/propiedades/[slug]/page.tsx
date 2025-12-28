import { apiGet } from "@/lib/api/public";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

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
    photoUrl: string | null;
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
    <section className="container-page container-narrow py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-white">
          <Image
            src={property.coverImageUrl ?? "/placeholders/property.jpg"}
            width={1200}
            height={800}
            alt={property.title}
            className="h-auto w-full object-cover"
            priority
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

          {property.advisor ? (
            <div className="mt-8 rounded-xl border bg-white p-5">
              <p className="font-medium">{property.advisor.fullName}</p>
              {property.advisor.headline ? (
                <p className="text-sm text-secondary">
                  {property.advisor.headline}
                </p>
              ) : null}

              <div className="mt-4 flex gap-3">
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
                    WhatsApp
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
