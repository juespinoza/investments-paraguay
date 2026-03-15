import { listLeads } from "@/lib/leads/repo";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/virtualoffice/Page";
import {
  Table,
  TableShell,
  Td,
  Th,
  Tr,
} from "@/components/virtualoffice/Table";
import LeadStatusSelect from "@/components/virtualoffice/leads/LeadStatusSelect";
import { requireVirtualOfficeRoles } from "@/lib/auth/virtual-office";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const access = await requireVirtualOfficeRoles([
    "ADMIN",
    "INMOBILIARIA",
    "ASESOR",
  ]);

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

  const leads = await listLeads({ advisorSlugs, take: 300 });

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Contactos recibidos desde páginas públicas."
      />

      <TableShell>
        <Table>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>WhatsApp</Th>
              <Th>Asesor</Th>
              <Th>Origen</Th>
              <Th>Estado</Th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-sm text-zinc-600"
                  colSpan={7}
                >
                  No hay leads todavía.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <Tr key={lead.id}>
                  <Td>{new Date(lead.created_at).toLocaleString()}</Td>
                  <Td className="font-medium">{lead.full_name}</Td>
                  <Td>{lead.email ?? "-"}</Td>
                  <Td>{lead.whatsapp ?? "-"}</Td>
                  <Td>{lead.advisor_slug ?? "-"}</Td>
                  <Td>{lead.source_page ?? "-"}</Td>
                  <Td>
                    <LeadStatusSelect id={lead.id} value={lead.status} />
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
