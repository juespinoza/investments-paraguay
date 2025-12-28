import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const properties = await prisma.property.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      slug: true,
      title: true,
      coverImageUrl: true,
      priceUsd: true,
      city: true,
      advisor: {
        select: {
          slug: true,
          fullName: true,
        },
      },
    },
  });

  const response = properties.map((p: any) => ({
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    coverImageUrl: p.coverImageUrl,
    priceUsd: p.priceUsd,
    city: p.city,
    advisor: p.advisor
      ? {
          slug: p.advisor.slug,
          fullName: p.advisor.fullName,
        }
      : null,
  }));

  return NextResponse.json(response);
}
