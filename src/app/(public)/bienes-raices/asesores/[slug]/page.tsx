import { apiGet } from "@/lib/api/public";
import { notFound } from "next/navigation";
import { HeroSplit } from "@/components/landing/HeroSplit";
import { AboutSection } from "@/components/landing/AboutSection";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import { SocialLinks } from "@/components/landing/SocialLinks";
import { SocialItem } from "@/lib/data/types";

export const revalidate = 120;

type PublicAdvisorLanding = {
  slug: string;
  fullName: string;
  headline: string | null;
  heroBgUrl: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;

  about: {
    imageUrl: string;
    title: string;
    startDate: string;
    company: string;
    description: string | null;
    paragraphs: [string, string];
  };

  featuredProperties: Array<{
    slug: string;
    title: string;
    coverImageUrl: string | null;
    priceUsd: number | null;
    city: string | null;
  }>;

  socialMedia: Array<SocialItem>;
};

type PageProps = { params: Promise<{ slug: string }> };

export default async function AdvisorLandingPage({ params }: PageProps) {
  const { slug } = await params;

  const d = await apiGet<PublicAdvisorLanding>(
    `/api/public/asesores/${slug}`,
    300
  );

  if (!d) notFound();

  const featuredItems = d.featuredProperties.map((p) => ({
    slug: p.slug,
    title: p.title,
    subtitle: p.city ?? "",
    coverImageUrl: p.coverImageUrl ?? "/placeholders/property.jpg",
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

      <FeaturedGrid title="Propiedades destacadas" items={featuredItems} />

      <SocialLinks title="Redes sociales" items={d.socialMedia} />
    </>
  );
}
