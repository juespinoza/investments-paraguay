// src/app/api/virtualoffice/properties/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { toInteger } from "@/lib/api/utils";

export async function GET(req: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Roles permitidos: ADMIN, INMOBILIARIA, ASESOR
  const role = session.role;
  if (!["ADMIN", "INMOBILIARIA", "ASESOR"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);

  const advisorId = searchParams.get("advisorId")?.trim() || "";
  const q = (searchParams.get("q") || "").trim();
  const cursor = searchParams.get("cursor"); // id del último item
  const take = Math.min(
    Math.max(toInteger(searchParams.get("take"), 50), 10),
    100
  );

  if (!advisorId) {
    return NextResponse.json({ error: "Missing advisorId" }, { status: 400 });
  }

  // Seguridad: un ASESOR solo puede leer sus propiedades
  if (
    role === "ASESOR" &&
    session.advisorId &&
    session.advisorId !== advisorId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // TODO (opcional) INMOBILIARIA podría limitarse a su inmobiliaria
  // si role === "INMOBILIARIA" y session.inmobiliariaId existe, validar
  // que el advisor pertenezca a esa inmobiliaria.

  const where: any = {
    deletedAt: null,
    advisorId,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  // Para paginado robusto con cursor, se ordena por id desc (estable y cursor-friendly)
  const items = await prisma.property.findMany({
    where,
    take: take + 1, // pedimos 1 extra para saber si hay siguiente página
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
    orderBy: { id: "desc" },
    select: {
      id: true,
      title: true,
      city: true,
      priceUsd: true,
    },
  });

  const hasNext = items.length > take;
  const sliced = hasNext ? items.slice(0, take) : items;
  const nextCursor = hasNext ? sliced[sliced.length - 1]?.id ?? null : null;

  return NextResponse.json(
    {
      items: sliced,
      nextCursor,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
