import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import {
  assertBlogPostScope,
  BlogRepoError,
  BlogUpsertSchema,
  resolveBlogAssignments,
} from "@/lib/virtualoffice/blog";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  try {
    const session = await requireSession();
    await assertBlogPostScope(session, id);

    const item = await prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        coverImageUrl: true,
        authorRole: true,
        advisorId: true,
        inmobiliariaId: true,
        updatedAt: true,
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof BlogRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Get failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
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
    const current = await assertBlogPostScope(session, id);
    const assignments = await resolveBlogAssignments(session, parsed.data, current);

    await prisma.blogPost.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        coverImageUrl: parsed.data.coverImageUrl ?? null,
        authorRole: assignments.authorRole,
        advisorId: assignments.advisorId,
        inmobiliariaId: assignments.inmobiliariaId,
      },
    });

    return NextResponse.json({ ok: true });
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

    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;

  try {
    const session = await requireSession();
    await assertBlogPostScope(session, id);

    await prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof BlogRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
