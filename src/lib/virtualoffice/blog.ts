import "server-only";

import { Prisma, Role } from "@/generated/prisma";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  canAccessBlog,
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

export const BlogUpsertSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().min(3),
  content: z.string().trim().min(20),
  coverImageUrl: z.string().trim().nullable().optional(),
  authorRole: z.nativeEnum(Role).optional(),
  advisorId: z.string().trim().nullable().optional(),
  inmobiliariaId: z.string().trim().nullable().optional(),
});

export type BlogUpsertInput = z.output<typeof BlogUpsertSchema>;

type ScopedBlogPost = {
  id: string;
  authorRole: Role;
  advisorId: string | null;
  inmobiliariaId: string | null;
};

function hasBlogAccess(session: SessionPayload) {
  return canAccessBlog(session);
}

export function canCreateBlogPost(session: SessionPayload) {
  return hasBlogAccess(session);
}

export function canDeleteBlogPost(session: SessionPayload) {
  return hasBlogAccess(session);
}

export function canEditBlogPost(session: SessionPayload) {
  return hasBlogAccess(session);
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
    where.authorRole = Role.BLOGUERO;
  } else if (isInmobiliaria(session)) {
    where.inmobiliariaId = session.inmobiliariaId ?? "__none__";
  } else if (isAdvisor(session)) {
    where.advisorId = session.advisorId ?? "__none__";
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
): Promise<ScopedBlogPost> {
  if (!hasBlogAccess(session)) {
    throw new BlogRepoError("Forbidden", 403);
  }

  const post = await prisma.blogPost.findFirst({
    where: { id: postId, deletedAt: null },
    select: {
      id: true,
      authorRole: true,
      advisorId: true,
      inmobiliariaId: true,
    },
  });

  if (!post) {
    throw new BlogRepoError("Not found", 404);
  }

  if (isAdmin(session)) return post;

  if (isBloguero(session)) {
    if (post.authorRole !== Role.BLOGUERO) {
      throw new BlogRepoError("Forbidden", 403);
    }
    return post;
  }

  if (isInmobiliaria(session)) {
    if (
      !session.inmobiliariaId ||
      post.inmobiliariaId !== session.inmobiliariaId
    ) {
      throw new BlogRepoError("Forbidden", 403);
    }
    return post;
  }

  if (isAdvisor(session)) {
    if (!session.advisorId || post.advisorId !== session.advisorId) {
      throw new BlogRepoError("Forbidden", 403);
    }
    return post;
  }

  throw new BlogRepoError("Forbidden", 403);
}

export async function resolveBlogAssignments(
  session: SessionPayload,
  data: BlogUpsertInput,
  current?: ScopedBlogPost,
) {
  if (isBloguero(session)) {
    return {
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
      authorRole: Role.ASESOR,
      advisorId: advisor.id,
      inmobiliariaId:
        advisor.inmobiliariaId ?? current?.inmobiliariaId ?? session.inmobiliariaId ?? null,
    };
  }

  const authorRole = data.authorRole ?? current?.authorRole ?? Role.BLOGUERO;

  if (authorRole === Role.ADMIN || authorRole === Role.BLOGUERO) {
    return {
      authorRole,
      advisorId: null,
      inmobiliariaId: null,
    };
  }

  if (authorRole === Role.INMOBILIARIA) {
    if (!data.inmobiliariaId) {
      throw new BlogRepoError(
        "Los posts de inmobiliaria deben tener una inmobiliaria asignada.",
        400,
      );
    }

    const inmobiliaria = await prisma.inmobiliaria.findFirst({
      where: { id: data.inmobiliariaId, deletedAt: null },
      select: { id: true },
    });

    if (!inmobiliaria) {
      throw new BlogRepoError("La inmobiliaria seleccionada no existe.", 400);
    }

    return {
      authorRole,
      advisorId: null,
      inmobiliariaId: inmobiliaria.id,
    };
  }

  if (!data.advisorId) {
    throw new BlogRepoError(
      "Los posts de asesor deben tener un asesor asignado.",
      400,
    );
  }

  const advisor = await getAdvisorIfValid(data.advisorId);

  return {
    authorRole: Role.ASESOR,
    advisorId: advisor.id,
    inmobiliariaId: advisor.inmobiliariaId ?? null,
  };
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
      authorRole: true,
      updatedAt: true,
      createdAt: true,
      advisor: { select: { fullName: true } },
      inmobiliaria: { select: { name: true } },
    },
  });

  return items.map((item) => ({
    ...item,
    excerpt:
      item.content
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180)
        .trim() + (item.content.trim().length > 180 ? "..." : ""),
  }));
}

export async function getPublicBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, deletedAt: null },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      coverImageUrl: true,
      authorRole: true,
      updatedAt: true,
      createdAt: true,
      advisor: { select: { fullName: true } },
      inmobiliaria: { select: { name: true } },
    },
  });
}
