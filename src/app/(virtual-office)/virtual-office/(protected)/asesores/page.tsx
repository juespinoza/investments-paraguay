// src/app/(virtual-office)/virtual-office/(protected)/asesores/page.tsx
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
import DeleteButton from "@/components/virtualoffice/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdvisorsPage() {
  const session = await requireSession();

  // scope
  const where: any = { deletedAt: null };

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
    },
  });

  return (
    <div>
      <PageHeader
        title="Asesores"
        description="Gestioná los asesores que aparecen en el sitio público."
        actions={
          session.role !== "ASESOR" && (
            <Link
              href="/virtual-office/asesores/new"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              + Nuevo asesor
            </Link>
          )
        }
      />

      <TableShell>
        <Table>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Slug</Th>
              <Th>Inmobiliaria</Th>
              <Th>Actualizado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-sm text-zinc-600"
                  colSpan={5}
                >
                  No hay asesores todavía.
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <Tr key={a.id}>
                  <Td className="font-medium">{a.fullName}</Td>
                  <Td>{a.slug}</Td>
                  <Td>{a.inmobiliaria?.name ?? "-"}</Td>
                  <Td>{new Date(a.updatedAt).toLocaleString()}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/virtual-office/asesores/${a.id}/edit`}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                      >
                        Editar
                      </Link>

                      <DeleteButton id={a.id} />
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
