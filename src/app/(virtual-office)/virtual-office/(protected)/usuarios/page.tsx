import { Role } from "@/generated/prisma";
import { PageHeader, Card, CardBody } from "@/components/virtualoffice/Page";
import {
  Table,
  TableShell,
  Td,
  Th,
  Tr,
} from "@/components/virtualoffice/Table";
import {
  listUserFormOptions,
  listUsers,
  requireAdminSession,
} from "@/lib/auth/users";
import { createUserAction, deleteUserAction } from "./_actions";

export const dynamic = "force-dynamic";

const ROLE_OPTIONS: Array<{ value: Role; label: string }> = [
  { value: Role.ADMIN, label: "Admin" },
  { value: Role.INMOBILIARIA, label: "Inmobiliaria" },
  { value: Role.ASESOR, label: "Asesor" },
  { value: Role.BLOGUERO, label: "Bloguero" },
];

type UsersPageProps = {
  searchParams: Promise<{ status?: string; error?: string }>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  await requireAdminSession();
  const params = await searchParams;

  const [users, options] = await Promise.all([listUsers(), listUserFormOptions()]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Gestiona accesos al Virtual Office y define el rol de cada cuenta."
      />

      {params.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}

      {params.status === "created" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Usuario creado correctamente.
        </div>
      ) : null}

      {params.status === "deleted" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Usuario desactivado correctamente.
        </div>
      ) : null}

      <Card>
        <CardBody>
          <form action={createUserAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">Nombre</span>
              <input
                name="name"
                className="w-full rounded-xl border border-zinc-200 px-3 py-2"
                placeholder="Nombre visible"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">Email</span>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-zinc-200 px-3 py-2"
                placeholder="admin@empresa.com"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">Contraseña</span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2"
                placeholder="Min. 8 caracteres"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">Rol</span>
              <select
                name="role"
                defaultValue={Role.ASESOR}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">Inmobiliaria</span>
              <select
                name="inmobiliariaId"
                defaultValue=""
                className="w-full rounded-xl border border-zinc-200 px-3 py-2"
              >
                <option value="">Sin asignar</option>
                {options.inmobiliarias.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">Asesor</span>
              <select
                name="advisorId"
                defaultValue=""
                className="w-full rounded-xl border border-zinc-200 px-3 py-2"
              >
                <option value="">Sin asignar</option>
                {options.advisors.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Crear usuario
              </button>
            </div>
          </form>
        </CardBody>
      </Card>

      <TableShell>
        <Table>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Rol</Th>
              <Th>Inmobiliaria</Th>
              <Th>Asesor</Th>
              <Th>Creado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-sm text-zinc-600"
                  colSpan={7}
                >
                  No hay usuarios cargados todavía.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <Tr key={user.id}>
                  <Td className="font-medium">{user.name ?? "-"}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>{user.inmobiliariaName ?? "-"}</Td>
                  <Td>{user.advisorName ?? "-"}</Td>
                  <Td>{new Date(user.createdAt).toLocaleString()}</Td>
                  <Td>
                    <form action={deleteUserAction}>
                      <input type="hidden" name="id" value={user.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Desactivar
                      </button>
                    </form>
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
