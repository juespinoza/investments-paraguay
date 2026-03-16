import Link from "next/link";
import { PageHeader } from "@/components/virtualoffice/Page";
import {
  Table,
  TableShell,
  Td,
  Th,
  Tr,
} from "@/components/virtualoffice/Table";
import DeleteInmobiliariaButton from "@/components/virtualoffice/inmobiliarias/DeleteInmobiliariaButton";
import { listInmobiliarias, requireInmobiliariaRoles } from "@/lib/virtualoffice/inmobiliarias";

export default async function Page() {
  const session = await requireInmobiliariaRoles();
  const items = await listInmobiliarias();

  return (
    <div>
      <PageHeader
        title="Inmobiliarias"
        description="Gestiona perfiles públicos y estructura base de cada inmobiliaria."
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

      <TableShell>
        <Table>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Slug</Th>
              <Th>Asesores</Th>
              <Th>Propiedades</Th>
              <Th>Posts</Th>
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
                  No hay inmobiliarias todavía.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <Tr key={item.id}>
                  <Td className="font-medium">{item.name}</Td>
                  <Td>{item.slug}</Td>
                  <Td>{item._count.advisors}</Td>
                  <Td>{item._count.properties}</Td>
                  <Td>{item._count.blogs}</Td>
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
              ))
            )}
          </tbody>
        </Table>
      </TableShell>
    </div>
  );
}
