import Link from "next/link";
import { notFound } from "next/navigation";
import { Role } from "@/generated/prisma";
import FormSubmitButton from "@/components/virtualoffice/FormSubmitButton";
import {
  Badge,
  Card,
  CardBody,
  FormSection,
  InlineAlert,
  PageHeader,
} from "@/components/virtualoffice/Page";
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

  const inputClassName =
    "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar usuario"
        description="Actualiza rol, asignaciones y contraseña del usuario."
        eyebrow="Edición de usuarios"
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="info">{user.role}</Badge>
            <Badge tone="default">{user.email}</Badge>
          </div>
        }
        actions={
          <Link
            href="/virtual-office/usuarios"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Volver
          </Link>
        }
      />

      {query.error ? <InlineAlert type="error" message={query.error} /> : null}

      {query.status === "updated" ? (
        <InlineAlert
          type="success"
          message="Usuario actualizado correctamente."
        />
      ) : null}

      {query.status === "password-updated" ? (
        <InlineAlert
          type="success"
          message="Contraseña actualizada correctamente."
        />
      ) : null}

      <Card>
        <CardBody className="space-y-5">
          <form
            action={updateUserAction.bind(null, user.id)}
            className="space-y-5"
          >
            <FormSection
              title="Identidad"
              description="Mantén la cuenta alineada con el rol correcto y un email vigente para el acceso al panel."
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-zinc-800">Nombre</span>
                  <input
                    name="name"
                    defaultValue={user.name ?? ""}
                    className={inputClassName}
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="font-medium text-zinc-800">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue={user.email}
                    className={inputClassName}
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="font-medium text-zinc-800">Rol</span>
                  <select
                    name="role"
                    defaultValue={user.role}
                    className={inputClassName}
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </FormSection>

            <FormSection
              title="Asignaciones"
              description="Haz explícito el tenant y el asesor atados a la cuenta para evitar permisos inconsistentes."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-zinc-800">
                    Inmobiliaria
                  </span>
                  <select
                    name="inmobiliariaId"
                    defaultValue={user.inmobiliariaId ?? ""}
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
                    defaultValue={user.advisorId ?? ""}
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
                Si cambias el rol, respeta las mismas reglas operativas del
                sistema: `INMOBILIARIA` requiere tenant y `ASESOR` requiere
                asesor vinculado.
              </p>
              <FormSubmitButton
                idleLabel="Guardar cambios"
                pendingLabel="Guardando..."
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
              />
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">
              Seguridad de acceso
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Cambia la contraseña desde aquí cuando el usuario pierda acceso o
              necesite reiniciar sus credenciales.
            </p>
          </div>
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
                className={inputClassName}
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
                className={inputClassName}
              />
            </label>

            <div className="md:col-span-2">
              <FormSubmitButton
                idleLabel="Actualizar contraseña"
                pendingLabel="Actualizando..."
                className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              />
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
