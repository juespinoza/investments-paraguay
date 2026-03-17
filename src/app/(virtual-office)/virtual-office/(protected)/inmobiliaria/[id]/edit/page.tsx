import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import {
  Table,
  TableShell,
  Td,
  Th,
  Tr,
} from "@/components/virtualoffice/Table";
import { InmobiliariaForm } from "@/components/virtualoffice/inmobiliarias/InmobiliariaForm";
import {
  getInmobiliariaById,
  InmobiliariaRepoError,
  requireInmobiliariaRoles,
} from "@/lib/virtualoffice/inmobiliarias";
import {
  assignAdvisorToInmobiliariaAction,
  assignInmobiliariaUserAction,
  unassignAdvisorFromInmobiliariaAction,
  unassignInmobiliariaUserAction,
} from "../../_actions";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; error?: string }>;
};

function renderStatus(status?: string) {
  switch (status) {
    case "user-assigned":
      return "Usuario vinculado correctamente.";
    case "user-unassigned":
      return "Usuario desvinculado correctamente.";
    case "advisor-assigned":
      return "Asesor vinculado correctamente. Sus asignaciones dependientes fueron sincronizadas.";
    case "advisor-unassigned":
      return "Asesor desvinculado correctamente. Sus asignaciones dependientes fueron sincronizadas.";
    default:
      return null;
  }
}

export default async function EditInmobiliariaPage({
  params,
  searchParams,
}: PageProps) {
  const session = await requireInmobiliariaRoles();
  const { id } = await params;
  const query = await searchParams;

  let inmobiliaria;
  try {
    inmobiliaria = await getInmobiliariaById(id);
  } catch (error) {
    if (error instanceof InmobiliariaRepoError && error.status === 404) {
      return notFound();
    }
    if (error instanceof InmobiliariaRepoError && error.status === 403) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Editar inmobiliaria</h1>
          <p className="mt-2 text-secondary">
            No tienes permisos para editar esta inmobiliaria.
          </p>
        </div>
      );
    }
    throw error;
  }

  if (!inmobiliaria) return notFound();

  const statusMessage = renderStatus(query.status);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar inmobiliaria"
        description="Actualiza la entidad principal y gestiona sus usuarios, asesores y relaciones activas."
        actions={
          <Link
            href="/virtual-office/inmobiliaria"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Volver
          </Link>
        }
      />

      {query.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {query.error}
        </div>
      ) : null}

      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-4">
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-500">Usuarios vinculados</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">
              {inmobiliaria.users.length}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-sm text-zinc-500">Asesores vinculados</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">
              {inmobiliaria._count.advisors}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-sm text-zinc-500">Propiedades activas</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">
              {inmobiliaria._count.properties}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-sm text-zinc-500">Posts activos</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">
              {inmobiliaria._count.blogs}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <InmobiliariaForm
            mode="edit"
            inmobiliariaId={id}
            initialData={{
              name: inmobiliaria.name,
              slug: inmobiliaria.slug,
              description: inmobiliaria.description ?? "",
              logoUrl: inmobiliaria.logoUrl ?? "",
            }}
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900">
              Usuarios de inmobiliaria
            </h2>
            <p className="text-sm text-zinc-600">
              Los usuarios con rol `INMOBILIARIA` pueden vincularse o moverse entre inmobiliarias desde aquí.
            </p>
          </div>

          {session.role === "ADMIN" ? (
            <form
              action={assignInmobiliariaUserAction.bind(null, id)}
              className="mt-4 flex flex-col gap-3 md:flex-row"
            >
              <select
                name="userId"
                defaultValue=""
                className="h-11 flex-1 rounded-xl border border-zinc-200 px-3 text-sm"
              >
                <option value="">Selecciona un usuario de inmobiliaria</option>
                {inmobiliaria.availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name?.trim() || user.email}
                    {user.isAssignedHere
                      ? " - ya vinculado aquí"
                      : user.inmobiliariaId
                        ? " - vinculado a otra inmobiliaria"
                        : " - sin asignar"}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Vincular usuario
              </button>
            </form>
          ) : null}

          <div className="mt-4">
            <TableShell>
              <Table>
                <thead>
                  <tr>
                    <Th>Nombre</Th>
                    <Th>Email</Th>
                    <Th>Rol</Th>
                    <Th>Asesor vinculado</Th>
                    <Th>Acciones</Th>
                  </tr>
                </thead>
                <tbody>
                  {inmobiliaria.users.length === 0 ? (
                    <tr>
                      <td
                        className="px-4 py-10 text-center text-sm text-zinc-600"
                        colSpan={5}
                      >
                        No hay usuarios vinculados a esta inmobiliaria.
                      </td>
                    </tr>
                  ) : (
                    inmobiliaria.users.map((user) => (
                      <Tr key={user.id}>
                        <Td className="font-medium">{user.name ?? "-"}</Td>
                        <Td>{user.email}</Td>
                        <Td>{user.role}</Td>
                        <Td>
                          {user.advisorId ? (
                            <Link
                              href={`/virtual-office/usuarios/${user.id}/edit`}
                              className="text-zinc-800 underline underline-offset-2"
                            >
                              Gestionado desde el usuario
                            </Link>
                          ) : (
                            "-"
                          )}
                        </Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/virtual-office/usuarios/${user.id}/edit`}
                              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                            >
                              Editar usuario
                            </Link>
                            {session.role === "ADMIN" && user.role === "INMOBILIARIA" ? (
                              <form
                                action={unassignInmobiliariaUserAction.bind(null, id)}
                              >
                                <input type="hidden" name="userId" value={user.id} />
                                <button
                                  type="submit"
                                  className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                                >
                                  Desvincular
                                </button>
                              </form>
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
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900">
              Asesores y asignaciones profundas
            </h2>
            <p className="text-sm text-zinc-600">
              Al mover un asesor también se sincronizan sus usuarios, propiedades y posts asociados al mismo tenant.
            </p>
          </div>

          {session.role === "ADMIN" ? (
            <form
              action={assignAdvisorToInmobiliariaAction.bind(null, id)}
              className="mt-4 flex flex-col gap-3 md:flex-row"
            >
              <select
                name="advisorId"
                defaultValue=""
                className="h-11 flex-1 rounded-xl border border-zinc-200 px-3 text-sm"
              >
                <option value="">Selecciona un asesor</option>
                {inmobiliaria.availableAdvisors.map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.fullName}
                    {advisor.isAssignedHere
                      ? " - ya vinculado aquí"
                      : advisor.inmobiliariaName
                        ? ` - vinculado a ${advisor.inmobiliariaName}`
                        : " - sin inmobiliaria"}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Vincular asesor
              </button>
            </form>
          ) : null}

          <div className="mt-4">
            <TableShell>
              <Table>
                <thead>
                  <tr>
                    <Th>Asesor</Th>
                    <Th>Slug</Th>
                    <Th>Usuarios</Th>
                    <Th>Propiedades</Th>
                    <Th>Posts</Th>
                    <Th>Acciones</Th>
                  </tr>
                </thead>
                <tbody>
                  {inmobiliaria.advisors.length === 0 ? (
                    <tr>
                      <td
                        className="px-4 py-10 text-center text-sm text-zinc-600"
                        colSpan={6}
                      >
                        No hay asesores vinculados a esta inmobiliaria.
                      </td>
                    </tr>
                  ) : (
                    inmobiliaria.advisors.map((advisor) => (
                      <Tr key={advisor.id}>
                        <Td className="font-medium">
                          <div>{advisor.fullName}</div>
                          {advisor.phone ? (
                            <div className="mt-1 text-xs text-zinc-500">
                              {advisor.phone}
                            </div>
                          ) : null}
                        </Td>
                        <Td>{advisor.slug}</Td>
                        <Td>
                          {advisor.linkedUsers.length === 0
                            ? "0"
                            : advisor.linkedUsers.map((user) => user.name?.trim() || user.email).join(", ")}
                        </Td>
                        <Td>{advisor._count.properties}</Td>
                        <Td>{advisor._count.blogs}</Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/virtual-office/asesores/${advisor.id}/edit`}
                              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                            >
                              Editar asesor
                            </Link>
                            {session.role === "ADMIN" ? (
                              <form
                                action={unassignAdvisorFromInmobiliariaAction.bind(
                                  null,
                                  id,
                                )}
                              >
                                <input
                                  type="hidden"
                                  name="advisorId"
                                  value={advisor.id}
                                />
                                <button
                                  type="submit"
                                  className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                                >
                                  Desvincular
                                </button>
                              </form>
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
        </CardBody>
      </Card>
    </div>
  );
}
