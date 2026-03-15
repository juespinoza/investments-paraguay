import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import {
  buildPropertyListWhere,
  canCreateProperty,
  PropertyRepoError,
  PropertyUpsertSchema,
  resolvePropertyAssignments,
} from "@/lib/virtualoffice/properties";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);

  const q = (url.searchParams.get("q") ?? "").trim();
  const take = Math.min(Number(url.searchParams.get("take") ?? "30"), 50);
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const advisorId = url.searchParams.get("advisorId") ?? undefined;
  let where;
  try {
    where = buildPropertyListWhere(session, { q, advisorId });
  } catch (error) {
    if (error instanceof PropertyRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "List failed" }, { status: 500 });
  }

  const items = await prisma.property.findMany({
    where,
    take: take + 1,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      title: true,
      slug: true,
      city: true,
      neighborhood: true,
      priceUsd: true,
      roiAnnualPct: true,
      appreciationAnnualPct: true,
      isFeatured: true,
      updatedAt: true,
      advisor: { select: { fullName: true } },
    },
  });

  const hasMore = items.length > take;
  const slice = hasMore ? items.slice(0, take) : items;
  const nextCursor = hasMore ? slice[slice.length - 1]?.id ?? null : null;

  return NextResponse.json({ items: slice, nextCursor });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!canCreateProperty(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PropertyUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const assignments = await resolvePropertyAssignments(session, data);

    const created = await prisma.property.create({
      data: {
        title: data.title,
        slug: data.slug,
        city: data.city ?? null,
        neighborhood: data.neighborhood ?? null,
        address: data.address ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        roiAnnualPct: data.roiAnnualPct ?? null,
        appreciationAnnualPct: data.appreciationAnnualPct ?? null,
        isFeatured: assignments.isFeatured,
        featuredOrder: assignments.featuredOrder,
        priceUsd: data.priceUsd ?? null,
        description: data.description ?? null,
        coverImageUrl: data.coverImageUrl ?? null,
        gallery: data.gallery,
        advisorId: assignments.advisorId,
        inmobiliariaId: assignments.inmobiliariaId,
      },
      select: { id: true },
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Slug ya existe" }, { status: 409 });
    }
    if (e instanceof PropertyRepoError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
