import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import BlogPostForm from "@/components/virtualoffice/blog/BlogPostForm";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import {
  assertBlogPostScope,
  BlogRepoError,
  canEditBlogPost,
  getBlogFormOptions,
} from "@/lib/virtualoffice/blog";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: PageProps) {
  const session = await requireSession();

  if (!canEditBlogPost(session)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Editar post</h1>
        <p className="mt-2 text-secondary">
          No tienes permisos para editar posts.
        </p>
      </div>
    );
  }

  const { id } = await params;

  try {
    await assertBlogPostScope(session, id);
  } catch (error) {
    if (error instanceof BlogRepoError && error.status === 404) {
      return notFound();
    }

    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Editar post</h1>
        <p className="mt-2 text-secondary">
          No tienes permisos para editar este post.
        </p>
      </div>
    );
  }

  const [post, options] = await Promise.all([
    prisma.blogPost.findFirst({
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
      },
    }),
    getBlogFormOptions(session),
  ]);

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Editar post"
        description="Actualiza contenido, asignación y publicación del artículo."
        eyebrow="Edicion de contenido"
        actions={
          <Link
            href="/virtual-office/blog"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Volver al listado
          </Link>
        }
      />

      <Card>
        <CardBody>
          <BlogPostForm
            mode="edit"
            postId={id}
            canManageAssignments={session.role === "ADMIN"}
            inmobiliarias={options.inmobiliarias}
            advisors={options.advisors}
            initialData={{
              title: post.title,
              slug: post.slug,
              content: post.content,
              coverImageUrl: post.coverImageUrl ?? "",
              authorRole: post.authorRole,
              advisorId: post.advisorId ?? "",
              inmobiliariaId: post.inmobiliariaId ?? "",
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
