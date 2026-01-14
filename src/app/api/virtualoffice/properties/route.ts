import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

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
  const where: any = { deletedAt: null };

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
    select: { id: true, title: true, city: true, priceUsd: true },
  });

  const hasMore = items.length > take;
  const slice = hasMore ? items.slice(0, take) : items;
  const nextCursor = hasMore ? slice[slice.length - 1]?.id ?? null : null;

  return NextResponse.json({ items: slice, nextCursor });
}
