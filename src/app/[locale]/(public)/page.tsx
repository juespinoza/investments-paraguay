import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { buildMetadata } from "@/lib/seo";
import { DEFAULT_LOCALE, isSupportedLocale, type AppLocale } from "@/lib/i18n";

export const revalidate = 300;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  setRequestLocale(resolvedLocale);

  return <HomePageContent locale={resolvedLocale} />;
}

const homeSeoByLocale: Record<
  AppLocale,
  { title: string; description: string; keywords: string[] }
> = {
  en: {
    // Alineado con las búsquedas que ya traen impresiones en Search Console:
    // "invest paraguay", "invest in paraguay", "paraguay real estate".
    title: "Invest in Paraguay Real Estate | Investments Paraguay",
    description:
      "Real estate investment in Asunción and Paraguay: apartments with prices, rents and estimated yields, and advice for local and foreign investors.",
    keywords: [
      "invest in Paraguay",
      "Asunción real estate investment",
      "investments Paraguay",
      "real estate investment Paraguay",
      "foreign investors Paraguay",
      "business opportunities in Paraguay",
      "Paraguay real estate advisor",
    ],
  },
  es: {
    title: "Inversión inmobiliaria en Paraguay | Investments Paraguay",
    description:
      "Departamentos para invertir en Asunción y Paraguay con precios, alquileres y rentabilidad estimada, y asesoría para inversores locales y extranjeros.",
    keywords: [
      "inversiones paraguay",
      "inversion inmobiliaria paraguay",
      "negocios en paraguay",
      "asesoria inversion paraguay",
      "asesor inmobiliario paraguay",
    ],
  },
  pt: {
    title: "Investimento imobiliário no Paraguai | Investments Paraguay",
    description:
      "Apartamentos para investir em Assunção e no Paraguai com preços, aluguéis e rentabilidade estimada, e assessoria para investidores locais e estrangeiros.",
    keywords: [
      "investimentos paraguai",
      "imoveis paraguai",
      "negocios no paraguai",
      "assessoria de investimento paraguai",
      "consultor imobiliario paraguai",
    ],
  },
  de: {
    title:
      "Immobilien und Geschäftsinvestitionen in Paraguay | Investments Paraguay",
    description:
      "Entdecken Sie rentable Immobilieninvestitionen, Geschäftschancen und strategische Beratung für lokale und internationale Investoren in Paraguay.",
    keywords: [
      "investitionen paraguay",
      "immobilien paraguay",
      "geschäftsmöglichkeiten paraguay",
      "investmentberatung paraguay",
      "immobilienberater paraguay",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const seo = homeSeoByLocale[resolvedLocale];

  return buildMetadata({
    title: seo.title,
    description: seo.description,
    pathname: "/",
    locale: resolvedLocale,
    image: "/images/og-home.jpg",
    keywords: seo.keywords,
  });
}
