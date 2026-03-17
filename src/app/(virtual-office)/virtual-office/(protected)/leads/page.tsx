import {
  Badge,
  EmptyState,
  FilterBar,
  PageHeader,
  StatCard,
} from "@/components/virtualoffice/Page";
import PaginationBar from "@/components/virtualoffice/PaginationBar";
import { listLeads } from "@/lib/leads/repo";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableShell,
  Td,
  Th,
  Tr,
} from "@/components/virtualoffice/Table";
import LeadStatusSelect from "@/components/virtualoffice/leads/LeadStatusSelect";
import { requireVirtualOfficeRoles } from "@/lib/auth/virtual-office";
import {
  paginateItems,
  resolvePagination,
} from "@/lib/virtualoffice/pagination";

export const dynamic = "force-dynamic";

const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CLOSED",
  "LOST",
] as const;

type LeadsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
    perPage?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const access = await requireVirtualOfficeRoles([
    "ADMIN",
    "INMOBILIARIA",
    "ASESOR",
  ]);
  const params = await searchParams;

  if (!access.allowed) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <p className="mt-2 text-secondary">
          No tienes permisos para ver esta sección.
        </p>
      </div>
    );
  }

  const session = access.session;
  const statusFilter =
    LEAD_STATUSES.find((status) => status === params.status) ?? undefined;

  let advisorSlugs: string[] | undefined;
  if (session.role !== "ADMIN") {
    const advisors = await prisma.advisor.findMany({
      where: {
        deletedAt: null,
        ...(session.role === "ASESOR"
          ? { id: session.advisorId ?? "__none__" }
          : { inmobiliariaId: session.inmobiliariaId ?? "__none__" }),
      },
      select: { slug: true },
    });
    advisorSlugs = advisors.map((advisor) => advisor.slug);
  }

  const leads = await listLeads({
    advisorSlugs,
    status: statusFilter,
    take: 300,
  });
  const q = params.q?.trim().toLowerCase() ?? "";
  const filteredLeads = leads.filter((lead) =>
    !q
      ? true
      : [
          lead.full_name,
          lead.email,
          lead.whatsapp,
          lead.advisor_slug,
          lead.source_page,
          lead.property_slug,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(q)),
  );
  const newCount = leads.filter((lead) => lead.status === "NEW").length;
  const qualifiedCount = leads.filter(
    (lead) => lead.status === "QUALIFIED",
  ).length;
  const closedCount = leads.filter((lead) => lead.status === "CLOSED").length;
  const pagination = resolvePagination(
    {
      page: params.page,
      perPage: params.perPage,
    },
    filteredLeads.length,
  );
  const paginatedLeads = paginateItems(filteredLeads, pagination);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Contactos recibidos desde páginas públicas."
        eyebrow="Administración de leads comerciales"
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="info">{session.role}</Badge>
            {statusFilter ? <Badge tone="warning">{statusFilter}</Badge> : null}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="En vista"
          value={filteredLeads.length}
          hint="Leads resultantes del filtro actual."
        />
        <StatCard
          label="Nuevos"
          value={newCount}
          hint="Requieren atención comercial temprana."
        />
        <StatCard
          label="Calificados"
          value={qualifiedCount}
          hint="Ya tienen intención o encaje suficiente."
        />
        <StatCard
          label="Cerrados"
          value={closedCount}
          hint="Oportunidades ya concretadas."
        />
      </div>

      <FilterBar>
        <form className="flex flex-1 flex-col gap-3 lg:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Buscar por contacto, email, WhatsApp, asesor u origen"
            className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          />
          <select
            name="status"
            defaultValue={statusFilter ?? ""}
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 lg:w-56"
          >
            <option value="">Todos los estados</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Filtrar
          </button>
        </form>
      </FilterBar>

      {filteredLeads.length === 0 ? (
        <EmptyState
          title="No hay leads para esta vista"
          description="Prueba otro estado o un criterio de búsqueda más amplio para revisar el pipeline comercial."
        />
      ) : (
        <TableShell>
          <Table>
            <thead>
              <tr>
                <Th>Lead</Th>
                <Th>Canal</Th>
                <Th>Asignación</Th>
                <Th>Fecha</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => (
                <Tr key={lead.id}>
                  <Td>
                    <div className="space-y-1">
                      <div className="font-medium text-zinc-950">
                        {lead.full_name}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {lead.email ?? "Sin email"}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {lead.whatsapp ?? "Sin WhatsApp"}
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="space-y-1 text-sm text-zinc-600">
                      <div>
                        <span className="font-medium text-zinc-800">
                          Origen:
                        </span>{" "}
                        {lead.source_page ?? "-"}
                      </div>
                      <div>
                        <span className="font-medium text-zinc-800">
                          Propiedad:
                        </span>{" "}
                        {lead.property_slug ?? "-"}
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="space-y-2">
                      <Badge tone={lead.advisor_slug ? "success" : "default"}>
                        {lead.advisor_slug ?? "Sin asesor"}
                      </Badge>
                    </div>
                  </Td>
                  <Td>
                    <div className="space-y-1 text-sm text-zinc-600">
                      <div>{new Date(lead.created_at).toLocaleString()}</div>
                      <div>
                        Actualizado {new Date(lead.updated_at).toLocaleString()}
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <LeadStatusSelect id={lead.id} value={lead.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableShell>
      )}

      <PaginationBar
        pathname="/virtual-office/leads"
        searchParams={{
          q: params.q,
          status: statusFilter,
        }}
        page={pagination.page}
        perPage={pagination.perPage}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
