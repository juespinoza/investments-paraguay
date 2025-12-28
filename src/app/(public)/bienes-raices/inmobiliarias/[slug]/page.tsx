import { HeroSplit } from "@/components/landing/HeroSplit";
import { TwoCol } from "@/components/landing/AboutSection";
import { OfficesGrid } from "@/components/landing/OfficesGrid";
import { Specialization } from "@/components/landing/ServicesSection";
import { CTAWide } from "@/components/landing/CTAWide";
import { Testimonials } from "@/components/landing/Testimonials";
import { SocialLinks } from "@/components/landing/SocialLinks";
import { mockAgencyLanding } from "@/lib/mock/data";

export default function AgencyLandingPage() {
  const d = mockAgencyLanding;

  return (
    <>
      <HeroSplit
        brandLeft="INVESTMENTS"
        brandRight="PARAGUAY"
        menuActive="Bienes raíces"
        title={d.heroTitle}
        subtitle={d.heroSubtitle}
        ctaLabel={d.heroCtaLabel}
        ctaHref={d.heroCtaHref}
        backgroundImageUrl={d.heroBg}
        logoLeftUrl={d.logoUrl}
      />

      <TwoCol
        leftImageUrl={d.about.imageUrl}
        leftImageAlt="SkyOne"
        eyebrow="SkyOne Paraguay"
        title={d.about.title}
        meta={[
          { label: "Años en el mercado", value: d.about.years },
          { label: "Operaciones", value: d.about.ops },
        ]}
        paragraphs={d.about.paragraphs}
        ctaLabel="Contactar"
        ctaHref={d.heroCtaHref}
      />

      <OfficesGrid title="Nuestras oficinas" items={d.offices} />

      <Specialization
        items={d.specialization}
        ctaLabel="Contactar"
        ctaHref={d.heroCtaHref}
      />

      <CTAWide
        line1="Obtenga las mejores opciones de inversión con la"
        highlight="ayuda de nuestro grupo de asesores altamente experimentados."
      />

      <Testimonials title="Testimonios" items={d.testimonials} />

      <SocialLinks title="Redes sociales" items={d.socialLinks} />
    </>
  );
}
