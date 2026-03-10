import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const min = Number(url.searchParams.get("min") ?? "");
  const max = Number(url.searchParams.get("max") ?? "");

  const priceFilter: { gte?: number; lte?: number } = {};
  if (Number.isFinite(min) && min > 0) priceFilter.gte = min;
  if (Number.isFinite(max) && max > 0) priceFilter.lte = max;

  const properties = await prisma.property.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
              { neighborhood: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(Object.keys(priceFilter).length ? { priceUsd: priceFilter } : {}),
    },
    orderBy: [
      { isFeatured: "desc" },
      { featuredOrder: "asc" },
      { updatedAt: "desc" },
    ],
    select: {
      slug: true,
      title: true,
      description: true,
      coverImageUrl: true,
      priceUsd: true,
      city: true,
      neighborhood: true,
      latitude: true,
      longitude: true,
      roiAnnualPct: true,
      appreciationAnnualPct: true,
      updatedAt: true,
      isFeatured: true,
      featuredOrder: true,
      advisor: {
        select: {
          slug: true,
          fullName: true,
        },
      },
    },
  });

  const response = properties.map((p) => ({
    slug: p.slug,
    title: p.title,
    subtitle: p.description,
    coverImageUrl: p.coverImageUrl,
    priceUsd: p.priceUsd,
    city: p.city,
    neighborhood: p.neighborhood,
    latitude: p.latitude ? Number(p.latitude) : null,
    longitude: p.longitude ? Number(p.longitude) : null,
    updatedAt: p.updatedAt,
    isFeatured: p.isFeatured,
    featuredOrder: p.featuredOrder,
    roiAnnualPct: p.roiAnnualPct ? Number(p.roiAnnualPct) : null,
    appreciationAnnualPct: p.appreciationAnnualPct
      ? Number(p.appreciationAnnualPct)
      : null,
    advisor: p.advisor
      ? {
          slug: p.advisor.slug,
          fullName: p.advisor.fullName,
        }
      : null,
  }));

  response.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    const aOrder = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return NextResponse.json(response);
}
