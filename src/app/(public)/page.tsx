import { HeroSplit } from "@/components/landing/HeroSplit";
import { CTAWide } from "@/components/landing/CTAWide";
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
  const t = useTranslations();
  const pillars = ["curation", "localKnowledge", "simpleProcess"] as const;

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

      <section className="px-4 py-8 md:py-12">
        <div className="container-page">
          <div className="mb-10">
            <div className="eyebrow">{t("home.thesisEyebrow")}</div>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-primary md:text-5xl">
              {t("home.thesisTitle")}
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="surface-card rounded-4xl p-6 md:p-8">
              <div className="mb-6 flex items-center gap-x-4">
                <span className="eyebrow">01</span>
                <span className="text-sm uppercase tracking-[0.22em] text-accent1">
                  {t("home.modelTags.realEstate")}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-primary md:text-3xl">
                {t("bussinessModel_1.title")}
              </h3>
              <p className="mt-4 max-w-xl text-base text-secondary md:text-lg">
                {t("bussinessModel_1.description")}
              </p>
            </article>

            <article className="surface-card rounded-4xl p-6 md:p-8">
              <div className="mb-6 flex items-center gap-x-4">
                <span className="eyebrow">02</span>
                <span className="text-sm uppercase tracking-[0.22em] text-accent1">
                  {t("home.modelTags.business")}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-primary md:text-3xl">
                {t("bussinessModel_2.title")}
              </h3>
              <p className="mt-4 max-w-xl text-base text-secondary md:text-lg">
                {t("bussinessModel_2.description")}
              </p>
            </article>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {pillars.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[rgba(20,32,51,0.08)] bg-[rgba(20,32,51,0.05)] p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-accent1">
                  {t("home.pillarsEyebrow")}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-primary">
                  {t(`home.pillars.${item}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-secondary">
                  {t(`home.pillars.${item}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
