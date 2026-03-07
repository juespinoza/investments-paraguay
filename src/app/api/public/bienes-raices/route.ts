import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function estimateMetrics(priceUsd: number | null) {
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
}

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
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(Object.keys(priceFilter).length ? { priceUsd: priceFilter } : {}),
    },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      slug: true,
      title: true,
      description: true,
      coverImageUrl: true,
      priceUsd: true,
      city: true,
      updatedAt: true,
      featuredInLandings: {
        select: { id: true },
        take: 1,
      },
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
    updatedAt: p.updatedAt,
    isFeatured: p.featuredInLandings.length > 0,
    ...estimateMetrics(p.priceUsd),
    advisor: p.advisor
      ? {
          slug: p.advisor.slug,
          fullName: p.advisor.fullName,
        }
      : null,
  }));

  response.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return NextResponse.json(response);
}
