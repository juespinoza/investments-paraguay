import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const advisor = await prisma.advisor.findUnique({
    where: { slug },
    include: {
      landing: {
        include: {
          propertyTypes: true,
          clientTypes: true,
          areas: true,
          serviceList: true,
          testimonies: true,
          socialMedia: true,
          featuredProperties: {
            orderBy: { order: "asc" },
            include: {
              property: true,
            },
          },
        },
      },
    },
  });

  if (!advisor || !advisor.landing) {
    return NextResponse.json(
      { message: "Asesor no encontrado" },
      { status: 404 }
    );
  }

  // Normalizamos la respuesta (ideal para frontend)
  const response = {
    slug: advisor.slug,
    fullName: advisor.fullName,
    headline: advisor.headline,
    heroBgUrl: advisor.heroBgUrl,
    ctaLabel: advisor.ctaLabel,
    ctaHref: advisor.ctaHref,

    about: {
      imageUrl: advisor.landing.aboutImageUrl,
      title: advisor.landing.aboutTitle,
      startDate: advisor.landing.startDate,
      company: advisor.landing.company,
      description: advisor.landing.aboutDescription,
      paragraphs: [
        advisor.landing.aboutParagraph1,
        advisor.landing.aboutParagraph2,
      ],
    },

    services: {
      propertyTypes: advisor.landing.propertyTypes.map((p: any) => p.value),
      clientTypes: advisor.landing.clientTypes.map((c: any) => c.value),
      areas: advisor.landing.areas.map((a: any) => a.value),
      serviceList: advisor.landing.serviceList.map((s: any) => s.value),
      paragraphs: [
        advisor.landing.servicesParagraph1,
        advisor.landing.servicesParagraph2,
      ],
    },

    featuredProperties: advisor.landing.featuredProperties.map((fp: any) => ({
      slug: fp.property.slug,
      title: fp.property.title,
      coverImageUrl: fp.property.coverImageUrl,
      priceUsd: fp.property.priceUsd,
      city: fp.property.city,
    })),

    testimonies: advisor.landing.testimonies.map((t: any) => ({
      name: t.name,
      text: t.text,
    })),

    socialMedia: advisor.landing.socialMedia.map((s: any) => ({
      label: s.label,
      value: s.value,
      href: s.href,
      platform: s.platform,
    })),
  };

  return NextResponse.json(response);
}
