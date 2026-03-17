import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import {
  BlogRepoError,
  BlogUpsertSchema,
  buildBlogListWhere,
  resolveBlogAssignments,
} from "@/lib/virtualoffice/blog";

export async function GET(req: Request) {
  try {
    const session = await requireSession();
    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? undefined;

    const items = await prisma.blogPost.findMany({
      where: buildBlogListWhere(session, { q }),
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        authorRole: true,
        updatedAt: true,
        advisor: { select: { fullName: true } },
        inmobiliaria: { select: { name: true } },
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof BlogRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "List failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BlogUpsertSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const session = await requireSession();
    const assignments = await resolveBlogAssignments(session, parsed.data);

    const created = await prisma.blogPost.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        coverImageUrl: parsed.data.coverImageUrl ?? null,
        authorRole: assignments.authorRole,
        advisorId: assignments.advisorId,
        inmobiliariaId: assignments.inmobiliariaId,
      },
      select: { id: true },
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    if (error instanceof BlogRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "El slug ya existe." }, { status: 409 });
    }

    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
