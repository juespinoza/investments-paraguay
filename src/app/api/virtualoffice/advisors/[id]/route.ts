import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const PatchAdvisorSchema = z.object({
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
    startDate: z.string().min(1),
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

type Params = { params: Promise<{ id: string }> };

async function assertScope(session: any, advisorId: string) {
  const advisor = await prisma.advisor.findFirst({
    where: { id: advisorId, deletedAt: null },
    select: { id: true, inmobiliariaId: true },
  });
  console.log("advisor", advisor);
  if (!advisor) return null;

  if (session.role !== "ADMIN") {
    if (
      !session.inmobiliariaId ||
      advisor.inmobiliariaId !== session.inmobiliariaId
    ) {
      return "forbidden";
    }
  }
  return advisor;
}

export async function GET(_req: Request, { params }: Params) {
  console.log("GET advisor by id");
  const session = await getSession();
  console.log("session", session);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  console.log("Fetching advisor", id);

  const scope = await assertScope(session, id);
  console.log("scope", scope);
  if (!scope) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (scope === "forbidden")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const advisor = await prisma.advisor.findUnique({
    where: { id },
    include: {
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
    },
  });

  if (!advisor || advisor.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // map shape para AdvisorFormValues
  const initialData = {
    fullName: advisor.fullName,
    slug: advisor.slug,
    headline: advisor.headline,
    heroBgUrl: advisor.heroBgUrl,
    ctaLabel: advisor.ctaLabel,
    ctaHref: advisor.ctaHref,
    inmobiliariaId: advisor.inmobiliariaId,
    landing: advisor.landing
      ? {
          aboutImageUrl: advisor.landing.aboutImageUrl ?? null,
          aboutTitle: advisor.landing.aboutTitle,
          startDate: new Date(advisor.landing.startDate)
            .toISOString()
            .slice(0, 10),
          company: advisor.landing.company,
          aboutDescription: advisor.landing.aboutDescription ?? null,
          aboutParagraph1: advisor.landing.aboutParagraph1,
          aboutParagraph2: advisor.landing.aboutParagraph2,
          servicesParagraph1: advisor.landing.servicesParagraph1,
          servicesParagraph2: advisor.landing.servicesParagraph2,
          propertyTypes: advisor.landing.propertyTypes.map((x) => x.value),
          clientTypes: advisor.landing.clientTypes.map((x) => x.value),
          areas: advisor.landing.areas.map((x) => x.value),
          serviceList: advisor.landing.serviceList.map((x) => x.value),
          testimonies: advisor.landing.testimonies.map((t) => ({
            name: t.name,
            text: t.text,
          })),
          socialMedia: advisor.landing.socialMedia.map((s) => ({
            platform: s.platform,
            label: s.label,
            value: s.value,
            href: s.href,
          })),
          featuredPropertyIds: advisor.landing.featuredProperties.map(
            (fp) => fp.propertyId
          ),
        }
      : null,
  };

  return NextResponse.json(initialData);
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

  const body = await req.json();
  const parsed = PatchAdvisorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const inmobiliariaId =
    session.role === "ADMIN"
      ? data.inmobiliariaId ?? scope.inmobiliariaId
      : session.inmobiliariaId;

  try {
    await prisma.$transaction(async (tx) => {
      // Update advisor
      await tx.advisor.update({
        where: { id },
        data: {
          fullName: data.fullName,
          slug: data.slug,
          headline: data.headline ?? null,
          heroBgUrl: data.heroBgUrl ?? null,
          ctaLabel: data.ctaLabel ?? null,
          ctaHref: data.ctaHref ?? null,
          inmobiliariaId,
        },
      });

      // Upsert landing
      const landing = await tx.landingAdvisor.upsert({
        where: { advisorId: id },
        create: {
          advisorId: id,
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
        update: {
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

      // Replace arrays (simple + robust)
      await tx.landingAdvisorPropertyType.deleteMany({
        where: { landingId: landing.id },
      });
      await tx.landingAdvisorClientType.deleteMany({
        where: { landingId: landing.id },
      });
      await tx.landingAdvisorArea.deleteMany({
        where: { landingId: landing.id },
      });
      await tx.landingAdvisorServiceItem.deleteMany({
        where: { landingId: landing.id },
      });
      await tx.advisorTestimonial.deleteMany({
        where: { landingId: landing.id },
      });
      await tx.advisorSocialLink.deleteMany({
        where: { landingId: landing.id },
      });
      await tx.landingAdvisorFeaturedProperty.deleteMany({
        where: { landingId: landing.id },
      });

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

      if (data.landing.testimonies.length) {
        await tx.advisorTestimonial.createMany({
          data: data.landing.testimonies.map((t) => ({
            landingId: landing.id,
            name: t.name,
            text: t.text,
          })),
        });
      }

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

      const ids = data.landing.featuredPropertyIds.slice(0, 3);
      if (ids.length) {
        const found = await tx.property.findMany({
          where: { id: { in: ids }, deletedAt: null },
          select: { id: true, inmobiliariaId: true },
        });
        const foundSet = new Set(found.map((p) => p.id));
        for (const pid of ids)
          if (!foundSet.has(pid))
            throw new Error("Featured property not found");

        if (session.role !== "ADMIN") {
          for (const p of found) {
            if (p.inmobiliariaId !== inmobiliariaId)
              throw new Error("Featured outside scope");
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
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (String(e?.code) === "P2002") {
      return NextResponse.json({ error: "Slug ya existe" }, { status: 409 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Update failed" },
      { status: 500 }
    );
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

  await prisma.advisor.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
