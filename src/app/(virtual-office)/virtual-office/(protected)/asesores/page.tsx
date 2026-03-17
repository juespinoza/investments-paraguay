import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import DeleteButton from "@/components/virtualoffice/DeleteButton";
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
import {
  paginateItems,
  resolvePagination,
} from "@/lib/virtualoffice/pagination";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; perPage?: string }>;
};

export default async function AdvisorsPage({ searchParams }: PageProps) {
  const session = await requireSession();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";

  const where: {
    deletedAt: null;
    inmobiliariaId?: string;
    id?: string;
    OR?: Array<{
      fullName?: { contains: string; mode: "insensitive" };
      slug?: { contains: string; mode: "insensitive" };
      headline?: { contains: string; mode: "insensitive" };
    }>;
  } = { deletedAt: null };

  if (session.role === "INMOBILIARIA") {
    where.inmobiliariaId = session.inmobiliariaId ?? "__none__";
  } else if (session.role === "ASESOR") {
    where.id = session.advisorId ?? "__none__";
  } else if (session.role !== "ADMIN") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Asesores</h1>
        <p className="mt-2 text-secondary">
          No tienes permisos para ver esta sección.
        </p>
      </div>
    );
  }

  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { headline: { contains: q, mode: "insensitive" } },
    ];
  }

  const items = await prisma.advisor.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      fullName: true,
      slug: true,
      headline: true,
      updatedAt: true,
      inmobiliaria: { select: { name: true } },
      _count: {
        select: {
          properties: { where: { deletedAt: null } },
          blogs: { where: { deletedAt: null } },
        },
      },
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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gestión de perfiles"
        title="Asesores"
        description="Gestiona los perfiles públicos, su tenant y el contenido asociado que aparece en el sitio."
        actions={
          session.role !== "ASESOR" ? (
            <Link
              href="/virtual-office/asesores/new"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              + Nuevo asesor
            </Link>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total"
          value={items.length}
          hint="Asesores visibles con tu rol actual."
        />
        <StatCard
          label="Con propiedades"
          value={items.filter((item) => item._count.properties > 0).length}
          hint="Perfiles ya conectados al portafolio."
        />
        <StatCard
          label="Con blog"
          value={items.filter((item) => item._count.blogs > 0).length}
          hint="Perfiles con contenido editorial asociado."
        />
      </div>

      <FilterBar>
        <form className="flex w-full flex-col gap-3 md:flex-row">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre, slug o headline"
            className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Buscar
          </button>
        </form>
        {q ? (
          <div className="text-sm text-zinc-500">
            {items.length} resultado{items.length === 1 ? "" : "s"} para &quot;{q}&quot;
          </div>
        ) : null}
      </FilterBar>

      {items.length === 0 ? (
        <EmptyState
          title="No hay asesores en este alcance"
          description={
            q
              ? "No encontramos asesores con ese criterio de búsqueda."
              : "Cuando cargues asesores aparecerán aquí con su tenant, contenido y accesos de edición."
          }
          action={
            session.role !== "ASESOR" ? (
              <Link
                href="/virtual-office/asesores/new"
                className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Crear asesor
              </Link>
            ) : undefined
          }
        />
      ) : (
        <TableShell>
          <Table>
            <thead>
              <tr>
                <Th>Asesor</Th>
                <Th>Tenant</Th>
                <Th>Actividad</Th>
                <Th>Actualizado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>

            <tbody>
              {paginatedItems.map((advisor) => (
                <Tr key={advisor.id}>
                  <Td className="min-w-[260px]">
                    <div className="font-medium text-zinc-950">
                      {advisor.fullName}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500">
                      /{advisor.slug}
                    </div>
                    {advisor.headline ? (
                      <div className="mt-2 line-clamp-2 max-w-md text-sm text-zinc-600">
                        {advisor.headline}
                      </div>
                    ) : null}
                  </Td>
                  <Td>
                    {advisor.inmobiliaria?.name ? (
                      <Badge tone="info">{advisor.inmobiliaria.name}</Badge>
                    ) : (
                      <span className="text-sm text-zinc-500">Sin asignar</span>
                    )}
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="default">
                        {advisor._count.properties} propiedades
                      </Badge>
                      <Badge tone="warning">{advisor._count.blogs} posts</Badge>
                    </div>
                  </Td>
                  <Td>{new Date(advisor.updatedAt).toLocaleString()}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/virtual-office/asesores/${advisor.id}/edit`}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                      >
                        Editar
                      </Link>
                      <DeleteButton id={advisor.id} />
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableShell>
      )}

      <PaginationBar
        pathname="/virtual-office/asesores"
        searchParams={{ q: q || undefined }}
        page={pagination.page}
        perPage={pagination.perPage}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
