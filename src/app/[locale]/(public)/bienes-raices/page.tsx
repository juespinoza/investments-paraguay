import { apiGet } from "@/lib/api/public";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/content/public-pages";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    min?: string;
    max?: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = resolveLocale(routeLocale);

  const seoByLocale = {
    en: {
      title: "Real Estate Investment in Paraguay | Apartments, Land and Projects",
      description:
        "Find apartments, land, houses and investment projects in Paraguay with professional advisory for local and international buyers.",
      keywords: [
        "real estate investment paraguay",
        "apartments in paraguay",
        "land in paraguay",
        "paraguay real estate projects",
        "paraguay real estate advisor",
      ],
    },
    es: {
      title: "Inversión Inmobiliaria en Paraguay | Departamentos, terrenos y proyectos",
      description:
        "Encuentre departamentos, terrenos, casas y proyectos inmobiliarios en Paraguay con asesoría profesional para compradores locales e internacionales.",
      keywords: [
        "inversion inmobiliaria paraguay",
        "departamentos en paraguay",
        "terrenos en paraguay",
        "proyectos inmobiliarios paraguay",
        "asesor inmobiliario paraguay",
      ],
    },
    pt: {
      title: "Investimento Imobiliário no Paraguai | Apartamentos, terrenos e projetos",
      description:
        "Encontre apartamentos, terrenos, casas e projetos imobiliários no Paraguai com assessoria profissional para compradores locais e internacionais.",
      keywords: [
        "investimento imobiliario paraguai",
        "apartamentos no paraguai",
        "terrenos no paraguai",
        "projetos imobiliarios paraguai",
        "consultor imobiliario paraguai",
      ],
    },
    de: {
      title: "Immobilieninvestitionen in Paraguay | Wohnungen, Grundstücke und Projekte",
      description:
        "Finden Sie Wohnungen, Grundstücke, Häuser und Immobilienprojekte in Paraguay mit professioneller Beratung für lokale und internationale Käufer.",
      keywords: [
        "immobilien paraguay",
        "wohnungen paraguay",
        "grundstücke paraguay",
        "immobilienprojekte paraguay",
        "immobilienberater paraguay",
      ],
    },
  } as const;

  const seo = seoByLocale[locale];

  return buildMetadata({
    title: seo.title,
    description: seo.description,
    pathname: "/bienes-raices",
    locale,
    keywords: [...seo.keywords],
  });
}

export const revalidate = 60;

type PublicPropertyListItem = {
  slug: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  priceUsd: number | null;
  city: string | null;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
  isFeatured: boolean;
  featuredOrder: number | null;
  updatedAt: string;
  roiAnnualPct: number | null;
  appreciationAnnualPct: number | null;
  advisor: { slug: string; fullName: string } | null;
};

export default async function BienesRaicesPage({ searchParams }: PageProps) {
  const t = await getTranslations();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const min = params.min?.trim() ?? "";
  const max = params.max?.trim() ?? "";

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (min) qs.set("min", min);
  if (max) qs.set("max", max);

  const properties = await apiGet<PublicPropertyListItem[]>(
    `/api/public/bienes-raices${qs.toString() ? `?${qs.toString()}` : ""}`,
    60,
  );

  const items =
    properties?.map((p) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle ?? "",
      coverImageUrl: p.coverImageUrl ?? "intentoPortada_wku8ef",
      href: `/bienes-raices/propiedades/${p.slug}`,
      badge: p.isFeatured
        ? t("realEstate.badges.featured")
        : t("realEstate.badges.sale"),
    })) ?? [];

  const firstWithCoordinates = properties?.find(
    (property) =>
      typeof property.latitude === "number" &&
      typeof property.longitude === "number",
  );

  const mapSrc = firstWithCoordinates
    ? `https://maps.google.com/maps?q=${firstWithCoordinates.latitude},${firstWithCoordinates.longitude}&t=&z=12&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(
        q || properties?.[0]?.city || "Paraguay",
      )}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <section className="px-4 py-8 md:py-10">
        <div className="container-page">
          <div className="eyebrow">{t("realEstate.eyebrow")}</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-primary md:text-6xl">
            {t("realEstate.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-secondary md:text-lg">
            {t("realEstate.description")}
          </p>

          <form className="surface-card mt-8 grid gap-3 rounded-[1.75rem] p-4 md:grid-cols-4 md:p-5">
            <input
              name="q"
              defaultValue={q}
              placeholder={t("realEstate.filters.location")}
              className="h-12 rounded-full border border-soft bg-white/80 px-4 outline-none"
            />
            <input
              name="min"
              defaultValue={min}
              placeholder={t("realEstate.filters.min")}
              inputMode="numeric"
              className="h-12 rounded-full border border-soft bg-white/80 px-4 outline-none"
            />
            <input
              name="max"
              defaultValue={max}
              placeholder={t("realEstate.filters.max")}
              inputMode="numeric"
              className="h-12 rounded-full border border-soft bg-white/80 px-4 outline-none"
            />
            <button type="submit" className="btn-primary h-12">
              {t("realEstate.filters.apply")}
            </button>
          </form>
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="container-page">
          <div className="section-shell surface-card p-4 md:p-6">
            <h2 className="text-2xl font-semibold text-primary">
              {t("realEstate.map.title")}
            </h2>
            <p className="mt-2 text-sm text-secondary">
              {t("realEstate.map.description")}
            </p>
            <div className="mt-4 overflow-hidden rounded-3xl border border-soft bg-white">
              <iframe
                title="Mapa de propiedades en Paraguay"
                className="h-80 w-full"
                src={mapSrc}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <FeaturedGrid title={t("realEstate.availableTitle")} items={items} />
    </>
  );
}
