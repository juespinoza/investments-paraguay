import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import { PageHeader } from "@/components/virtualoffice/Page";
import {
  Table,
  TableShell,
  Td,
  Th,
  Tr,
} from "@/components/virtualoffice/Table";
import DeleteBlogPostButton from "@/components/virtualoffice/blog/DeleteBlogPostButton";
import {
  buildBlogListWhere,
  canCreateBlogPost,
  canDeleteBlogPost,
} from "@/lib/virtualoffice/blog";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const session = await requireSession();

  let where;
  try {
    where = buildBlogListWhere(session);
  } catch {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <p className="mt-2 text-secondary">
          No tienes permisos para ver esta sección.
        </p>
      </div>
    );
  }

  const items = await prisma.blogPost.findMany({
    where,
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

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Gestiona artículos públicos y su autoría por tenant."
        actions={
          canCreateBlogPost(session) ? (
            <Link
              href="/virtual-office/blog/new"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              + Nuevo post
            </Link>
          ) : null
        }
      />

      <TableShell>
        <Table>
          <thead>
            <tr>
              <Th>Título</Th>
              <Th>Slug</Th>
              <Th>Autor</Th>
              <Th>Inmobiliaria</Th>
              <Th>Asesor</Th>
              <Th>Actualizado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-sm text-zinc-600"
                  colSpan={7}
                >
                  No hay posts todavía.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <Tr key={item.id}>
                  <Td className="font-medium">{item.title}</Td>
                  <Td>{item.slug}</Td>
                  <Td>{item.authorRole}</Td>
                  <Td>{item.inmobiliaria?.name ?? "-"}</Td>
                  <Td>{item.advisor?.fullName ?? "-"}</Td>
                  <Td>{new Date(item.updatedAt).toLocaleString()}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/virtual-office/blog/${item.id}/edit`}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                      >
                        Editar
                      </Link>
                      {canDeleteBlogPost(session) ? (
                        <DeleteBlogPostButton id={item.id} />
                      ) : null}
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </TableShell>
    </div>
  );
}
