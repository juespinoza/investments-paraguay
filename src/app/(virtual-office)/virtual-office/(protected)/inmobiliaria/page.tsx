import Link from "next/link";
import PaginationBar from "@/components/virtualoffice/PaginationBar";
import DeleteInmobiliariaButton from "@/components/virtualoffice/inmobiliarias/DeleteInmobiliariaButton";
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
  listInmobiliarias,
  requireInmobiliariaRoles,
} from "@/lib/virtualoffice/inmobiliarias";
import {
  paginateItems,
  resolvePagination,
} from "@/lib/virtualoffice/pagination";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; perPage?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await requireInmobiliariaRoles();
  const params = await searchParams;
  const q = params.q?.trim().toLowerCase() ?? "";
  const allItems = await listInmobiliarias();
  const items = q
    ? allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q),
      )
    : allItems;
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
        eyebrow="Tenant management"
        title="Inmobiliarias"
        description="Gestiona la identidad del tenant, sus relaciones activas y el volumen operativo asociado."
        actions={
          session.role === "ADMIN" ? (
            <Link
              href="/virtual-office/inmobiliaria/new"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              + Nueva inmobiliaria
            </Link>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Total"
          value={items.length}
          hint="Tenants visibles desde tu rol."
        />
        <StatCard
          label="Asesores"
          value={items.reduce((sum, item) => sum + item._count.advisors, 0)}
          hint="Perfiles asociados al conjunto visible."
        />
        <StatCard
          label="Propiedades"
          value={items.reduce((sum, item) => sum + item._count.properties, 0)}
          hint="Inventario total dentro del alcance."
        />
        <StatCard
          label="Posts"
          value={items.reduce((sum, item) => sum + item._count.blogs, 0)}
          hint="Contenido editorial ligado al tenant."
        />
      </div>

      <FilterBar>
        <form className="flex w-full flex-col gap-3 md:flex-row">
          <input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Buscar por nombre o slug"
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
            {items.length} resultado{items.length === 1 ? "" : "s"} para &quot;{params.q}&quot;
          </div>
        ) : null}
      </FilterBar>

      {items.length === 0 ? (
        <EmptyState
          title="No hay inmobiliarias en esta vista"
          description={
            q
              ? "No encontramos inmobiliarias con ese criterio."
              : "Aquí aparecerán los tenants con su estructura y relaciones activas."
          }
          action={
            session.role === "ADMIN" ? (
              <Link
                href="/virtual-office/inmobiliaria/new"
                className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Crear inmobiliaria
              </Link>
            ) : undefined
          }
        />
      ) : (
        <TableShell>
          <Table>
            <thead>
              <tr>
                <Th>Inmobiliaria</Th>
                <Th>Actividad</Th>
                <Th>Estado</Th>
                <Th>Actualizado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <Tr key={item.id}>
                  <Td className="min-w-[260px]">
                    <div className="font-medium text-zinc-950">{item.name}</div>
                    <div className="mt-1 text-sm text-zinc-500">/{item.slug}</div>
                    {item.description ? (
                      <div className="mt-2 line-clamp-2 max-w-md text-sm text-zinc-600">
                        {item.description}
                      </div>
                    ) : null}
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="info">{item._count.advisors} asesores</Badge>
                      <Badge tone="default">
                        {item._count.properties} propiedades
                      </Badge>
                      <Badge tone="warning">{item._count.blogs} posts</Badge>
                    </div>
                  </Td>
                  <Td>
                    <Badge tone="success">Activa</Badge>
                  </Td>
                  <Td>{new Date(item.updatedAt).toLocaleString()}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/virtual-office/inmobiliaria/${item.id}/edit`}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                      >
                        Editar
                      </Link>
                      {session.role === "ADMIN" ? (
                        <DeleteInmobiliariaButton id={item.id} />
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
        pathname="/virtual-office/inmobiliaria"
        searchParams={{ q: params.q }}
        page={pagination.page}
        perPage={pagination.perPage}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
