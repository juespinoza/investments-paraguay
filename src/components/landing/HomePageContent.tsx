import { getTranslations } from "next-intl/server";
import { HeroSplit } from "@/components/landing/HeroSplit";
import { FeaturedPropertiesSection } from "@/components/landing/FeaturedPropertiesSection";
import { WhyParaguaySection } from "@/components/landing/WhyParaguaySection";
import { StructuredData } from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/seo";
import {
  getEntryPriceUsd,
  listPublicProperties,
} from "@/lib/properties/public";

export async function HomePageContent({ locale }: { locale: string }) {
  const t = await getTranslations("site.hero");
  const properties = await listPublicProperties();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Investments Paraguay",
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale,
  };

  return (
    <>
      <StructuredData data={websiteJsonLd} />
      <HeroSplit
        backgroundImageUrl="/backgrounds/asuncion-hero-1672.webp"
        locale={locale}
        eyebrowLabel={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        ctaLabel={t("primaryCta")}
        advisorLabel={t("advisorCta")}
      />
      <WhyParaguaySection entryPriceUsd={getEntryPriceUsd(properties)} />
      <FeaturedPropertiesSection properties={properties} />
    </>
  );
}
