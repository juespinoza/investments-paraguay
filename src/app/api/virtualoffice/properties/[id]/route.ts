import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import {
  assertPropertyScope,
  canDeleteProperty,
  canEditProperty,
  PropertyRepoError,
  PropertyUpsertSchema,
  resolvePropertyAssignments,
} from "@/lib/virtualoffice/properties";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await assertPropertyScope(session, id);
  } catch (error) {
    if (error instanceof PropertyRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Get failed" }, { status: 500 });
  }

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

  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(property);
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!canEditProperty(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  let scope;
  try {
    scope = await assertPropertyScope(session, id);
  } catch (error) {
    if (error instanceof PropertyRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
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
    const assignments = await resolvePropertyAssignments(session, data, scope);

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
        isFeatured: assignments.isFeatured,
        featuredOrder: assignments.featuredOrder,
        priceUsd: data.priceUsd ?? null,
        description: data.description ?? null,
        coverImageUrl: data.coverImageUrl ?? null,
        gallery: data.gallery,
        advisorId: assignments.advisorId,
        inmobiliariaId: assignments.inmobiliariaId,
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
    if (e instanceof PropertyRepoError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!canDeleteProperty(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  try {
    await assertPropertyScope(session, id);
  } catch (error) {
    if (error instanceof PropertyRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  await prisma.property.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
