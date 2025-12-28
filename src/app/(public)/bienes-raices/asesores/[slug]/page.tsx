import { apiGet } from "@/lib/api/public";
import { notFound } from "next/navigation";
import { HeroSplit } from "@/components/landing/HeroSplit";
import { AboutSection } from "@/components/landing/AboutSection";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import { SocialLinks } from "@/components/landing/SocialLinks";
import { PublicAdvisorLanding } from "@/lib/data/types";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { CTAWide } from "@/components/landing/CTAWide";
import { Testimonials } from "@/components/landing/Testimonials";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export default async function AdvisorLandingPage({ params }: PageProps) {
  const { slug } = await params;

  const d = await apiGet<PublicAdvisorLanding>(
    `/api/public/asesores/${slug}`,
    revalidate
  );

  if (!d) notFound();

  console.log("Advisor landing data:", d);

  const featuredItems = d.featuredProperties.map((p) => ({
    slug: p.slug,
    title: p.title,
    subtitle: p.city ?? "",
    coverImageUrl: p.coverImageUrl ?? "intentoPortada_wku8ef",
    href: `/bienes-raices/${p.slug}`,
    badge: "Venta",
  }));

  return (
    <>
      <HeroSplit
        brandLeft=""
        brandRight=""
        title={d.fullName}
        subtitle={d.headline ?? ""}
        ctaLabel={d.ctaLabel ?? "Contactar"}
        ctaHref={d.ctaHref ?? "#"}
        backgroundImageUrl={d.heroBgUrl ?? "/backgrounds/office.jpg"}
      />

      <AboutSection
        leftImageUrl={d.about.imageUrl}
        leftImageAlt={d.fullName}
        eyebrow="Sobre mí"
        title={d.about.title}
        paragraphs={[d.about.paragraphs[0], d.about.paragraphs[1]]}
        ctaLabel={d.ctaLabel ?? "Contactar"}
        ctaHref={d.ctaHref ?? "#"}
      />

      <ServicesSection
        rightImageUrl="specialization_gccm0n"
        rightImageAlt="Especialidad"
        eyebrow="Servicios inmobiliarios"
        title="Especialización y compromiso"
        paragraphs={[d.services.paragraphs[0], d.services.paragraphs[1]]}
        ctaLabel={d.ctaLabel ?? "Contactar"}
        ctaHref={d.ctaHref ?? "#"}
      />

      <CTAWide
        line1="Obtenga las mejores opciones de inversión con la ayuda de"
        highlight="nuestro grupo de asesores altamente experimentados"
      />

      <FeaturedGrid title="Propiedades destacadas" items={featuredItems} />

      <Testimonials title="Testimonios" items={d.testimonies} />

      <SocialLinks title="Redes sociales" items={d.socialMedia} />
    </>
  );
}
