import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const PatchPropertySchema = z.object({
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

type Params = { params: Promise<{ id: string }> };

async function assertScope(
  session: Awaited<ReturnType<typeof getSession>>,
  propertyId: string,
) {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, deletedAt: null },
    select: { id: true, inmobiliariaId: true },
  });
  if (!property) return null;
  if (!session) return "forbidden";

  if (session.role !== "ADMIN") {
    if (
      !session.inmobiliariaId ||
      property.inmobiliariaId !== session.inmobiliariaId
    ) {
      return "forbidden";
    }
  }

  return property;
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const scope = await assertScope(session, id);
  if (!scope) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (scope === "forbidden")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const property = await prisma.property.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      city: true,
      neighborhood: true,
      address: true,
      latitude: true,
      longitude: true,
      roiAnnualPct: true,
      appreciationAnnualPct: true,
      isFeatured: true,
      featuredOrder: true,
      priceUsd: true,
      description: true,
      coverImageUrl: true,
      gallery: true,
      advisorId: true,
      inmobiliariaId: true,
    },
  });

  if (!property || property.id !== scope.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(property);
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role !== "ADMIN" && session.role !== "INMOBILIARIA") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const scope = await assertScope(session, id);
  if (!scope) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (scope === "forbidden")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = PatchPropertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const inmobiliariaId =
    session.role === "ADMIN"
      ? (data.inmobiliariaId ?? scope.inmobiliariaId)
      : session.inmobiliariaId;

  try {
    await prisma.property.update({
      where: { id },
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
        inmobiliariaId: inmobiliariaId ?? null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Slug ya existe" }, { status: 409 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role !== "ADMIN" && session.role !== "INMOBILIARIA") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const scope = await assertScope(session, id);
  if (!scope) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (scope === "forbidden")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.property.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
