import { mockPropertyLanding } from "@/lib/mock/data";
import { HeroSplit } from "@/components/landing/HeroSplit";
import { TwoCol } from "@/components/landing/TwoCol";

export default function PropertyLandingPage() {
  const p = mockPropertyLanding;

  return (
    <>
      <HeroSplit
        brandLeft="INVESTMENTS"
        brandRight="PARAGUAY"
        menuActive="Bienes raíces"
        title={p.title}
        subtitle={p.subtitle}
        ctaLabel="Consultar"
        ctaHref="#contacto"
        backgroundImageUrl={p.heroBg}
      />

      <TwoCol
        leftImageUrl={p.imageUrl}
        leftImageAlt="Propiedad"
        eyebrow="Detalles"
        title={p.title}
        meta={[
          { label: "Ubicación", value: p.location },
          { label: "Precio", value: p.price },
        ]}
        paragraphs={p.paragraphs}
        ctaLabel="Contactar"
        ctaHref="#contacto"
      />
    </>
  );
}
