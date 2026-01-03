// src/app/api/virtualoffice/advisors/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidateTag } from "@/lib/cache/revalidate";
import { requireSession } from "@/lib/auth/require-session";
import { SessionPayload } from "@/lib/data/types";

// --------- utils ----------
function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const CreateAdvisorSchema = z.object({
  fullName: z.string().min(3),
  slug: z
    .string()
    .optional()
    .transform((v) => (v ? slugify(v) : v))
    .refine((v) => !v || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v), "Invalid slug"),
  inmobiliariaId: z.string().optional().nullable(),
  headline: z.string().optional().nullable(),
  heroBgUrl: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),

  // opcional: si querés crear también base de landing desde acá
  landing: z
    .object({
      aboutTitle: z.string().optional(),
      company: z.string().optional(),
    })
    .optional(),
});

// --------- GET: list advisors ----------
export async function GET(req: Request) {
  const session = (await requireSession()) as SessionPayload;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(
    50,
    Math.max(5, Number(searchParams.get("limit") || "20"))
  );
  const skip = (page - 1) * limit;

  // scope por role (multitenant)
  const where: any = { deletedAt: null };

  if (session.role === "INMOBILIARIA") {
    if (!session.inmobiliariaId) {
      return NextResponse.json({ items: [], page, limit, total: 0 });
    }
    where.inmobiliariaId = session.inmobiliariaId;
  } else if (session.role === "ASESOR") {
    // Asesor solo ve su propio advisor
    if (!session.advisorId) {
      return NextResponse.json({ items: [], page, limit, total: 0 });
    }
    where.id = session.advisorId;
  } else if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { headline: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, items] = await prisma.$transaction([
    prisma.advisor.count({ where }),
    prisma.advisor.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        fullName: true,
        slug: true,
        headline: true,
        inmobiliariaId: true,
        inmobiliaria: { select: { id: true, name: true, slug: true } },
        updatedAt: true,
      },
    }),
  ]);

  return NextResponse.json(
    { items, page, limit, total },
    { headers: { "Cache-Control": "no-store" } }
  );
}

// --------- POST: create advisor ----------
export async function POST(req: Request) {
  const session = await requireSession();

  if (session.role !== "ADMIN" && session.role !== "INMOBILIARIA") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateAdvisorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // slug fallback
  const finalSlug = data.slug?.trim() || slugify(data.fullName);

  // si INMOBILIARIA, fuerza inmobiliariaId = la suya
  const inmobiliariaId =
    session.role === "INMOBILIARIA"
      ? session.inmobiliariaId
      : data.inmobiliariaId ?? null;

  if (session.role === "INMOBILIARIA" && !inmobiliariaId) {
    return NextResponse.json(
      { error: "Missing inmobiliariaId in session" },
      { status: 400 }
    );
  }

  // unique slug check
  const existing = await prisma.advisor.findUnique({
    where: { slug: finalSlug },
  });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const now = new Date();

  const created = await prisma.advisor.create({
    data: {
      fullName: data.fullName,
      slug: finalSlug,
      headline: data.headline ?? null,
      heroBgUrl: data.heroBgUrl ?? null,
      ctaLabel: data.ctaLabel ?? "Contactar",
      ctaHref: data.ctaHref ?? "#",
      inmobiliariaId: inmobiliariaId ?? null,

      landing: {
        create: {
          aboutImageUrl: "", // podés cambiar a un placeholder
          aboutTitle: data.landing?.aboutTitle ?? "Sobre mí",
          startDate: now,
          company: data.landing?.company ?? "SkyOne",
          aboutDescription: null,
          aboutParagraph1: "Escribe aquí tu primer párrafo.",
          aboutParagraph2: "Escribe aquí tu segundo párrafo.",
          servicesParagraph1: "Servicios - párrafo 1",
          servicesParagraph2: "Servicios - párrafo 2",
        },
      },
    },
    select: { id: true, slug: true },
  });

  // Invalida caches públicas (por si hay listados públicos)
  revalidateTag("public:advisors");
  revalidateTag(`public:advisor:${created.slug}`);

  return NextResponse.json(
    { ok: true, id: created.id, slug: created.slug },
    { status: 201 }
  );
}
