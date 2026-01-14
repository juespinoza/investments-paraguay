// src/app/api/virtualoffice/advisors/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";

const CreateAdvisorSchema = z.object({
  fullName: z.string().min(3),
  slug: z.string().min(3),
  headline: z.string().nullable().optional(),
  heroBgUrl: z.string().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaHref: z.string().nullable().optional(),
  inmobiliariaId: z.string().nullable().optional(),

  landing: z.object({
    aboutImageUrl: z.string().nullable().optional(),
    aboutTitle: z.string().min(1),
    startDate: z.string().min(1), // yyyy-mm-dd
    company: z.string().min(1),
    aboutDescription: z.string().nullable().optional(),
    aboutParagraph1: z.string().min(1),
    aboutParagraph2: z.string().min(1),

    servicesParagraph1: z.string().min(1),
    servicesParagraph2: z.string().min(1),

    propertyTypes: z.array(z.string()).default([]),
    clientTypes: z.array(z.string()).default([]),
    areas: z.array(z.string()).default([]),
    serviceList: z.array(z.string()).default([]),

    testimonies: z
      .array(z.object({ name: z.string().min(1), text: z.string().min(1) }))
      .default([]),

    socialMedia: z
      .array(
        z.object({
          platform: z.enum([
            "WHATSAPP",
            "EMAIL",
            "BLOG",
            "WEB",
            "INSTAGRAM",
            "FACEBOOK",
            "X",
            "TIKTOK",
          ]),
          label: z.string().min(1),
          value: z.string().min(1),
          href: z.string().min(1),
        })
      )
      .default([]),

    featuredPropertyIds: z.array(z.string()).max(3).default([]),
  }),
});

// --------- GET: list advisors ----------
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const take = Math.min(Number(url.searchParams.get("take") ?? "20"), 50);

  // scoping
  const whereBase: any = { deletedAt: null };
  if (session.role !== "ADMIN") {
    if (!session.inmobiliariaId) {
      return NextResponse.json(
        { error: "Missing inmobiliaria scope" },
        { status: 403 }
      );
    }
    whereBase.inmobiliariaId = session.inmobiliariaId;
  }

  const where = q
    ? {
        ...whereBase,
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      }
    : whereBase;

  const items = await prisma.advisor.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      fullName: true,
      slug: true,
      headline: true,
      inmobiliariaId: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ items });
}

// --------- POST: create advisor ----------
export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // permisos básicos
  if (session.role !== "ADMIN" && session.role !== "INMOBILIARIA") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = CreateAdvisorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // scope inmobiliaria
  const inmobiliariaId =
    session.role === "ADMIN"
      ? data.inmobiliariaId ?? null
      : session.inmobiliariaId ?? null;

  if (session.role !== "ADMIN" && !inmobiliariaId) {
    return NextResponse.json(
      { error: "Missing inmobiliariaId in session" },
      { status: 403 }
    );
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const advisor = await tx.advisor.create({
        data: {
          fullName: data.fullName,
          slug: data.slug,
          headline: data.headline ?? null,
          heroBgUrl: data.heroBgUrl ?? null,
          ctaLabel: data.ctaLabel ?? "Contactar",
          ctaHref: data.ctaHref ?? "#",
          inmobiliariaId,
        },
        select: { id: true },
      });

      const landing = await tx.landingAdvisor.create({
        data: {
          advisorId: advisor.id,
          aboutImageUrl: data.landing.aboutImageUrl ?? "",
          aboutTitle: data.landing.aboutTitle,
          startDate: new Date(data.landing.startDate),
          company: data.landing.company,
          aboutDescription: data.landing.aboutDescription ?? null,
          aboutParagraph1: data.landing.aboutParagraph1,
          aboutParagraph2: data.landing.aboutParagraph2,
          servicesParagraph1: data.landing.servicesParagraph1,
          servicesParagraph2: data.landing.servicesParagraph2,
        },
        select: { id: true },
      });

      // arrays simples
      if (data.landing.propertyTypes.length) {
        await tx.landingAdvisorPropertyType.createMany({
          data: data.landing.propertyTypes.map((value) => ({
            landingId: landing.id,
            value,
          })),
        });
      }
      if (data.landing.clientTypes.length) {
        await tx.landingAdvisorClientType.createMany({
          data: data.landing.clientTypes.map((value) => ({
            landingId: landing.id,
            value,
          })),
        });
      }
      if (data.landing.areas.length) {
        await tx.landingAdvisorArea.createMany({
          data: data.landing.areas.map((value) => ({
            landingId: landing.id,
            value,
          })),
        });
      }
      if (data.landing.serviceList.length) {
        await tx.landingAdvisorServiceItem.createMany({
          data: data.landing.serviceList.map((value) => ({
            landingId: landing.id,
            value,
          })),
        });
      }

      // testimonios
      if (data.landing.testimonies.length) {
        await tx.advisorTestimonial.createMany({
          data: data.landing.testimonies.map((t) => ({
            landingId: landing.id,
            name: t.name,
            text: t.text,
          })),
        });
      }

      // social links
      if (data.landing.socialMedia.length) {
        await tx.advisorSocialLink.createMany({
          data: data.landing.socialMedia.map((s) => ({
            landingId: landing.id,
            platform: s.platform,
            label: s.label,
            value: s.value,
            href: s.href,
          })),
        });
      }

      // featured properties (validación: solo del asesor creado o scoping por inmobiliaria si querés)
      const ids = data.landing.featuredPropertyIds.slice(0, 3);
      if (ids.length) {
        // Validar que existan
        const found = await tx.property.findMany({
          where: { id: { in: ids }, deletedAt: null },
          select: { id: true, advisorId: true, inmobiliariaId: true },
        });

        const foundSet = new Set(found.map((p) => p.id));
        for (const id of ids) {
          if (!foundSet.has(id)) throw new Error("Featured property not found");
        }

        // regla: si querés limitar a propiedades del asesor, todavía no tiene -> podrías permitir solo por inmobiliaria
        // acá: si no es ADMIN, exige inmobiliariaId match
        if (session.role !== "ADMIN") {
          for (const p of found) {
            if (p.inmobiliariaId !== inmobiliariaId) {
              throw new Error("Featured property outside scope");
            }
          }
        }

        await tx.landingAdvisorFeaturedProperty.createMany({
          data: ids.map((propertyId, idx) => ({
            landingId: landing.id,
            propertyId,
            order: idx + 1,
          })),
        });
      }

      return advisor;
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (e: any) {
    // Prisma unique constraint slug
    if (String(e?.code) === "P2002") {
      return NextResponse.json({ error: "Slug ya existe" }, { status: 409 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Create failed" },
      { status: 500 }
    );
  }
}
