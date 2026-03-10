import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const UpsertPropertySchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  city: z.string().nullable().optional(),
  neighborhood: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  roiAnnualPct: z.number().min(0).max(100).nullable().optional(),
  appreciationAnnualPct: z.number().min(0).max(100).nullable().optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().int().nullable().optional(),
  priceUsd: z.number().int().positive().nullable().optional(),
  description: z.string().nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  gallery: z.array(z.string()).default([]),
  advisorId: z.string().nullable().optional(),
  inmobiliariaId: z.string().nullable().optional(),
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);

  const q = (url.searchParams.get("q") ?? "").trim();
  const take = Math.min(Number(url.searchParams.get("take") ?? "30"), 50);
  const cursor = url.searchParams.get("cursor") ?? undefined;

  const advisorId = url.searchParams.get("advisorId") ?? undefined;

  // scoping por inmobiliaria si no es ADMIN
  const where: {
    deletedAt: null;
    inmobiliariaId?: string;
    advisorId?: string;
    OR?: Array<
      | { title: { contains: string; mode: "insensitive" } }
      | { slug: { contains: string; mode: "insensitive" } }
      | { city: { contains: string; mode: "insensitive" } }
    >;
  } = { deletedAt: null };

  if (session.role !== "ADMIN") {
    if (!session.inmobiliariaId) {
      return NextResponse.json(
        { error: "Missing inmobiliaria scope" },
        { status: 403 }
      );
    }
    where.inmobiliariaId = session.inmobiliariaId;
  }

  if (advisorId) where.advisorId = advisorId;

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
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

  if (session.role !== "ADMIN" && session.role !== "INMOBILIARIA") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = UpsertPropertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const inmobiliariaId =
    session.role === "ADMIN"
      ? (data.inmobiliariaId ?? null)
      : (session.inmobiliariaId ?? null);

  if (session.role !== "ADMIN" && !inmobiliariaId) {
    return NextResponse.json(
      { error: "Missing inmobiliaria scope" },
      { status: 403 },
    );
  }

  try {
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
        isFeatured: data.isFeatured ?? false,
        featuredOrder: data.featuredOrder ?? null,
        priceUsd: data.priceUsd ?? null,
        description: data.description ?? null,
        coverImageUrl: data.coverImageUrl ?? null,
        gallery: data.gallery,
        advisorId: data.advisorId ?? null,
        inmobiliariaId,
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
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
