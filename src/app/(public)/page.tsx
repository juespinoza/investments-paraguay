import { HeroSplit } from "@/components/landing/HeroSplit";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import { CTAWide } from "@/components/landing/CTAWide";
import { SocialLinks } from "@/components/landing/SocialLinks";
import { mockAdvisorLanding } from "@/lib/mock/data";
import { useTranslations } from "next-intl";
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

export default function HomePage() {
  const d = mockAdvisorLanding;
  const t = useTranslations();

  return (
    <>
      <StructuredData data={[organizationJsonLd, websiteJsonLd]} />
      <HeroSplit
        brandLeft="INVESTMENTS"
        brandRight="PARAGUAY"
        menuActive="Inicio"
        title={t("heroTitle")}
        subtitle={t("heroDescription")}
        ctaLabel={t("heroCta")}
        ctaHref="https://wa.me/595985444801"
        backgroundImageUrl="/backgrounds/background.png"
      />

      <CTAWide line1={t("bannerText")} highlight={t("bannerTextHighlight")} />

      {/* <FeaturedGrid title="Propiedades" items={d.featuredProperties} /> */}

      {/* <CTAWide
        line1="Obtenga las mejores opciones de inversión con la"
        highlight="ayuda de nuestro grupo de asesores altamente experimentados."
      /> */}
      <section className="relative overflow-hidden">
        <div className="container-page container-narrow relative py-6">
          <div className="flex flex-col gap-x-0 md:gap-x-6 gap-y-6 md:gap-y-0 text-center md:flex-row md:items-stretch">
            <div className="w-full rounded-md bg-[#d3bf98] p-4 text-lg text-secondary md:w-1/2">
              <h3 className="text-xl font-semibold">
                {t("bussinessModel_1.title")}
              </h3>
              <p className="mt-4">{t("bussinessModel_1.description")}</p>
            </div>
            <div className="w-full rounded-md bg-[#d3bf98] p-4 text-lg text-secondary md:w-1/2">
              <h3 className="text-xl font-semibold">
                {t("bussinessModel_2.title")}
              </h3>
              <p className="mt-4">{t("bussinessModel_2.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* <FeaturedGrid title="Finanzas" items={d.featuredProperties} /> */}

      {/* <SocialLinks title="Redes sociales" items={d.socialLinks} /> */}
    </>
  );
}
