import { HeroSplit } from "@/components/landing/HeroSplit";
import { TwoCol } from "@/components/landing/TwoCol";
import { Specialization } from "@/components/landing/Specialization";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import { CTAWide } from "@/components/landing/CTAWide";
import { Testimonials } from "@/components/landing/Testimonials";
import { SocialLinks } from "@/components/landing/SocialLinks";
import { mockAdvisorLanding } from "@/lib/mock/data";

export default function HomePage() {
  const d = mockAdvisorLanding;

  return (
    <>
      <HeroSplit
        brandLeft="INVESTMENTS"
        brandRight="PARAGUAY"
        menuActive="Inicio"
        title={d.heroTitle}
        subtitle={d.heroSubtitle}
        ctaLabel={d.heroCtaLabel}
        ctaHref={d.heroCtaHref}
        backgroundImageUrl={d.heroBg}
      />

      <TwoCol
        leftImageUrl={d.profile.imageUrl}
        leftImageAlt="Foto de perfil"
        eyebrow="Conoce más sobre mi"
        title={d.profile.title}
        meta={[
          { label: "Años de carrera", value: d.profile.years },
          { label: "Inmobiliaria", value: d.profile.company },
        ]}
        paragraphs={d.profile.paragraphs}
        ctaLabel="Contactar"
        ctaHref={d.heroCtaHref}
      />

      <Specialization
        items={d.specialization}
        ctaLabel="Contactar"
        ctaHref={d.heroCtaHref}
      />

      <FeaturedGrid
        title="Propiedades destacadas"
        items={d.featuredProperties}
      />

      <CTAWide
        line1="Obtenga las mejores opciones de inversión con la"
        highlight="ayuda de nuestro grupo de asesores altamente experimentados."
      />

      {/* <Testimonials title="Testimonios" items={d.testimonials} /> */}

      <SocialLinks title="Redes sociales" items={d.socialLinks} />
    </>
  );
}
