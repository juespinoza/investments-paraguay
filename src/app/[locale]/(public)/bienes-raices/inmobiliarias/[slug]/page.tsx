import { HeroSplit } from "@/components/landing/HeroSplit";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import { SectionTitle } from "@/components/landing/SectionTitle";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { resolveLocale } from "@/lib/content/public-pages";
import { Link } from "@/i18n/navigation";
import { parseInmobiliariaLandingTheme } from "@/lib/virtualoffice/inmobiliarias";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale = resolveLocale(locale);
  const agency = await prisma.inmobiliaria.findUnique({
    where: { slug },
    select: { name: true, description: true, logoUrl: true },
  });

  if (!agency) {
    return buildMetadata({
      title: "Inmobiliaria | Investments Paraguay",
      description: "Perfil de inmobiliaria no disponible.",
      pathname: `/bienes-raices/inmobiliarias/${slug}`,
      locale: resolvedLocale,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${agency.name} | Inmobiliaria en Paraguay`,
    description:
      agency.description ??
      `Conoce las propiedades y asesores de ${agency.name} en Paraguay.`,
    pathname: `/bienes-raices/inmobiliarias/${slug}`,
    locale: resolvedLocale,
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
      themeJson: true,
      landing: {
        select: { themeJson: true, deletedAt: true },
      },
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

  const landingTheme = parseInmobiliariaLandingTheme(
    (agency.landing?.deletedAt ? null : agency.landing?.themeJson) ??
      agency.themeJson,
  );

  const allPropertyItems = agency.properties
    .map((p) => ({
      id: p.slug,
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

  const featuredIds = landingTheme?.featuredPropertyIds ?? [];
  const propertyItems =
    featuredIds.length > 0
      ? allPropertyItems
          .filter((item) => featuredIds.includes(item.id))
          .sort(
            (a, b) => featuredIds.indexOf(a.id) - featuredIds.indexOf(b.id),
          )
      : allPropertyItems;

  const contactItems = [
    landingTheme?.contactEmail
      ? {
          label: "Email",
          value: landingTheme.contactEmail,
          href: `mailto:${landingTheme.contactEmail}`,
        }
      : null,
    landingTheme?.contactPhone
      ? {
          label: "Teléfono",
          value: landingTheme.contactPhone,
          href: `tel:${landingTheme.contactPhone}`,
        }
      : null,
    landingTheme?.contactWhatsapp
      ? {
          label: "WhatsApp",
          value: landingTheme.contactWhatsapp,
          href: `https://wa.me/${landingTheme.contactWhatsapp.replace(/\D/g, "")}`,
        }
      : null,
    landingTheme?.contactWebsite
      ? {
          label: "Web",
          value: landingTheme.contactWebsite,
          href: landingTheme.contactWebsite,
        }
      : null,
    landingTheme?.contactAddress
      ? {
          label: "Dirección",
          value: landingTheme.contactAddress,
          href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            landingTheme.contactAddress,
          )}`,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href: string }>;

  return (
    <>
      <HeroSplit
        brandLeft="INMOBILIARIA"
        brandRight="PARAGUAY"
        menuActive="Bienes raíces"
        title={landingTheme?.heroTitle ?? agency.name}
        subtitle={
          landingTheme?.heroSubtitle ??
          agency.description ??
          "Especialistas en oportunidades inmobiliarias en Paraguay."
        }
        ctaLabel={landingTheme?.heroCtaLabel ?? "Ver propiedades"}
        ctaHref={landingTheme?.heroCtaHref ?? "#propiedades"}
        backgroundImageUrl={
          landingTheme?.heroBackgroundUrl ?? "/backgrounds/background.png"
        }
        logoLeftUrl={agency.logoUrl ?? undefined}
      />

      <section className="px-4 py-8 md:py-10">
        <div className="container-page">
          <div className="mb-8">
            <div className="eyebrow">Equipo</div>
            <div className="mt-5">
              <SectionTitle
                title={landingTheme?.advisorsTitle ?? "Equipo de asesores"}
                subtitle={
                  landingTheme?.advisorsSubtitle ??
                  "Conectá con profesionales que conocen el mercado, las zonas clave y las oportunidades activas de la inmobiliaria."
                }
                align="left"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {agency.advisors.length === 0 ? (
              <p className="text-secondary">Aún no hay asesores publicados.</p>
            ) : (
              agency.advisors.map((advisor) => (
                <Link
                  key={advisor.id}
                  href={`/bienes-raices/asesores/${advisor.slug}`}
                  className="surface-card rounded-[1.75rem] p-5 hover:-translate-y-0.5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
                    Advisor
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-primary">
                    {advisor.fullName}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-secondary">
                    {advisor.headline ?? "Asesor inmobiliario"}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {contactItems.length ? (
        <section className="px-4 py-8 md:py-10">
          <div className="container-page">
            <div className="rounded-[1.9rem] border border-soft bg-[var(--ivory)] p-6 shadow-[0_18px_60px_rgba(10,10,10,0.06)]">
              <SectionTitle
                title={landingTheme?.contactTitle ?? "Contacto de la inmobiliaria"}
                subtitle="Canales directos para consultas comerciales, coordinación de visitas y seguimiento."
                align="left"
              />
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {contactItems.map((item) => (
                  <a
                    key={`${item.label}-${item.value}`}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[1.4rem] border border-soft bg-[linear-gradient(180deg,var(--ivory)_0%,var(--stone)_100%)] px-5 py-4 hover:-translate-y-0.5"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent1">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-secondary">
                      {item.value}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section id="propiedades">
        <FeaturedGrid
          title={
            landingTheme?.propertiesTitle ?? "Propiedades de la inmobiliaria"
          }
          subtitle={landingTheme?.propertiesSubtitle ?? undefined}
          items={propertyItems}
        />
      </section>
    </>
  );
}
