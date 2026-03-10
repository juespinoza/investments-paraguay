import { HeroSplit } from "@/components/landing/HeroSplit";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agency = await prisma.inmobiliaria.findUnique({
    where: { slug },
    select: { name: true, description: true, logoUrl: true },
  });

  if (!agency) {
    return buildMetadata({
      title: "Inmobiliaria | Investments Paraguay",
      description: "Perfil de inmobiliaria no disponible.",
      pathname: `/bienes-raices/inmobiliarias/${slug}`,
      locale: "es",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${agency.name} | Inmobiliaria en Paraguay`,
    description:
      agency.description ??
      `Conoce las propiedades y asesores de ${agency.name} en Paraguay.`,
    pathname: `/bienes-raices/inmobiliarias/${slug}`,
    locale: "es",
    image: agency.logoUrl ?? "/images/logo.png",
  });
}

export const revalidate = 300;

export default async function AgencyLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const agency = await prisma.inmobiliaria.findUnique({
    where: { slug, deletedAt: null },
    select: {
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      advisors: {
        where: { deletedAt: null },
        select: { id: true, fullName: true, slug: true, headline: true },
        orderBy: { updatedAt: "desc" },
      },
      properties: {
        where: { deletedAt: null },
        select: {
          slug: true,
          title: true,
          description: true,
          coverImageUrl: true,
          city: true,
          isFeatured: true,
          featuredOrder: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!agency) notFound();

  const propertyItems = agency.properties
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.description ?? p.city ?? "",
      coverImageUrl: p.coverImageUrl ?? "intentoPortada_wku8ef",
      href: `/bienes-raices/propiedades/${p.slug}`,
      badge: p.isFeatured ? "Destacada" : "Venta",
      updatedAt: p.updatedAt,
      isFeatured: p.isFeatured,
      featuredOrder: p.featuredOrder,
    }))
    .sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      if ((a.featuredOrder ?? 9999) !== (b.featuredOrder ?? 9999)) {
        return (a.featuredOrder ?? 9999) - (b.featuredOrder ?? 9999);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <>
      <HeroSplit
        brandLeft="INMOBILIARIA"
        brandRight="PARAGUAY"
        menuActive="Bienes raíces"
        title={agency.name}
        subtitle={
          agency.description ??
          "Especialistas en oportunidades inmobiliarias en Paraguay."
        }
        ctaLabel="Ver propiedades"
        ctaHref="#propiedades"
        backgroundImageUrl="/backgrounds/background.png"
        logoLeftUrl={agency.logoUrl ?? undefined}
      />

      <section className="container-page container-narrow py-6">
        <h2 className="text-3xl font-semibold">Equipo de asesores</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {agency.advisors.length === 0 ? (
            <p className="text-secondary">Aún no hay asesores publicados.</p>
          ) : (
            agency.advisors.map((advisor) => (
              <a
                key={advisor.id}
                href={`/bienes-raices/asesores/${advisor.slug}`}
                className="rounded-lg border bg-white p-4 hover:bg-zinc-50"
              >
                <h3 className="font-semibold">{advisor.fullName}</h3>
                <p className="mt-1 text-sm text-secondary">
                  {advisor.headline ?? "Asesor inmobiliario"}
                </p>
              </a>
            ))
          )}
        </div>
      </section>

      <section id="propiedades">
        <FeaturedGrid title="Propiedades de la inmobiliaria" items={propertyItems} />
      </section>
    </>
  );
}
