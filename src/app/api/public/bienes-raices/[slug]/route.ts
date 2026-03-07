import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
    include: {
      advisor: {
        select: {
          slug: true,
          fullName: true,
          headline: true,
          photoUrl: true,
          whatsapp: true,
        },
      },
    },
  });

  if (!property) {
    return NextResponse.json(
      { message: "Propiedad no encontrada" },
      { status: 404 }
    );
  }

  const estimateMetrics = (priceUsd: number | null) => {
    if (!priceUsd || priceUsd <= 0) {
      return { roiAnnualApproxPct: 7.5, appreciationAnnualApproxPct: 5.2 };
    }
    if (priceUsd < 60000) {
      return { roiAnnualApproxPct: 9.4, appreciationAnnualApproxPct: 6.1 };
    }
    if (priceUsd < 120000) {
      return { roiAnnualApproxPct: 8.2, appreciationAnnualApproxPct: 5.7 };
    }
    return { roiAnnualApproxPct: 7.1, appreciationAnnualApproxPct: 5.1 };
  };

  const response = {
    slug: property.slug,
    title: property.title,
    subtitle: property.description,
    description: property.description,
    coverImageUrl: property.coverImageUrl,
    gallery: property.gallery,
    priceUsd: property.priceUsd,
    city: property.city,
    mapQuery: `${property.title}, ${property.city ?? "Paraguay"}`,
    ...estimateMetrics(property.priceUsd),

    advisor: property.advisor
      ? {
          slug: property.advisor.slug,
          fullName: property.advisor.fullName,
          headline: property.advisor.headline,
          photoUrl: property.advisor.photoUrl,
          whatsapp: property.advisor.whatsapp,
        }
      : null,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
