import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import PaginationBar from "@/components/virtualoffice/PaginationBar";
import {
  Badge,
  EmptyState,
  FilterBar,
  PageHeader,
  StatCard,
} from "@/components/virtualoffice/Page";
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
import {
  paginateItems,
  resolvePagination,
} from "@/lib/virtualoffice/pagination";

export const dynamic = "force-dynamic";

type BlogPageProps = {
  searchParams: Promise<{ q?: string; page?: string; perPage?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const session = await requireSession();
  const params = await searchParams;

  let where;
  try {
    where = buildBlogListWhere(session, { q: params.q });
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
  const pagination = resolvePagination(
    {
      page: params.page,
      perPage: params.perPage,
    },
    items.length,
  );
  const paginatedItems = paginateItems(items, pagination);

  return (
    <div>
      <PageHeader
      title="Blog"
        description="Gestiona artículos públicos y su autoría por tenant."
        eyebrow="Creación y administración de contenido"
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="info">{session.role}</Badge>
            <Badge tone="default">{items.length} posts</Badge>
          </div>
        }
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Posts visibles"
          value={items.length}
          hint="Posts dentro del scope del usuario actual."
        />
        <StatCard
          label="Con asesor"
          value={items.filter((item) => item.advisor?.fullName).length}
          hint="Contenido atribuido a asesores."
        />
        <StatCard
          label="Con inmobiliaria"
          value={items.filter((item) => item.inmobiliaria?.name).length}
          hint="Posts ligados a una inmobiliaria concreta."
        />
        <StatCard
          label="Búsqueda"
          value={params.q?.trim() ? "Activa" : "General"}
          hint="Usa el filtro para localizar títulos, slugs o contenido."
        />
      </div>

      <FilterBar>
        <form className="flex flex-1 flex-col gap-3 lg:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Buscar por título, slug o contenido"
            className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Filtrar
          </button>
        </form>
        <Link
          href="/virtual-office/blog"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Limpiar
        </Link>
      </FilterBar>

      {items.length === 0 ? (
        <EmptyState
          title="Todavía no hay posts para esta vista"
          description="Crea el primer artículo o abre el filtro para revisar otro subconjunto del blog."
          action={
            canCreateBlogPost(session) ? (
              <Link
                href="/virtual-office/blog/new"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Crear primer post
              </Link>
            ) : null
          }
        />
      ) : (
        <TableShell>
          <Table>
            <thead>
              <tr>
                <Th>Post</Th>
                <Th>Autoría</Th>
                <Th>Tenant</Th>
                <Th>Actualizado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <Tr key={item.id}>
                  <Td>
                    <div className="space-y-1">
                      <div className="font-medium text-zinc-950">
                        {item.title}
                      </div>
                      <div className="text-sm text-zinc-500">/{item.slug}</div>
                    </div>
                  </Td>
                  <Td>
                    <Badge
                      tone={
                        item.authorRole === "ASESOR"
                          ? "success"
                          : item.authorRole === "INMOBILIARIA"
                            ? "warning"
                            : "info"
                      }
                    >
                      {item.authorRole}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="space-y-1 text-sm text-zinc-600">
                      <div>
                        <span className="font-medium text-zinc-800">
                          Inmobiliaria:
                        </span>{" "}
                        {item.inmobiliaria?.name ?? "-"}
                      </div>
                      <div>
                        <span className="font-medium text-zinc-800">
                          Asesor:
                        </span>{" "}
                        {item.advisor?.fullName ?? "-"}
                      </div>
                    </div>
                  </Td>
                  <Td>{new Date(item.updatedAt).toLocaleString()}</Td>
                  <Td>
                    <div className="flex flex-wrap items-center gap-2">
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
              ))}
            </tbody>
          </Table>
        </TableShell>
      )}

      <PaginationBar
        pathname="/virtual-office/blog"
        searchParams={{ q: params.q }}
        page={pagination.page}
        perPage={pagination.perPage}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
