import "server-only";

import { Role, Prisma } from "@/generated/prisma";
import { hashPassword, normalizeEmail } from "@/lib/auth/user-bootstrap";
import { prisma } from "@/lib/prisma";
import {
  canAccessAdvisors,
  canCreateAdvisor,
  canDeleteAdvisor,
  canEditAdvisor,
  can,
  isAdmin,
  isAdvisor,
  isInmobiliaria,
} from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/require-session";
import type { SessionPayload, PublicAdvisorLanding } from "@/lib/data/types";
import type { PublicAdvisorLandingV2 } from "@/lib/data/types";
import { FormSchema } from "@/components/virtualoffice/advisors/schema";
import type { z } from "zod";
import { syncAdvisorTenantAssignments } from "@/lib/virtualoffice/assignment-sync";
import {
  buildAdvisorCoreCreateData,
  buildAdvisorCoreUpdateData,
} from "@/lib/virtualoffice/advisor-core";
import {
  buildAdvisorLandingCreateData,
  buildAdvisorLandingUpdateData,
  mapAdvisorLandingToFormData,
  mapAdvisorLandingToFormDataV2,
  mapAdvisorToPublicLanding,
  mapAdvisorToPublicLandingV2,
  replaceAdvisorLandingCollections,
} from "@/lib/virtualoffice/advisor-landing";

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
export type AdvisorWorkflowUserInput = {
  email: string;
  password: string;
  name?: string | null;
};

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

function getAdvisorScopeWhere(
  session: SessionPayload,
  resource: "advisor_core" | "advisor_landing",
  action: "read" | "update",
) {
  const where: Prisma.AdvisorWhereInput = { deletedAt: null };

  if (!can(session, resource, action)) {
    throw new AdvisorRepoError("Forbidden", 403);
  }

  if (isAdmin(session)) return where;

  if (resource === "advisor_core" && isInmobiliaria(session)) {
    if (!session.inmobiliariaId) {
      throw new AdvisorRepoError("Missing inmobiliaria scope", 403);
    }
    where.inmobiliariaId = session.inmobiliariaId;
    return where;
  }

  if (isAdvisor(session)) {
    if (!session.advisorId) {
      throw new AdvisorRepoError("Missing advisor scope", 403);
    }
    where.id = session.advisorId;
    return where;
  }

  throw new AdvisorRepoError("Forbidden", 403);
}

function buildScopedWhere(session: SessionPayload) {
  const where: Prisma.AdvisorWhereInput = { deletedAt: null };

  if (!canAccessAdvisors(session)) {
    throw new AdvisorRepoError("Forbidden", 403);
  }

  if (isAdmin(session)) return where;

  if (isInmobiliaria(session)) {
    if (!session.inmobiliariaId) {
      throw new AdvisorRepoError("Missing inmobiliaria scope", 403);
    }
    where.inmobiliariaId = session.inmobiliariaId;
    return where;
  }

  if (isAdvisor(session)) {
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
  if (!canEditAdvisor(session)) {
    throw new AdvisorRepoError("Forbidden", 403);
  }
  return session;
}

async function requireAdvisorCoreSession(action: "read" | "update") {
  const session = await requireSession();
  if (!can(session, "advisor_core", action)) {
    throw new AdvisorRepoError("Forbidden", 403);
  }
  return session;
}

async function requireAdvisorLandingSession(action: "read" | "update") {
  const session = await requireSession();
  if (!can(session, "advisor_landing", action)) {
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

  if (!isAdmin(session)) {
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
    landing: mapAdvisorLandingToFormData(advisor),
  };
}

function mapAdvisorCoreToFormData(advisor: AdvisorWithDetail): AdvisorFormData {
  return {
    fullName: advisor.fullName,
    slug: advisor.slug,
    headline: advisor.headline ?? null,
    heroBgUrl: advisor.heroBgUrl ?? null,
    ctaLabel: advisor.ctaLabel ?? null,
    ctaHref: advisor.ctaHref ?? null,
    inmobiliariaId: advisor.inmobiliariaId ?? null,
    landing: {
      aboutImageUrl: null,
      aboutTitle: "",
      startDate: "",
      company: "",
      aboutDescription: null,
      aboutParagraph1: "",
      aboutParagraph2: "",
      servicesParagraph1: "",
      servicesParagraph2: "",
      propertyTypes: [],
      clientTypes: [],
      areas: [],
      serviceList: [],
      testimonies: [],
      socialMedia: [],
      featuredPropertyIds: [],
    },
  };
}

function normalizeRepoError(error: unknown): never {
  if (error instanceof AdvisorRepoError) throw error;

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = String(error.meta?.target ?? "");
    if (target.includes("email")) {
      throw new AdvisorRepoError("Ya existe un usuario con ese email.", 409);
    }
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
  const session = await requireAdvisorCoreSession("read");

  try {
    const scopedAdvisor = await prisma.advisor.findFirst({
      where: {
        id,
        ...getAdvisorScopeWhere(session, "advisor_core", "read"),
      },
      select: { id: true },
    });

    if (!scopedAdvisor) {
      return null;
    }

    const advisor = await prisma.advisor.findUnique({
      where: { id },
      include: advisorDetailInclude,
    });

    if (!advisor || advisor.deletedAt) {
      return null;
    }

    return can(session, "advisor_landing", "read")
      ? mapAdvisorToFormData(advisor)
      : mapAdvisorCoreToFormData(advisor);
  } catch (error) {
    if (error instanceof AdvisorRepoError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getAdvisorLandingV2ById(id: string) {
  const session = await requireAdvisorLandingSession("read");

  const scopedAdvisor = await prisma.advisor.findFirst({
    where: {
      id,
      ...getAdvisorScopeWhere(session, "advisor_landing", "read"),
    },
    include: advisorDetailInclude,
  });

  if (!scopedAdvisor || scopedAdvisor.deletedAt) {
    return null;
  }

  return mapAdvisorLandingToFormDataV2(scopedAdvisor);
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
  if (!canDeleteAdvisor(session)) {
    throw new AdvisorRepoError("Forbidden", 403);
  }

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

function normalizeWorkflowUserInput(
  user?: AdvisorWorkflowUserInput,
): AdvisorWorkflowUserInput | null {
  if (!user) return null;

  const email = normalizeEmail(user.email);
  if (!email) {
    throw new AdvisorRepoError("El email del usuario es obligatorio.", 400);
  }

  if (user.password.trim().length < 8) {
    throw new AdvisorRepoError(
      "La contraseña del usuario debe tener al menos 8 caracteres.",
      400,
    );
  }

  return {
    email,
    password: user.password,
    name: user.name?.trim() || null,
  };
}

export async function createAdvisor(
  data: AdvisorPayload,
  workflowUser?: AdvisorWorkflowUserInput,
): Promise<Advisor> {
  const session = await requireAdvisorEditorSession();
  if (!canCreateAdvisor(session)) {
    throw new AdvisorRepoError("Forbidden", 403);
  }
  const user = normalizeWorkflowUserInput(workflowUser);
  const inmobiliariaId =
    isAdmin(session)
      ? data.inmobiliariaId ?? null
      : session.inmobiliariaId ?? null;

  if (user && !isAdmin(session)) {
    throw new AdvisorRepoError(
      "Solo un admin puede crear el usuario del asesor en este flujo.",
      403,
    );
  }

  if (!isAdmin(session) && !inmobiliariaId) {
    throw new AdvisorRepoError("Missing inmobiliariaId in session", 403);
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const advisor = await tx.advisor.create({
        data: buildAdvisorCoreCreateData({
          fullName: data.fullName,
          slug: data.slug,
          headline: data.headline,
          heroBgUrl: data.heroBgUrl,
          ctaLabel: data.ctaLabel,
          ctaHref: data.ctaHref,
          inmobiliariaId,
        }),
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
          ...buildAdvisorLandingCreateData(data.landing),
        },
        select: { id: true },
      });

      await replaceAdvisorLandingCollections(tx, landing.id, data.landing);

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

      if (user) {
        await tx.user.create({
          data: {
            email: user.email,
            name: user.name ?? null,
            password: await hashPassword(user.password),
            role: Role.ASESOR,
            inmobiliariaId,
            advisorId: advisor.id,
          },
          select: { id: true },
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
  await updateAdvisorCore(id, {
    fullName: data.fullName,
    slug: data.slug,
    headline: data.headline,
    heroBgUrl: data.heroBgUrl,
    ctaLabel: data.ctaLabel,
    ctaHref: data.ctaHref,
    inmobiliariaId: data.inmobiliariaId ?? null,
  });

  return updateAdvisorLanding(id, data.landing);
}

export async function updateAdvisorCore(
  id: string,
  data: {
    fullName: string;
    slug: string;
    headline?: string | null;
    heroBgUrl?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    inmobiliariaId?: string | null;
  },
): Promise<Advisor> {
  const session = await requireAdvisorCoreSession("update");
  const scopedAdvisor = await prisma.advisor.findFirst({
    where: {
      id,
      ...getAdvisorScopeWhere(session, "advisor_core", "update"),
    },
    select: { id: true, inmobiliariaId: true },
  });

  if (!scopedAdvisor) {
    throw new AdvisorRepoError("Asesor no encontrado", 404);
  }

  const inmobiliariaId =
    isAdmin(session)
      ? data.inmobiliariaId ?? scopedAdvisor.inmobiliariaId ?? null
      : isInmobiliaria(session)
        ? session.inmobiliariaId ?? null
        : scopedAdvisor.inmobiliariaId ?? null;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const advisor = await tx.advisor.update({
        where: { id },
        data: buildAdvisorCoreUpdateData({
          fullName: data.fullName,
          slug: data.slug,
          headline: data.headline,
          heroBgUrl: data.heroBgUrl,
          ctaLabel: data.ctaLabel,
          ctaHref: data.ctaHref,
          inmobiliariaId,
        }),
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

      return advisor;
    });

    return updated;
  } catch (error) {
    normalizeRepoError(error);
  }
}

export async function updateAdvisorLanding(
  id: string,
  data: AdvisorPayload["landing"],
): Promise<Advisor> {
  const session = await requireAdvisorLandingSession("update");
  const scopedAdvisor = await prisma.advisor.findFirst({
    where: {
      id,
      ...getAdvisorScopeWhere(session, "advisor_landing", "update"),
    },
    select: { id: true, inmobiliariaId: true },
  });

  if (!scopedAdvisor) {
    throw new AdvisorRepoError("Asesor no encontrado", 404);
  }

  const inmobiliariaId = scopedAdvisor.inmobiliariaId ?? null;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const advisor = await tx.advisor.findUniqueOrThrow({
        where: { id },
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

      const landing = await tx.landingAdvisor.upsert({
        where: { advisorId: id },
        create: {
          advisorId: id,
          ...buildAdvisorLandingCreateData(data),
        },
        update: buildAdvisorLandingUpdateData(data),
        select: { id: true },
      });

      await replaceAdvisorLandingCollections(tx, landing.id, data);

      const featuredIds = await validateFeaturedProperties(
        tx,
        data.featuredPropertyIds,
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

export async function getPublicAdvisorBySlugV2(
  slug: string,
): Promise<PublicAdvisorLandingV2 | null> {
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

  return mapAdvisorToPublicLandingV2(advisor);
}
