// src/app/(virtual-office)/virtual-office/(protected)/asesores/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";

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
    <div className="container-page py-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Asesores</h1>

        {session.role !== "ASESOR" ? (
          <Link
            href="/virtual-office/asesores/new"
            className="rounded-md bg-accent1 px-4 py-2 text-sm font-medium text-primary hover:opacity-90"
          >
            Nuevo asesor
          </Link>
        ) : null}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-accent2 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-accent2">
            <tr className="text-left">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Inmobiliaria</th>
              <th className="px-4 py-3">Actualizado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{a.fullName}</div>
                  {a.headline ? (
                    <div className="text-secondary">{a.headline}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-secondary">{a.slug}</td>
                <td className="px-4 py-3 text-secondary">
                  {a.inmobiliaria?.name ?? "-"}
                </td>
                <td className="px-4 py-3 text-secondary">
                  {new Date(a.updatedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/virtual-office/asesores/${a.id}`}
                    className="rounded-md px-3 py-2 hover:bg-accent2"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}

            {!items.length ? (
              <tr>
                <td className="px-4 py-6 text-secondary" colSpan={5}>
                  No hay asesores aún.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
