import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const property = await prisma.property.findFirst({
    where: { slug, deletedAt: null },
    include: {
      advisor: {
        select: {
          slug: true,
          fullName: true,
          headline: true,
          photoUrl: true,
          whatsapp: true,
          phone: true,
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

  const response = {
    slug: property.slug,
    title: property.title,
    subtitle: property.description,
    description: property.description,
    coverImageUrl: property.coverImageUrl,
    gallery: property.gallery,
    priceUsd: property.priceUsd,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaM2: property.areaM2 ? Number(property.areaM2) : null,
    city: property.city,
    neighborhood: property.neighborhood,
    address: property.address,
    latitude: property.latitude ? Number(property.latitude) : null,
    longitude: property.longitude ? Number(property.longitude) : null,
    roiAnnualPct: property.roiAnnualPct ? Number(property.roiAnnualPct) : null,
    appreciationAnnualPct: property.appreciationAnnualPct
      ? Number(property.appreciationAnnualPct)
      : null,

    advisor: property.advisor
      ? {
          slug: property.advisor.slug,
          fullName: property.advisor.fullName,
          headline: property.advisor.headline,
          photoUrl: property.advisor.photoUrl,
          whatsapp: property.advisor.whatsapp,
          phone: property.advisor.phone,
        }
      : null,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
