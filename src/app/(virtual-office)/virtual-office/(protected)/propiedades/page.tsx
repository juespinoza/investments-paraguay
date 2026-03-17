import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import DeletePropertyButton from "@/components/virtualoffice/properties/DeletePropertyButton";
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
  buildPropertyListWhere,
  canCreateProperty,
  canDeleteProperty,
} from "@/lib/virtualoffice/properties";
import {
  paginateItems,
  resolvePagination,
} from "@/lib/virtualoffice/pagination";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; perPage?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await requireSession();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";

  let where;
  try {
    where = buildPropertyListWhere(session, { q });
  } catch {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Propiedades</h1>
        <p className="mt-2 text-secondary">
          No tienes permisos para ver esta sección.
        </p>
      </div>
    );
  }

  const items = await prisma.property.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      city: true,
      priceUsd: true,
      roiAnnualPct: true,
      appreciationAnnualPct: true,
      isFeatured: true,
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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Portafolio"
        title="Propiedades"
        description="Gestiona inmuebles, rentabilidad, medios y asignaciones sin salir del panel."
        actions={
          canCreateProperty(session) ? (
            <Link
              href="/virtual-office/propiedades/new"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              + Nueva propiedad
            </Link>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total"
          value={items.length}
          hint="Propiedades visibles con tu alcance actual."
        />
        <StatCard
          label="Destacadas"
          value={items.filter((item) => item.isFeatured).length}
          hint="Inmuebles marcados para visibilidad especial."
        />
        <StatCard
          label="Con asesor"
          value={items.filter((item) => item.advisor).length}
          hint="Propiedades ya vinculadas a un responsable."
        />
      </div>

      <FilterBar>
        <form className="flex w-full flex-col gap-3 md:flex-row">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por título, slug o descripción"
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
          title="No hay propiedades para mostrar"
          description={
            q
              ? "No encontramos propiedades con ese criterio."
              : "Cuando cargues propiedades aquí podrás ver rápidamente su asignación, rentabilidad y estado."
          }
          action={
            canCreateProperty(session) ? (
              <Link
                href="/virtual-office/propiedades/new"
                className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Crear propiedad
              </Link>
            ) : undefined
          }
        />
      ) : (
        <TableShell>
          <Table>
            <thead>
              <tr>
                <Th>Propiedad</Th>
                <Th>Asignación</Th>
                <Th>Inversión</Th>
                <Th>Rentabilidad</Th>
                <Th>Actualizado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>

            <tbody>
              {paginatedItems.map((property) => (
                <Tr key={property.id}>
                  <Td className="min-w-[260px]">
                    <div className="font-medium text-zinc-950">
                      {property.title}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500">
                      /{property.slug}
                    </div>
                    <div className="mt-2 text-sm text-zinc-600">
                      {property.city ?? "Sin ciudad"}
                    </div>
                  </Td>
                  <Td>
                    <div className="space-y-2">
                      {property.inmobiliaria?.name ? (
                        <Badge tone="info">{property.inmobiliaria.name}</Badge>
                      ) : (
                        <span className="text-sm text-zinc-500">Sin tenant</span>
                      )}
                      <div className="text-sm text-zinc-600">
                        {property.advisor?.fullName ?? "Sin asesor"}
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="text-sm font-medium text-zinc-950">
                      {property.priceUsd ? `USD ${property.priceUsd}` : "-"}
                    </div>
                    {property.isFeatured ? (
                      <div className="mt-2">
                        <Badge tone="warning">Destacada</Badge>
                      </div>
                    ) : null}
                  </Td>
                  <Td>
                    <div className="space-y-1 text-sm text-zinc-600">
                      <div>
                        ROI:{" "}
                        {property.roiAnnualPct !== null
                          ? `${String(property.roiAnnualPct)}%`
                          : "-"}
                      </div>
                      <div>
                        Plusvalía:{" "}
                        {property.appreciationAnnualPct !== null
                          ? `${String(property.appreciationAnnualPct)}%`
                          : "-"}
                      </div>
                    </div>
                  </Td>
                  <Td>{new Date(property.updatedAt).toLocaleString()}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/virtual-office/propiedades/${property.id}/edit`}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                      >
                        Editar
                      </Link>
                      {canDeleteProperty(session) ? (
                        <DeletePropertyButton id={property.id} />
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
        pathname="/virtual-office/propiedades"
        searchParams={{ q: q || undefined }}
        page={pagination.page}
        perPage={pagination.perPage}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
