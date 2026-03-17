import Link from "next/link";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import BlogPostForm from "@/components/virtualoffice/blog/BlogPostForm";
import { requireSession } from "@/lib/auth/require-session";
import {
  canCreateBlogPost,
  getBlogFormOptions,
} from "@/lib/virtualoffice/blog";

export default async function NewBlogPostPage() {
  const session = await requireSession();

  if (!canCreateBlogPost(session)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Nuevo post</h1>
        <p className="mt-2 text-secondary">
          No tienes permisos para crear posts.
        </p>
      </div>
    );
  }

  const options = await getBlogFormOptions(session);

  return (
    <div>
      <PageHeader
        title="Nuevo post"
        description="Crea un nuevo artículo del blog público."
        eyebrow="Creación de contenido"
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
            mode="create"
            canManageAssignments={session.role === "ADMIN"}
            inmobiliarias={options.inmobiliarias}
            advisors={options.advisors}
            initialData={{
              authorRole: session.role === "ADMIN" ? undefined : session.role,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
