import { HeroSplit } from "@/components/landing/HeroSplit";
import { FeaturedPropertiesSection } from "@/components/landing/FeaturedPropertiesSection";
import { WhyParaguaySection } from "@/components/landing/WhyParaguaySection";
import { StructuredData } from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/seo";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Investments Paraguay",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  sameAs: ["https://www.instagram.com/investmentsparaguay"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+595985444801",
    availableLanguage: ["English", "Spanish", "Portuguese", "German"],
  },
};

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
      <StructuredData data={[organizationJsonLd, websiteJsonLd]} />
      <HeroSplit backgroundImageUrl="/backgrounds/asuncion-hero-1672.webp" />
      <WhyParaguaySection />
      <FeaturedPropertiesSection />
    </>
  );
}
