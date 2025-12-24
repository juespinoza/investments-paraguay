import { HeroSplit } from "@/components/landing/HeroSplit";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import { CTAWide } from "@/components/landing/CTAWide";
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
        title="Conoce Paraguay"
        subtitle="Un país donde las inversiones están en su punto mas rentable"
        ctaLabel="Contactar"
        ctaHref="https://wa.me/595985444801"
        backgroundImageUrl="/backgrounds/background.png"
      />

      <CTAWide
        line1="Obtenga las mejores opciones de inversión con la"
        highlight="ayuda de nuestro grupo de asesores altamente experimentados."
      />

      <FeaturedGrid title="Propiedades" items={d.featuredProperties} />

      <CTAWide
        line1="Obtenga las mejores opciones de inversión con la"
        highlight="ayuda de nuestro grupo de asesores altamente experimentados."
      />

      <FeaturedGrid title="Finanzas" items={d.featuredProperties} />

      <SocialLinks title="Redes sociales" items={d.socialLinks} />
    </>
  );
}
