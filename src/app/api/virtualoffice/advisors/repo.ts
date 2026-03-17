import "server-only";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import type { SessionPayload, PublicAdvisorLanding } from "@/lib/data/types";
import { Prisma } from "@/generated/prisma";
import { FormSchema } from "@/components/virtualoffice/advisors/schema";
import type { z } from "zod";
import { syncAdvisorTenantAssignments } from "@/lib/virtualoffice/assignment-sync";

export class AdvisorRepoError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "AdvisorRepoError";
    this.status = status;
  }
}

export type AdvisorPayload = z.output<typeof FormSchema>;
export type AdvisorFormData = z.input<typeof FormSchema>;

export type Advisor = {
  id: string;
  fullName: string;
  slug: string;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  headline?: string | null;
  createdAt?: Date | string;
};

const advisorDetailInclude = {
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
} satisfies Prisma.AdvisorInclude;

const publicAdvisorInclude = {
  landing: {
    include: {
      propertyTypes: true,
      clientTypes: true,
      areas: true,
      serviceList: true,
      testimonies: true,
      socialMedia: true,
      featuredProperties: {
        orderBy: { order: "asc" },
        include: {
          property: true,
        },
      },
    },
  },
} satisfies Prisma.AdvisorInclude;

type AdvisorWithDetail = Prisma.AdvisorGetPayload<{
  include: typeof advisorDetailInclude;
}>;

type AdvisorWithPublicLanding = Prisma.AdvisorGetPayload<{
  include: typeof publicAdvisorInclude;
}>;

function buildScopedWhere(session: SessionPayload) {
  const where: Prisma.AdvisorWhereInput = { deletedAt: null };

  if (session.role === "ADMIN") return where;

  if (session.role === "INMOBILIARIA") {
    if (!session.inmobiliariaId) {
      throw new AdvisorRepoError("Missing inmobiliaria scope", 403);
    }
    where.inmobiliariaId = session.inmobiliariaId;
    return where;
  }

  if (session.role === "ASESOR") {
    if (!session.advisorId) {
      throw new AdvisorRepoError("Missing advisor scope", 403);
    }
    where.id = session.advisorId;
    return where;
  }

  throw new AdvisorRepoError("Forbidden", 403);
}

async function requireAdvisorEditorSession() {
  const session = await requireSession();
  if (session.role !== "ADMIN" && session.role !== "INMOBILIARIA") {
    throw new AdvisorRepoError("Forbidden", 403);
  }
  return session;
}

async function findScopedAdvisorOrThrow(session: SessionPayload, id: string) {
  const advisor = await prisma.advisor.findFirst({
    where: {
      id,
      ...buildScopedWhere(session),
    },
    select: { id: true, inmobiliariaId: true, deletedAt: true },
  });

  if (!advisor || advisor.deletedAt) {
    throw new AdvisorRepoError("Asesor no encontrado", 404);
  }

  return advisor;
}

async function replaceLandingCollections(
  tx: Prisma.TransactionClient,
  landingId: string,
  data: AdvisorPayload["landing"],
) {
  await tx.landingAdvisorPropertyType.deleteMany({ where: { landingId } });
  await tx.landingAdvisorClientType.deleteMany({ where: { landingId } });
  await tx.landingAdvisorArea.deleteMany({ where: { landingId } });
  await tx.landingAdvisorServiceItem.deleteMany({ where: { landingId } });
  await tx.advisorTestimonial.deleteMany({ where: { landingId } });
  await tx.advisorSocialLink.deleteMany({ where: { landingId } });
  await tx.landingAdvisorFeaturedProperty.deleteMany({ where: { landingId } });

  if (data.propertyTypes.length) {
    await tx.landingAdvisorPropertyType.createMany({
      data: data.propertyTypes.map((value) => ({ landingId, value })),
    });
  }
  if (data.clientTypes.length) {
    await tx.landingAdvisorClientType.createMany({
      data: data.clientTypes.map((value) => ({ landingId, value })),
    });
  }
  if (data.areas.length) {
    await tx.landingAdvisorArea.createMany({
      data: data.areas.map((value) => ({ landingId, value })),
    });
  }
  if (data.serviceList.length) {
    await tx.landingAdvisorServiceItem.createMany({
      data: data.serviceList.map((value) => ({ landingId, value })),
    });
  }
  if (data.testimonies.length) {
    await tx.advisorTestimonial.createMany({
      data: data.testimonies.map((item) => ({
        landingId,
        name: item.name,
        text: item.text,
      })),
    });
  }
  if (data.socialMedia.length) {
    await tx.advisorSocialLink.createMany({
      data: data.socialMedia.map((item) => ({
        landingId,
        platform: item.platform,
        label: item.label,
        value: item.value,
        href: item.href,
      })),
    });
  }
}

async function validateFeaturedProperties(
  tx: Prisma.TransactionClient,
  propertyIds: string[],
  session: SessionPayload,
  inmobiliariaId: string | null,
) {
  const ids = propertyIds.slice(0, 3);
  if (!ids.length) return ids;

  const found = await tx.property.findMany({
    where: { id: { in: ids }, deletedAt: null },
    select: { id: true, inmobiliariaId: true },
  });

  const foundSet = new Set(found.map((property) => property.id));
  for (const propertyId of ids) {
    if (!foundSet.has(propertyId)) {
      throw new AdvisorRepoError("Featured property not found", 400);
    }
  }

  if (session.role !== "ADMIN") {
    for (const property of found) {
      if (property.inmobiliariaId !== inmobiliariaId) {
        throw new AdvisorRepoError("Featured property outside scope", 403);
      }
    }
  }

  return ids;
}

function mapAdvisorToFormData(advisor: AdvisorWithDetail): AdvisorFormData {
  return {
    fullName: advisor.fullName,
    slug: advisor.slug,
    headline: advisor.headline ?? null,
    heroBgUrl: advisor.heroBgUrl ?? null,
    ctaLabel: advisor.ctaLabel ?? null,
    ctaHref: advisor.ctaHref ?? null,
    inmobiliariaId: advisor.inmobiliariaId ?? null,
    landing: {
      aboutImageUrl: advisor.landing?.aboutImageUrl ?? advisor.photoUrl ?? null,
      aboutTitle: advisor.landing?.aboutTitle ?? "",
      startDate: advisor.landing
        ? new Date(advisor.landing.startDate).toISOString().slice(0, 10)
        : "",
      company: advisor.landing?.company ?? "",
      aboutDescription: advisor.landing?.aboutDescription ?? null,
      aboutParagraph1: advisor.landing?.aboutParagraph1 ?? "",
      aboutParagraph2: advisor.landing?.aboutParagraph2 ?? "",
      servicesParagraph1: advisor.landing?.servicesParagraph1 ?? "",
      servicesParagraph2: advisor.landing?.servicesParagraph2 ?? "",
      propertyTypes: advisor.landing?.propertyTypes.map((item) => item.value) ?? [],
      clientTypes: advisor.landing?.clientTypes.map((item) => item.value) ?? [],
      areas: advisor.landing?.areas.map((item) => item.value) ?? [],
      serviceList: advisor.landing?.serviceList.map((item) => item.value) ?? [],
      testimonies:
        advisor.landing?.testimonies.map((item) => ({
          name: item.name,
          text: item.text,
        })) ?? [],
      socialMedia:
        advisor.landing?.socialMedia.map((item) => ({
          platform: item.platform,
          label: item.label,
          value: item.value,
          href: item.href,
        })) ?? [],
      featuredPropertyIds:
        advisor.landing?.featuredProperties.map((item) => item.propertyId) ?? [],
    },
  };
}

function calculateYearsExperience(startDate: Date) {
  const now = new Date();
  let years = now.getUTCFullYear() - startDate.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - startDate.getUTCMonth();
  const dayDelta = now.getUTCDate() - startDate.getUTCDate();

  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
    years -= 1;
  }

  return Math.max(0, years);
}

function mapAdvisorToPublicLanding(
  advisor: AdvisorWithPublicLanding,
): PublicAdvisorLanding {
  if (!advisor.landing) {
    throw new AdvisorRepoError("Asesor no encontrado", 404);
  }

  return {
    slug: advisor.slug,
    fullName: advisor.fullName,
    headline: advisor.headline ?? null,
    heroBgUrl: advisor.heroBgUrl ?? null,
    ctaLabel: advisor.ctaLabel ?? null,
    ctaHref: advisor.ctaHref ?? null,
    about: {
      imageUrl: advisor.landing.aboutImageUrl || advisor.photoUrl || "",
      title: advisor.landing.aboutTitle,
      startDate: advisor.landing.startDate.toISOString(),
      companyName: advisor.landing.company,
      description: advisor.landing.aboutDescription ?? null,
      paragraphs: [
        advisor.landing.aboutParagraph1,
        advisor.landing.aboutParagraph2,
      ],
      yearsExperience: calculateYearsExperience(advisor.landing.startDate),
    },
    services: {
      propertyTypes: advisor.landing.propertyTypes.map((item) => item.value),
      clientTypes: advisor.landing.clientTypes.map((item) => item.value),
      areas: advisor.landing.areas.map((item) => item.value),
      serviceList: advisor.landing.serviceList.map((item) => item.value),
      paragraphs: [
        advisor.landing.servicesParagraph1,
        advisor.landing.servicesParagraph2,
      ],
    },
    featuredProperties: advisor.landing.featuredProperties.map((item) => ({
      slug: item.property.slug,
      title: item.property.title,
      coverImageUrl: item.property.coverImageUrl ?? null,
      priceUsd: item.property.priceUsd ?? null,
      city: item.property.city ?? null,
    })),
    testimonies: advisor.landing.testimonies.map((item) => ({
      name: item.name,
      text: item.text,
    })),
    socialMedia: advisor.landing.socialMedia.map((item) => ({
      label: item.label,
      value: item.value,
      href: item.href,
      platform: item.platform,
    })),
  };
}

function normalizeRepoError(error: unknown): never {
  if (error instanceof AdvisorRepoError) throw error;

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new AdvisorRepoError("Slug ya existe", 409);
  }

  const message = error instanceof Error ? error.message : "Advisor repo error";
  throw new AdvisorRepoError(message, 500);
}

export async function listAdvisors(params?: {
  q?: string;
  take?: number;
}): Promise<Advisor[]> {
  const session = await requireSession();
  const q = params?.q?.trim() ?? "";
  const take = Math.min(params?.take ?? 20, 50);
  const whereBase = buildScopedWhere(session);

  const where = q
    ? {
        ...whereBase,
        OR: [
          { fullName: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { slug: { contains: q, mode: Prisma.QueryMode.insensitive } },
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
      phone: true,
      whatsapp: true,
      instagram: true,
      headline: true,
      createdAt: true,
    },
  });

  return items;
}

export async function getAdvisorById(id: string): Promise<AdvisorFormData | null> {
  const session = await requireSession();

  try {
    await findScopedAdvisorOrThrow(session, id);

    const advisor = await prisma.advisor.findUnique({
      where: { id },
      include: advisorDetailInclude,
    });

    if (!advisor || advisor.deletedAt) {
      return null;
    }

    return mapAdvisorToFormData(advisor);
  } catch (error) {
    if (error instanceof AdvisorRepoError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function upsertAdvisor(input: {
  id?: string;
  fullName: string;
  slug: string;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  headline?: string | null;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    if (input.id) {
      const updated = await prisma.advisor.update({
        where: { id: input.id },
        data: {
          fullName: input.fullName,
          slug: input.slug,
          phone: input.phone ?? null,
          whatsapp: input.whatsapp ?? null,
          instagram: input.instagram ?? null,
          headline: input.headline ?? null,
        },
        select: { id: true },
      });
      return { ok: true, id: updated.id };
    }

    const created = await prisma.advisor.create({
      data: {
        fullName: input.fullName,
        slug: input.slug,
        phone: input.phone ?? null,
        whatsapp: input.whatsapp ?? null,
        instagram: input.instagram ?? null,
        headline: input.headline ?? null,
      },
      select: { id: true },
    });

    return { ok: true, id: created.id };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, error: "Slug ya existe" };
    }
    return { ok: false, error: "No se pudo guardar el asesor." };
  }
}

export async function deleteAdvisorById(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await softDeleteAdvisor(id);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof AdvisorRepoError
          ? error.message
          : "No se pudo borrar el asesor.",
    };
  }
}

export async function softDeleteAdvisor(id: string): Promise<void> {
  const session = await requireAdvisorEditorSession();

  try {
    await findScopedAdvisorOrThrow(session, id);
    await prisma.advisor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } catch (error) {
    normalizeRepoError(error);
  }
}

export async function createAdvisor(data: AdvisorPayload): Promise<Advisor> {
  const session = await requireAdvisorEditorSession();
  const inmobiliariaId =
    session.role === "ADMIN"
      ? data.inmobiliariaId ?? null
      : session.inmobiliariaId ?? null;

  if (session.role !== "ADMIN" && !inmobiliariaId) {
    throw new AdvisorRepoError("Missing inmobiliariaId in session", 403);
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
        select: {
          id: true,
          fullName: true,
          slug: true,
          phone: true,
          whatsapp: true,
          instagram: true,
          headline: true,
          createdAt: true,
        },
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

      await replaceLandingCollections(tx, landing.id, data.landing);

      const featuredIds = await validateFeaturedProperties(
        tx,
        data.landing.featuredPropertyIds,
        session,
        inmobiliariaId,
      );

      if (featuredIds.length) {
        await tx.landingAdvisorFeaturedProperty.createMany({
          data: featuredIds.map((propertyId, index) => ({
            landingId: landing.id,
            propertyId,
            order: index + 1,
          })),
        });
      }

      return advisor;
    });

    return created;
  } catch (error) {
    normalizeRepoError(error);
  }
}

export async function updateAdvisor(
  id: string,
  data: AdvisorPayload,
): Promise<Advisor> {
  const session = await requireAdvisorEditorSession();
  const scopedAdvisor = await findScopedAdvisorOrThrow(session, id);
  const inmobiliariaId =
    session.role === "ADMIN"
      ? data.inmobiliariaId ?? scopedAdvisor.inmobiliariaId ?? null
      : session.inmobiliariaId ?? null;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const advisor = await tx.advisor.update({
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
        select: {
          id: true,
          fullName: true,
          slug: true,
          phone: true,
          whatsapp: true,
          instagram: true,
          headline: true,
          createdAt: true,
        },
      });

      await syncAdvisorTenantAssignments(tx, id, inmobiliariaId);

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

      await replaceLandingCollections(tx, landing.id, data.landing);

      const featuredIds = await validateFeaturedProperties(
        tx,
        data.landing.featuredPropertyIds,
        session,
        inmobiliariaId,
      );

      if (featuredIds.length) {
        await tx.landingAdvisorFeaturedProperty.createMany({
          data: featuredIds.map((propertyId, index) => ({
            landingId: landing.id,
            propertyId,
            order: index + 1,
          })),
        });
      }

      return advisor;
    });

    return updated;
  } catch (error) {
    normalizeRepoError(error);
  }
}

export async function getPublicAdvisorBySlug(
  slug: string,
): Promise<PublicAdvisorLanding | null> {
  const advisor = await prisma.advisor.findFirst({
    where: {
      slug,
      deletedAt: null,
    },
    include: publicAdvisorInclude,
  });

  if (!advisor || !advisor.landing) {
    return null;
  }

  return mapAdvisorToPublicLanding(advisor);
}
