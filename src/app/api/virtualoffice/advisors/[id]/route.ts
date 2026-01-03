// src/app/api/virtualoffice/advisors/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidateTag } from "@/lib/cache/revalidate";
import { requireSession } from "@/lib/auth/require-session";
import { SessionPayload } from "@/lib/data/types";

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

const SocialPlatformSchema = z.enum([
  "WHATSAPP",
  "EMAIL",
  "BLOG",
  "WEB",
  "INSTAGRAM",
  "FACEBOOK",
  "X",
  "TIKTOK",
]);

const UpdateAdvisorSchema = z.object({
  // Advisor base
  fullName: z.string().min(3),
  slug: z
    .string()
    .transform((v) => slugify(v))
    .refine((v) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v), "Invalid slug"),
  headline: z.string().optional().nullable(),
  heroBgUrl: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),
  inmobiliariaId: z.string().optional().nullable(),

  // Landing
  landing: z.object({
    aboutImageUrl: z.string().optional().nullable(),
    aboutTitle: z.string().min(1),
    startDate: z.string().or(z.date()),
    company: z.string().min(1),
    aboutDescription: z.string().optional().nullable(),
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
          platform: SocialPlatformSchema,
          label: z.string().min(1),
          value: z.string().min(1),
          href: z.string().min(1),
        })
      )
      .default([]),

    featuredPropertyIds: z.array(z.string()).max(3).default([]),
  }),
});

type Ctx = { params: Promise<{ id: string }> };

function canAccessAdvisor(
  session: any,
  advisor: { id: string; inmobiliariaId: string | null }
) {
  if (session.role === "ADMIN") return true;
  if (session.role === "INMOBILIARIA")
    return (
      !!session.inmobiliariaId &&
      session.inmobiliariaId === advisor.inmobiliariaId
    );
  if (session.role === "ASESOR")
    return !!session.advisorId && session.advisorId === advisor.id;
  return false;
}

// -------- GET detail --------
export async function GET(_req: Request, { params }: Ctx) {
  const session = (await requireSession()) as SessionPayload;
  const { id } = await params;

  const advisor = await prisma.advisor.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      inmobiliariaId: true,
    },
  });

  if (!advisor)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canAccessAdvisor(session, advisor))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const full = await prisma.advisor.findFirst({
    where: { id, deletedAt: null },
    include: {
      inmobiliaria: { select: { id: true, name: true } },
      landing: {
        include: {
          propertyTypes: true,
          clientTypes: true,
          areas: true,
          serviceList: true,
          testimonies: true,
          socialMedia: true,
          featuredProperties: { orderBy: { order: "asc" } },
        },
      },
      properties: {
        where: { deletedAt: null },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          coverImageUrl: true,
          city: true,
          priceUsd: true,
        },
      },
    },
  });

  return NextResponse.json(full, { headers: { "Cache-Control": "no-store" } });
}

// -------- PATCH update --------
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await requireSession();
  const { id } = await params;

  const base = await prisma.advisor.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, slug: true, inmobiliariaId: true },
  });
  if (!base) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canAccessAdvisor(session, base))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const json = await req.json().catch(() => null);
  const parsed = UpdateAdvisorSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const nextSlug = input.slug;

  // slug unique (si cambió)
  if (nextSlug !== base.slug) {
    const exists = await prisma.advisor.findUnique({
      where: { slug: nextSlug },
    });
    if (exists)
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
  }

  // si INMOBILIARIA: no permitir cambiar inmobiliariaId a otra
  let nextInmoId: string | null | undefined = input.inmobiliariaId ?? null;
  if (session.role === "INMOBILIARIA") {
    nextInmoId = session.inmobiliariaId ?? null;
  }
  if (session.role === "ASESOR") {
    // asesor no puede reasignar
    nextInmoId = undefined;
  }

  // featuredProperties validation (must belong to advisor)
  const featuredIds = input.landing.featuredPropertyIds ?? [];
  if (featuredIds.length > 3) {
    return NextResponse.json(
      { error: "Max 3 featured properties" },
      { status: 400 }
    );
  }

  if (featuredIds.length) {
    const countOwned = await prisma.property.count({
      where: { id: { in: featuredIds }, advisorId: id, deletedAt: null },
    });
    if (countOwned !== featuredIds.length) {
      return NextResponse.json(
        { error: "Featured properties must belong to this advisor" },
        { status: 400 }
      );
    }
  }

  const startDate =
    typeof input.landing.startDate === "string"
      ? new Date(input.landing.startDate)
      : input.landing.startDate;

  const updated = await prisma.$transaction(async (tx) => {
    const advisorUpdated = await tx.advisor.update({
      where: { id },
      data: {
        fullName: input.fullName,
        slug: nextSlug,
        headline: input.headline ?? null,
        heroBgUrl: input.heroBgUrl ?? null,
        ctaLabel: input.ctaLabel ?? "Contactar",
        ctaHref: input.ctaHref ?? "#",
        ...(nextInmoId !== undefined ? { inmobiliariaId: nextInmoId } : {}),
      },
      select: { id: true, slug: true },
    });

    // landing upsert
    const landing = await tx.landingAdvisor.upsert({
      where: { advisorId: id },
      create: {
        advisorId: id,
        aboutImageUrl: input.landing.aboutImageUrl ?? "",
        aboutTitle: input.landing.aboutTitle,
        startDate,
        company: input.landing.company,
        aboutDescription: input.landing.aboutDescription ?? null,
        aboutParagraph1: input.landing.aboutParagraph1,
        aboutParagraph2: input.landing.aboutParagraph2,
        servicesParagraph1: input.landing.servicesParagraph1,
        servicesParagraph2: input.landing.servicesParagraph2,
      },
      update: {
        aboutImageUrl: input.landing.aboutImageUrl ?? "",
        aboutTitle: input.landing.aboutTitle,
        startDate,
        company: input.landing.company,
        aboutDescription: input.landing.aboutDescription ?? null,
        aboutParagraph1: input.landing.aboutParagraph1,
        aboutParagraph2: input.landing.aboutParagraph2,
        servicesParagraph1: input.landing.servicesParagraph1,
        servicesParagraph2: input.landing.servicesParagraph2,
      },
      select: { id: true },
    });

    // reset lists (deleteMany + createMany) -> simple & fast
    await Promise.all([
      tx.landingAdvisorPropertyType.deleteMany({
        where: { landingId: landing.id },
      }),
      tx.landingAdvisorClientType.deleteMany({
        where: { landingId: landing.id },
      }),
      tx.landingAdvisorArea.deleteMany({ where: { landingId: landing.id } }),
      tx.landingAdvisorServiceItem.deleteMany({
        where: { landingId: landing.id },
      }),
      tx.advisorTestimonial.deleteMany({ where: { landingId: landing.id } }),
      tx.advisorSocialLink.deleteMany({ where: { landingId: landing.id } }),
      tx.landingAdvisorFeaturedProperty.deleteMany({
        where: { landingId: landing.id },
      }),
    ]);

    if (input.landing.propertyTypes.length) {
      await tx.landingAdvisorPropertyType.createMany({
        data: input.landing.propertyTypes.map((value) => ({
          landingId: landing.id,
          value,
        })),
      });
    }
    if (input.landing.clientTypes.length) {
      await tx.landingAdvisorClientType.createMany({
        data: input.landing.clientTypes.map((value) => ({
          landingId: landing.id,
          value,
        })),
      });
    }
    if (input.landing.areas.length) {
      await tx.landingAdvisorArea.createMany({
        data: input.landing.areas.map((value) => ({
          landingId: landing.id,
          value,
        })),
      });
    }
    if (input.landing.serviceList.length) {
      await tx.landingAdvisorServiceItem.createMany({
        data: input.landing.serviceList.map((value) => ({
          landingId: landing.id,
          value,
        })),
      });
    }
    if (input.landing.testimonies.length) {
      await tx.advisorTestimonial.createMany({
        data: input.landing.testimonies.map((t) => ({
          landingId: landing.id,
          name: t.name,
          text: t.text,
        })),
      });
    }
    if (input.landing.socialMedia.length) {
      await tx.advisorSocialLink.createMany({
        data: input.landing.socialMedia.map((s) => ({
          landingId: landing.id,
          platform: s.platform,
          label: s.label,
          value: s.value,
          href: s.href,
        })),
      });
    }

    // featured properties (order 1..3)
    if (featuredIds.length) {
      await tx.landingAdvisorFeaturedProperty.createMany({
        data: featuredIds.map((propertyId, idx) => ({
          landingId: landing.id,
          propertyId,
          order: idx + 1,
        })),
      });
    }

    return advisorUpdated;
  });

  // Invalida caches públicas (si tu landing pública usa fetch con tags)
  revalidateTag("public:advisors");
  revalidateTag(`public:advisor:${base.slug}`);
  revalidateTag(`public:advisor:${updated.slug}`);

  return NextResponse.json({ ok: true, id: updated.id, slug: updated.slug });
}

// -------- DELETE (soft delete) --------
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await requireSession();
  const { id } = await params;

  const base = await prisma.advisor.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, slug: true, inmobiliariaId: true },
  });
  if (!base) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canAccessAdvisor(session, base))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const now = new Date();

  await prisma.$transaction([
    prisma.advisor.update({ where: { id }, data: { deletedAt: now } }),
    prisma.landingAdvisor.updateMany({
      where: { advisorId: id },
      data: { deletedAt: now },
    }),
  ]);

  revalidateTag("public:advisors");
  revalidateTag(`public:advisor:${base.slug}`);

  return NextResponse.json({ ok: true });
}
