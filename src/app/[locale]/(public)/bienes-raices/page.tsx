import { apiGet } from "@/lib/api/public";
import { RealEstatePropertiesClient } from "@/components/landing/RealEstatePropertiesClient";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/content/public-pages";
import type { PublicPropertyListItem } from "@/lib/api/types";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    tipo?: string;
    precio?: string;
    ciudad?: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = resolveLocale(routeLocale);

  const seoByLocale = {
    en: {
      title:
        "Real Estate Investment in Paraguay | Apartments, Land and Projects",
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
      title:
        "Inversión Inmobiliaria en Paraguay | Departamentos, terrenos y proyectos",
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
      title:
        "Investimento Imobiliário no Paraguai | Apartamentos, terrenos e projetos",
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
      title:
        "Immobilieninvestitionen in Paraguay | Wohnungen, Grundstücke und Projekte",
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
    image: "/images/og-home.jpg",
    keywords: [...seo.keywords],
  });
}

export const revalidate = 60;

export default async function BienesRaicesPage({ searchParams }: PageProps) {
  const t = await getTranslations();
  const params = await searchParams;
  const properties = await apiGet<PublicPropertyListItem[]>(
    "/api/public/bienes-raices",
    60,
  );

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
        </div>
      </section>

      <RealEstatePropertiesClient
        properties={properties ?? []}
        title={t("realEstate.availableTitle")}
        initialQuery={{
          tipo: params.tipo ?? null,
          precio: params.precio ?? null,
          ciudad: params.ciudad ?? null,
        }}
      />
    </>
  );
}
