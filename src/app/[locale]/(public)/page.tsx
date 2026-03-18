import type { Metadata } from "next";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { buildMetadata } from "@/lib/seo";
import { SUPPORTED_LOCALES, type AppLocale } from "@/lib/i18n";

export default function HomePage() {
  return <HomePageContent />;
}

const homeSeoByLocale: Record<
  AppLocale,
  { title: string; description: string; keywords: string[] }
> = {
  en: {
    title:
      "Invest in Real Estate and Business in Paraguay | Investments Paraguay",
    description:
      "Discover profitable real estate investments, business opportunities and strategic advisory services for local and foreign investors in Paraguay.",
    keywords: [
      "investments Paraguay",
      "real estate investment Paraguay",
      "foreign investors Paraguay",
      "business opportunities in Paraguay",
      "Paraguay real estate advisor",
    ],
  },
  es: {
    title:
      "Inversiones inmobiliarias y negocios en Paraguay | Investments Paraguay",
    description:
      "Descubra oportunidades inmobiliarias rentables, negocios y asesoría estratégica para inversores locales y extranjeros en Paraguay.",
    keywords: [
      "inversiones paraguay",
      "inversion inmobiliaria paraguay",
      "negocios en paraguay",
      "asesoria inversion paraguay",
      "asesor inmobiliario paraguay",
    ],
  },
  pt: {
    title:
      "Investimentos imobiliários e negócios no Paraguai | Investments Paraguay",
    description:
      "Descubra oportunidades imobiliárias rentáveis, negócios e assessoria estratégica para investidores locais e estrangeiros no Paraguai.",
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
  const resolvedLocale = SUPPORTED_LOCALES.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : "en";
  const seo = homeSeoByLocale[resolvedLocale];

  return buildMetadata({
    title: seo.title,
    description: seo.description,
    pathname: "/",
    locale: resolvedLocale,
    keywords: seo.keywords,
  });
}
