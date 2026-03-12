// src/app/(public)/bienes-raices/asesores/[slug]/page.tsx
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
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const advisor = await apiGet<PublicAdvisorLanding>(
    `/api/public/asesores/${slug}`,
    revalidate,
  );

  if (!advisor) {
    return buildMetadata({
      title: "Asesor inmobiliario | Investments Paraguay",
      description:
        "Conoce asesores inmobiliarios especializados en inversiones en Paraguay.",
      pathname: `/bienes-raices/asesores/${slug}`,
      locale: "es",
      noIndex: true,
    });
  }

  const description =
    advisor.headline ??
    advisor.about.description ??
    "Asesor inmobiliario especializado en inversión en Paraguay.";

  return buildMetadata({
    title: `${advisor.fullName} | Asesor Inmobiliario en Paraguay`,
    description,
    pathname: `/bienes-raices/asesores/${slug}`,
    locale: "es",
    image: advisor.about.imageUrl || "/images/logo.png",
    keywords: [
      advisor.fullName,
      "asesor inmobiliario paraguay",
      "inversión inmobiliaria paraguay",
      "bienes raíces paraguay",
    ],
  });
}

export default async function AdvisorLandingPage({ params }: PageProps) {
  const { slug } = await params;

  const d = await apiGet<PublicAdvisorLanding>(
    `/api/public/asesores/${slug}`,
    revalidate
  );

  if (!d) notFound();

  const featuredItems = d.featuredProperties.map((p) => ({
    slug: p.slug,
    title: p.title,
    subtitle: p.city ?? "",
    coverImageUrl: p.coverImageUrl ?? "intentoPortada_wku8ef",
    href: `/bienes-raices/propiedades/${p.slug}`,
    badge: "Venta",
  }));

  const aboutMeta = [
    d.about.yearsExperience
      ? { label: "Experiencia", value: d.about.yearsExperience }
      : null,
    d.about.companyName
      ? { label: "Firma", value: d.about.companyName }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

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
        meta={aboutMeta}
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
