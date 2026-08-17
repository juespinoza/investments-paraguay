import { HeroSplit } from "@/components/landing/HeroSplit";
import { FeaturedPropertiesSection } from "@/components/landing/FeaturedPropertiesSection";
import { WhyParaguaySection } from "@/components/landing/WhyParaguaySection";
import { StructuredData } from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/seo";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Investments Paraguay",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function HomePageContent() {
  return (
    <>
      <StructuredData data={websiteJsonLd} />
      <HeroSplit backgroundImageUrl="/backgrounds/asuncion-hero-1672.webp" />
      <WhyParaguaySection />
      <FeaturedPropertiesSection />
    </>
  );
}
