import { HeroSplit } from "@/components/landing/HeroSplit";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import { CTAWide } from "@/components/landing/CTAWide";
import { SocialLinks } from "@/components/landing/SocialLinks";
import { mockAdvisorLanding } from "@/lib/mock/data";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const d = mockAdvisorLanding;
  const t = useTranslations("HomePage");

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

      {/* <FeaturedGrid title="Propiedades" items={d.featuredProperties} /> */}

      {/* <CTAWide
        line1="Obtenga las mejores opciones de inversión con la"
        highlight="ayuda de nuestro grupo de asesores altamente experimentados."
      /> */}
      <section className="relative my-4 overflow-hidden py-6">
        <div className="container-page container-narrow relative py-6 text-center flex flex-row items-center gap-6">
          <div className="mt-4 text-lg text-secondary bg-[#d3bf98] p-4 rounded-md">
            <h3 className="text-xl font-semibold">
              Inversiones inmobiliarias en Paraguay
            </h3>
            <span className="mt-4">
              Descubre por qué es el destino favorito de los inversores
              extranjeros y cómo aprovechar sus oportunidades únicas.
            </span>
          </div>
          <div className="mt-4 text-lg text-secondary bg-[#d3bf98] p-4 rounded-md">
            <h3 className="text-xl font-semibold">
              Ideas de negocios en Paraguay
            </h3>
            <span className="mt-4">
              Desde startups tecnológicas hasta franquicias, conoce las
              industrias y negocios en los podes invertir con éxito en el
              mercado paraguayo.
            </span>
          </div>
        </div>
        <div>{t("title")}</div>
      </section>

      {/* <FeaturedGrid title="Finanzas" items={d.featuredProperties} /> */}

      {/* <SocialLinks title="Redes sociales" items={d.socialLinks} /> */}
    </>
  );
}
