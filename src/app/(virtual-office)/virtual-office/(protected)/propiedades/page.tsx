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
import DeletePropertyButton from "@/components/virtualoffice/properties/DeletePropertyButton";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await requireSession();
  const where: {
    deletedAt: null;
    inmobiliariaId?: string;
    advisorId?: string;
  } = { deletedAt: null };

  if (session.role === "INMOBILIARIA") {
    where.inmobiliariaId = session.inmobiliariaId ?? "__none__";
  } else if (session.role === "ASESOR") {
    where.advisorId = session.advisorId ?? "__none__";
  } else if (session.role !== "ADMIN") {
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
    },
  });

  return (
    <div>
      <PageHeader
        title="Propiedades"
        description="Gestioná inmuebles y su información pública."
        actions={
          session.role !== "ASESOR" && (
            <Link
              href="/virtual-office/propiedades/new"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              + Nueva propiedad
            </Link>
          )
        }
      />

      <TableShell>
        <Table>
          <thead>
            <tr>
              <Th>Título</Th>
              <Th>Slug</Th>
              <Th>Ciudad</Th>
              <Th>Precio (USD)</Th>
              <Th>ROI %</Th>
              <Th>Plusvalía %</Th>
              <Th>Destacada</Th>
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
                  colSpan={10}
                >
                  No hay propiedades todavía.
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-medium">{p.title}</Td>
                  <Td>{p.slug}</Td>
                  <Td>{p.city ?? "-"}</Td>
                  <Td>{p.priceUsd ? `${p.priceUsd}` : "-"}</Td>
                  <Td>
                    {p.roiAnnualPct !== null ? String(p.roiAnnualPct) : "-"}
                  </Td>
                  <Td>
                    {p.appreciationAnnualPct !== null
                      ? String(p.appreciationAnnualPct)
                      : "-"}
                  </Td>
                  <Td>{p.isFeatured ? "Sí" : "No"}</Td>
                  <Td>{p.advisor?.fullName ?? "-"}</Td>
                  <Td>{new Date(p.updatedAt).toLocaleString()}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/virtual-office/propiedades/${p.id}/edit`}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                      >
                        Editar
                      </Link>
                      <DeletePropertyButton id={p.id} />
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
