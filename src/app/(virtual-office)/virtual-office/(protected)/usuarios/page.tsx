import Link from "next/link";
import { Role } from "@/generated/prisma";
import FormSubmitButton from "@/components/virtualoffice/FormSubmitButton";
import PaginationBar from "@/components/virtualoffice/PaginationBar";
import {
  Badge,
  Card,
  CardBody,
  CardSection,
  EmptyState,
  FilterBar,
  FormSection,
  InlineAlert,
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
  listUserFormOptions,
  listUsers,
  requireAdminSession,
} from "@/lib/auth/users";
import {
  paginateItems,
  resolvePagination,
} from "@/lib/virtualoffice/pagination";
import { createUserAction, deleteUserAction } from "./_actions";

export const dynamic = "force-dynamic";

const ROLE_OPTIONS: Array<{ value: Role; label: string }> = [
  { value: Role.ADMIN, label: "Admin" },
  { value: Role.INMOBILIARIA, label: "Inmobiliaria" },
  { value: Role.ASESOR, label: "Asesor" },
  { value: Role.BLOGUERO, label: "Bloguero" },
];

type UsersPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
    q?: string;
    role?: string;
    page?: string;
    perPage?: string;
  }>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  await requireAdminSession();
  const params = await searchParams;

  const [users, options] = await Promise.all([
    listUsers(),
    listUserFormOptions(),
  ]);
  const q = params.q?.trim().toLowerCase() ?? "";
  const roleFilter = params.role?.trim() ?? "";
  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      !q ||
      [user.name, user.email, user.inmobiliariaName, user.advisorName]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(q));
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesQuery && matchesRole;
  });
  const usersByRole = Object.values(Role).map((role) => ({
    role,
    count: users.filter((user) => user.role === role).length,
  }));
  const pagination = resolvePagination(
    {
      page: params.page,
      perPage: params.perPage,
    },
    filteredUsers.length,
  );
  const paginatedUsers = paginateItems(filteredUsers, pagination);

  const successMessage =
    params.status === "created"
      ? "Usuario creado correctamente."
      : params.status === "deleted"
        ? "Usuario desactivado correctamente."
        : undefined;

  const inputClassName =
    "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Gestiona accesos a la Oficina virtual y define el rol de cada cuenta."
        eyebrow="Administración de usuarios"
        meta={
          <div className="flex flex-wrap gap-2">
            {usersByRole.map(({ role, count }) => (
              <Badge key={role} tone={count > 0 ? "info" : "default"}>
                {role} · {count}
              </Badge>
            ))}
          </div>
        }
      />

      {params.error ? (
        <InlineAlert type="error" message={params.error} />
      ) : null}
      {successMessage ? (
        <InlineAlert type="success" message={successMessage} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Usuarios activos"
          value={users.length}
          hint="Cuentas disponibles para operar dentro del panel."
        />
        <StatCard
          label="Mostrando"
          value={filteredUsers.length}
          hint="Resultado del filtro actual."
        />
        <StatCard
          label="Con tenant"
          value={users.filter((user) => user.inmobiliariaId).length}
          hint="Usuarios vinculados a una inmobiliaria."
        />
        <StatCard
          label="Con asesor"
          value={users.filter((user) => user.advisorId).length}
          hint="Cuentas atadas a un perfil de asesor."
        />
      </div>

      <FilterBar>
        <form className="flex flex-1 flex-col gap-3 lg:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Buscar por nombre, email, inmobiliaria o asesor"
            className={inputClassName}
          />
          <select
            name="role"
            defaultValue={roleFilter}
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 lg:w-52"
          >
            <option value="">Todos los roles</option>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
        <Link
          href="/virtual-office/usuarios"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Limpiar
        </Link>
      </FilterBar>

      <Card>
        <CardBody className="space-y-5">
          <CardSection
            title="Crear usuario"
            description="Da de alta nuevos accesos con el rol y la asignación correcta desde una sola pantalla."
          >
            <form action={createUserAction} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-zinc-800">Nombre</span>
                  <input
                    name="name"
                    className={inputClassName}
                    placeholder="Nombre visible"
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="font-medium text-zinc-800">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className={inputClassName}
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
                    className={inputClassName}
                    placeholder="Min. 8 caracteres"
                  />
                </label>
              </div>

              <FormSection
                title="Rol y asignaciones"
                description="La lógica de permisos se mantiene igual. Aquí solo haces visibles las relaciones necesarias para cada cuenta."
              >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-zinc-800">Rol</span>
                    <select
                      name="role"
                      defaultValue={Role.ASESOR}
                      className={inputClassName}
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-zinc-800">
                      Inmobiliaria
                    </span>
                    <select
                      name="inmobiliariaId"
                      defaultValue=""
                      className={inputClassName}
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
                      className={inputClassName}
                    >
                      <option value="">Sin asignar</option>
                      {options.advisors.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.fullName}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </FormSection>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-dashed border-zinc-200 bg-[#fcfaf6] px-4 py-3 text-sm text-zinc-600">
                <p>
                  `ADMIN` y `BLOGUERO` no requieren tenant. `INMOBILIARIA`
                  requiere inmobiliaria. `ASESOR` requiere asesor asignado.
                </p>
                <FormSubmitButton
                  idleLabel="Crear usuario"
                  pendingLabel="Creando usuario..."
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
                />
              </div>
            </form>
          </CardSection>
        </CardBody>
      </Card>

      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No hay usuarios para este filtro"
          description="Ajusta la búsqueda o crea una nueva cuenta para seguir configurando el acceso al panel."
        />
      ) : (
        <TableShell>
          <Table>
            <thead>
              <tr>
                <Th>Usuario</Th>
                <Th>Rol</Th>
                <Th>Scope</Th>
                <Th>Alta</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <div className="space-y-1">
                      <div className="font-medium text-zinc-950">
                        {user.name ?? "Sin nombre"}
                      </div>
                      <div className="text-sm text-zinc-500">{user.email}</div>
                    </div>
                  </Td>
                  <Td>
                    <Badge
                      tone={
                        user.role === Role.ADMIN
                          ? "warning"
                          : user.role === Role.BLOGUERO
                            ? "info"
                            : user.role === Role.INMOBILIARIA
                              ? "success"
                              : "default"
                      }
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="space-y-1 text-sm text-zinc-600">
                      <div>
                        <span className="font-medium text-zinc-800">
                          Inmobiliaria:
                        </span>{" "}
                        {user.inmobiliariaName ?? "-"}
                      </div>
                      <div>
                        <span className="font-medium text-zinc-800">
                          Asesor:
                        </span>{" "}
                        {user.advisorName ?? "-"}
                      </div>
                    </div>
                  </Td>
                  <Td>{new Date(user.createdAt).toLocaleString()}</Td>
                  <Td>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/virtual-office/usuarios/${user.id}/edit`}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                      >
                        Editar
                      </Link>
                      <form action={deleteUserAction}>
                        <input type="hidden" name="id" value={user.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Desactivar
                        </button>
                      </form>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableShell>
      )}

      <PaginationBar
        pathname="/virtual-office/usuarios"
        searchParams={{
          q: params.q,
          role: roleFilter || undefined,
        }}
        page={pagination.page}
        perPage={pagination.perPage}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
