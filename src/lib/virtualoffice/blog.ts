import "server-only";

import { Prisma, Role } from "@/generated/prisma";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  can,
  isAdmin,
  isAdvisor,
  isBloguero,
  isInmobiliaria,
} from "@/lib/auth/permissions";
import type { SessionPayload } from "@/lib/data/types";

export class BlogRepoError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "BlogRepoError";
    this.status = status;
  }
}

export const BlogOwnerTypeSchema = z.enum([
  "admin",
  "inmobiliaria",
  "advisor",
  "blogger",
]);

export const BlogUpsertSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().min(3),
  content: z.string().trim().min(20),
  coverImageUrl: z.string().trim().nullable().optional(),
  ownerType: BlogOwnerTypeSchema.optional(),
  ownerId: z.string().trim().nullable().optional(),
  authorRole: z.nativeEnum(Role).optional(),
  advisorId: z.string().trim().nullable().optional(),
  inmobiliariaId: z.string().trim().nullable().optional(),
});

export type BlogUpsertInput = z.output<typeof BlogUpsertSchema>;
export type BlogOwnerType = z.output<typeof BlogOwnerTypeSchema>;

export type BlogOwnership = {
  ownerType: BlogOwnerType;
  ownerId: string | null;
  authorRole: Role;
  advisorId: string | null;
  inmobiliariaId: string | null;
};

type ScopedBlogPost = {
  id: string;
  ownerType: BlogOwnerType;
  ownerId: string | null;
  authorRole: Role;
  advisorId: string | null;
  inmobiliariaId: string | null;
};

function hasBlogAccess(session: SessionPayload) {
  return can(session, "blogs", "read");
}

export function canCreateBlogPost(session: SessionPayload) {
  return can(session, "blogs", "create");
}

export function canDeleteBlogPost(session: SessionPayload) {
  return can(session, "blogs", "delete_soft");
}

export function canEditBlogPost(session: SessionPayload) {
  return can(session, "blogs", "update");
}

function ownerTypeFromRole(role: Role): BlogOwnerType {
  switch (role) {
    case Role.ADMIN:
      return "admin";
    case Role.INMOBILIARIA:
      return "inmobiliaria";
    case Role.ASESOR:
      return "advisor";
    case Role.BLOGUERO:
      return "blogger";
  }
}

export function ownerTypeToDbValue(ownerType: BlogOwnerType) {
  switch (ownerType) {
    case "admin":
      return "ADMIN" as const;
    case "inmobiliaria":
      return "INMOBILIARIA" as const;
    case "advisor":
      return "ADVISOR" as const;
    case "blogger":
      return "BLOGGER" as const;
  }
}

function ownerTypeFromDbValue(
  ownerType: "ADMIN" | "INMOBILIARIA" | "ADVISOR" | "BLOGGER" | null | undefined,
): BlogOwnerType | null {
  switch (ownerType) {
    case "ADMIN":
      return "admin";
    case "INMOBILIARIA":
      return "inmobiliaria";
    case "ADVISOR":
      return "advisor";
    case "BLOGGER":
      return "blogger";
    default:
      return null;
  }
}

export function deriveBlogOwnershipFromRecord(post: {
  ownerType?: "ADMIN" | "INMOBILIARIA" | "ADVISOR" | "BLOGGER" | null;
  ownerId?: string | null;
  authorRole: Role;
  advisorId: string | null;
  inmobiliariaId: string | null;
}): Pick<BlogOwnership, "ownerType" | "ownerId"> {
  const explicitOwnerType = ownerTypeFromDbValue(post.ownerType);
  if (explicitOwnerType) {
    return {
      ownerType: explicitOwnerType,
      ownerId: post.ownerId ?? null,
    };
  }

  const ownerType = ownerTypeFromRole(post.authorRole);
  const ownerId =
    ownerType === "advisor"
      ? post.advisorId
      : ownerType === "inmobiliaria"
        ? post.inmobiliariaId
        : null;

  return { ownerType, ownerId };
}

export function buildBlogListWhere(
  session: SessionPayload,
  query?: { q?: string },
): Prisma.BlogPostWhereInput {
  if (!hasBlogAccess(session)) {
    throw new BlogRepoError("Forbidden", 403);
  }

  const where: Prisma.BlogPostWhereInput = { deletedAt: null };

  if (isBloguero(session)) {
    where.OR = [
      { ownerType: "BLOGGER", ownerId: session.id },
      { ownerType: null, authorRole: Role.BLOGUERO },
    ];
  } else if (isInmobiliaria(session)) {
    where.OR = [
      {
        ownerType: "INMOBILIARIA",
        ownerId: session.inmobiliariaId ?? "__none__",
      },
      {
        ownerType: null,
        authorRole: Role.INMOBILIARIA,
        inmobiliariaId: session.inmobiliariaId ?? "__none__",
      },
    ];
  } else if (isAdvisor(session)) {
    where.OR = [
      {
        ownerType: "ADVISOR",
        ownerId: session.advisorId ?? "__none__",
      },
      {
        ownerType: null,
        authorRole: Role.ASESOR,
        advisorId: session.advisorId ?? "__none__",
      },
    ];
  } else if (!isAdmin(session)) {
    throw new BlogRepoError("Forbidden", 403);
  }

  const q = query?.q?.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
      { slug: { contains: q, mode: Prisma.QueryMode.insensitive } },
      { content: { contains: q, mode: Prisma.QueryMode.insensitive } },
    ];
  }

  return where;
}

async function getInmobiliariaIfValid(inmobiliariaId: string) {
  const inmobiliaria = await prisma.inmobiliaria.findFirst({
    where: { id: inmobiliariaId, deletedAt: null },
    select: { id: true },
  });

  if (!inmobiliaria) {
    throw new BlogRepoError("La inmobiliaria seleccionada no existe.", 400);
  }

  return inmobiliaria;
}

async function getAdvisorIfValid(advisorId: string) {
  const advisor = await prisma.advisor.findFirst({
    where: { id: advisorId, deletedAt: null },
    select: { id: true, inmobiliariaId: true },
  });

  if (!advisor) {
    throw new BlogRepoError("El asesor seleccionado no existe.", 400);
  }

  return advisor;
}

export async function resolveBlogOwnership(
  session: SessionPayload,
  data: BlogUpsertInput,
  current?: ScopedBlogPost,
): Promise<BlogOwnership> {
  if (!can(session, "blogs", current ? "update" : "create")) {
    throw new BlogRepoError("Forbidden", 403);
  }

  if (isBloguero(session)) {
    return {
      ownerType: "blogger",
      ownerId: session.id,
      authorRole: Role.BLOGUERO,
      advisorId: null,
      inmobiliariaId: null,
    };
  }

  if (isInmobiliaria(session)) {
    if (!session.inmobiliariaId) {
      throw new BlogRepoError("Missing inmobiliaria scope", 403);
    }

    return {
      ownerType: "inmobiliaria",
      ownerId: session.inmobiliariaId,
      authorRole: Role.INMOBILIARIA,
      advisorId: null,
      inmobiliariaId: session.inmobiliariaId,
    };
  }

  if (isAdvisor(session)) {
    if (!session.advisorId) {
      throw new BlogRepoError("Missing advisor scope", 403);
    }

    const advisor = await getAdvisorIfValid(session.advisorId);

    return {
      ownerType: "advisor",
      ownerId: advisor.id,
      authorRole: Role.ASESOR,
      advisorId: advisor.id,
      inmobiliariaId: advisor.inmobiliariaId ?? current?.inmobiliariaId ?? null,
    };
  }

  const ownerType =
    data.ownerType ??
    (data.authorRole ? ownerTypeFromRole(data.authorRole) : undefined) ??
    current?.ownerType ??
    "blogger";

  if (ownerType === "admin") {
    return {
      ownerType,
      ownerId: data.ownerId ?? current?.ownerId ?? session.id,
      authorRole: Role.ADMIN,
      advisorId: null,
      inmobiliariaId: null,
    };
  }

  if (ownerType === "blogger") {
    return {
      ownerType,
      ownerId: data.ownerId ?? current?.ownerId ?? session.id,
      authorRole: Role.BLOGUERO,
      advisorId: null,
      inmobiliariaId: null,
    };
  }

  if (ownerType === "inmobiliaria") {
    const selectedInmobiliariaId =
      data.ownerId ?? data.inmobiliariaId ?? current?.ownerId ?? current?.inmobiliariaId;

    if (!selectedInmobiliariaId) {
      throw new BlogRepoError(
        "Los posts de inmobiliaria deben tener una inmobiliaria asignada.",
        400,
      );
    }

    const inmobiliaria = await getInmobiliariaIfValid(selectedInmobiliariaId);

    return {
      ownerType,
      ownerId: inmobiliaria.id,
      authorRole: Role.INMOBILIARIA,
      advisorId: null,
      inmobiliariaId: inmobiliaria.id,
    };
  }

  const selectedAdvisorId =
    data.ownerId ?? data.advisorId ?? current?.ownerId ?? current?.advisorId;

  if (!selectedAdvisorId) {
    throw new BlogRepoError(
      "Los posts de asesor deben tener un asesor asignado.",
      400,
    );
  }

  const advisor = await getAdvisorIfValid(selectedAdvisorId);

  return {
    ownerType: "advisor",
    ownerId: advisor.id,
    authorRole: Role.ASESOR,
    advisorId: advisor.id,
    inmobiliariaId: advisor.inmobiliariaId ?? null,
  };
}

export async function getBlogFormOptions(session: SessionPayload) {
  if (!hasBlogAccess(session)) {
    throw new BlogRepoError("Forbidden", 403);
  }

  const [inmobiliarias, advisors] = await Promise.all([
    isAdmin(session)
      ? prisma.inmobiliaria.findMany({
          where: { deletedAt: null },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
    prisma.advisor.findMany({
      where: {
        deletedAt: null,
        ...(isAdmin(session)
          ? {}
          : isInmobiliaria(session)
            ? { inmobiliariaId: session.inmobiliariaId ?? "__none__" }
            : isAdvisor(session)
              ? { id: session.advisorId ?? "__none__" }
              : {}),
      },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, inmobiliariaId: true },
    }),
  ]);

  return { inmobiliarias, advisors };
}

export async function assertBlogPostScope(
  session: SessionPayload,
  postId: string,
  action: "read" | "update" | "delete_soft" = "read",
): Promise<ScopedBlogPost> {
  if (!can(session, "blogs", action)) {
    throw new BlogRepoError("Forbidden", 403);
  }

  const post = await prisma.blogPost.findFirst({
    where: { id: postId, deletedAt: null },
    select: {
      id: true,
      ownerType: true,
      ownerId: true,
      authorRole: true,
      advisorId: true,
      inmobiliariaId: true,
    },
  });

  if (!post) {
    throw new BlogRepoError("Not found", 404);
  }

  const ownership = deriveBlogOwnershipFromRecord(post);
  const scopedPost: ScopedBlogPost = { ...post, ...ownership };

  if (isAdmin(session)) return scopedPost;

  if (isBloguero(session)) {
    if (ownership.ownerType !== "blogger") {
      throw new BlogRepoError("Forbidden", 403);
    }
    if (ownership.ownerId && ownership.ownerId !== session.id) {
      throw new BlogRepoError("Forbidden", 403);
    }
    return scopedPost;
  }

  if (isInmobiliaria(session)) {
    if (
      !session.inmobiliariaId ||
      ownership.ownerType !== "inmobiliaria" ||
      ownership.ownerId !== session.inmobiliariaId
    ) {
      throw new BlogRepoError("Forbidden", 403);
    }
    return scopedPost;
  }

  if (isAdvisor(session)) {
    if (
      !session.advisorId ||
      ownership.ownerType !== "advisor" ||
      ownership.ownerId !== session.advisorId
    ) {
      throw new BlogRepoError("Forbidden", 403);
    }
    return scopedPost;
  }

  throw new BlogRepoError("Forbidden", 403);
}

export async function listPublicBlogPosts() {
  const items = await prisma.blogPost.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      coverImageUrl: true,
      ownerType: true,
      ownerId: true,
      authorRole: true,
      advisorId: true,
      inmobiliariaId: true,
      updatedAt: true,
      createdAt: true,
      advisor: { select: { fullName: true } },
      inmobiliaria: { select: { name: true } },
    },
  });

  return items.map((item) => ({
    ...item,
    ...deriveBlogOwnershipFromRecord(item),
    excerpt:
      item.content
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180)
        .trim() + (item.content.trim().length > 180 ? "..." : ""),
  }));
}

export async function getPublicBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findFirst({
    where: { slug, deletedAt: null },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      coverImageUrl: true,
      ownerType: true,
      ownerId: true,
      authorRole: true,
      updatedAt: true,
      createdAt: true,
      advisor: { select: { fullName: true } },
      inmobiliaria: { select: { name: true } },
      advisorId: true,
      inmobiliariaId: true,
    },
  });

  if (!post) return null;

  return {
    ...post,
    ...deriveBlogOwnershipFromRecord(post),
  };
}
