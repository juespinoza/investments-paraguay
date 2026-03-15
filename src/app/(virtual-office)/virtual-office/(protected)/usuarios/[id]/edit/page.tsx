import Link from "next/link";
import { notFound } from "next/navigation";
import { Role } from "@/generated/prisma";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import {
  getUserById,
  listUserFormOptions,
  requireAdminSession,
} from "@/lib/auth/users";
import {
  updateUserAction,
  updateUserPasswordAction,
} from "../../_actions";

const ROLE_OPTIONS: Array<{ value: Role; label: string }> = [
  { value: Role.ADMIN, label: "Admin" },
  { value: Role.INMOBILIARIA, label: "Inmobiliaria" },
  { value: Role.ASESOR, label: "Asesor" },
  { value: Role.BLOGUERO, label: "Bloguero" },
];

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; error?: string }>;
};

export default async function EditUserPage({
  params,
  searchParams,
}: PageProps) {
  await requireAdminSession();
  const { id } = await params;
  const query = await searchParams;

  const [user, options] = await Promise.all([
    getUserById(id),
    listUserFormOptions(),
  ]);

  if (!user) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar usuario"
        description="Actualiza rol, asignaciones y contraseña del usuario."
        actions={
          <Link
            href="/virtual-office/usuarios"
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

      {query.status === "updated" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Usuario actualizado correctamente.
        </div>
      ) : null}

      {query.status === "password-updated" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Contraseña actualizada correctamente.
        </div>
      ) : null}

      <Card>
        <CardBody>
          <form
            action={updateUserAction.bind(null, user.id)}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">Nombre</span>
              <input
                name="name"
                defaultValue={user.name ?? ""}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">Email</span>
              <input
                name="email"
                type="email"
                required
                defaultValue={user.email}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">Rol</span>
              <select
                name="role"
                defaultValue={user.role}
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
                defaultValue={user.inmobiliariaId ?? ""}
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
                defaultValue={user.advisorId ?? ""}
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
                Guardar cambios
              </button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <form
            action={updateUserPasswordAction.bind(null, user.id)}
            className="grid gap-4 md:grid-cols-2"
          >
            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">Nueva contraseña</span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-zinc-800">
                Confirmar contraseña
              </span>
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2"
              />
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Actualizar contraseña
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
