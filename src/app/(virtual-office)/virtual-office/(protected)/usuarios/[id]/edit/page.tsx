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
  requireUsersSession,
  UserRepoError,
} from "@/lib/auth/users";
import {
  cancelEmailChangeAction,
  resendInvitationAction,
  updateUserAction,
  sendPasswordResetLinkAction,
} from "../../_actions";
import { emailResultAlert } from "../../_messages";

const ROLE_OPTIONS: Array<{ value: Role; label: string }> = [
  { value: Role.ADMIN, label: "Admin" },
  { value: Role.INMOBILIARIA, label: "Inmobiliaria" },
  { value: Role.ASESOR, label: "Asesor" },
  { value: Role.BLOGUERO, label: "Bloguero" },
];

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    status?: string;
    error?: string;
    invite?: string;
    emailChange?: string;
  }>;
};

export default async function EditUserPage({
  params,
  searchParams,
}: PageProps) {
  try {
    await requireUsersSession("read");
  } catch (error) {
    if (error instanceof UserRepoError && error.status === 403) {
      return (
        <div className="space-y-6">
          <PageHeader
            title="Editar usuario"
            description="Actualiza rol, asignaciones y contraseña del usuario."
            eyebrow="Edición de usuarios"
          />
          <InlineAlert
            type="error"
            message="No tienes permisos para ver esta sección."
          />
        </div>
      );
    }

    throw error;
  }
  const { id } = await params;
  const query = await searchParams;

  const [user, options] = await Promise.all([
    getUserById(id),
    listUserFormOptions(),
  ]);

  if (!user) return notFound();

  const inputClassName =
    "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100";
  const isAdvisorUsersScope = options.scope === "advisor_users";
  const roleOptions = ROLE_OPTIONS.filter((option) =>
    options.availableRoles.includes(option.value),
  );

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

      {(() => {
        const alert =
          query.status === "updated"
            ? emailResultAlert("email-change", query.emailChange)
            : query.status === "invite-resent"
              ? emailResultAlert("invite", query.invite)
              : null;
        return alert ? <InlineAlert type={alert.type} message={alert.message} /> : null;
      })()}

      {query.status === "email-change-cancelled" ? (
        <InlineAlert type="success" message="Cambio de email cancelado." />
      ) : null}

      {user.pendingEmail ? (
        <InlineAlert
          type="warning"
          message={`Cambio de email pendiente: ${user.pendingEmail}. Se aplica cuando se confirme desde esa casilla; mientras tanto la cuenta sigue usando ${user.email}.`}
        />
      ) : null}

      {query.status === "reset-sent" ? (
        <InlineAlert
          type="success"
          message={`Enviamos un link para restablecer la contraseña a ${user.email}. Vence en 30 minutos.`}
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
              description={
                isAdvisorUsersScope
                  ? "Desde este scope solo puedes mantener cuentas de asesores de tu inmobiliaria."
                  : "Mantén la cuenta alineada con el rol correcto y un email vigente para el acceso al panel."
              }
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
                  <span className="block text-xs leading-5 text-zinc-500">
                    {user.emailVerifiedAt
                      ? "Si lo cambiás, el nuevo email tiene que confirmarse desde su casilla."
                      : "Cuenta sin activar: al corregir el email se reenvía la invitación."}
                  </span>
                </label>

                {isAdvisorUsersScope ? (
                  <>
                    <input type="hidden" name="role" value={Role.ASESOR} />
                    <div className="space-y-2 text-sm">
                      <span className="font-medium text-zinc-800">Rol</span>
                      <div className="flex h-11 items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700">
                        Asesor
                      </div>
                    </div>
                  </>
                ) : (
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-zinc-800">Rol</span>
                    <select
                      name="role"
                      defaultValue={user.role}
                      className={inputClassName}
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </FormSection>

            <FormSection
              title="Asignaciones"
              description="Haz explícito el tenant y el asesor atados a la cuenta para evitar permisos inconsistentes."
            >
              <div className="grid gap-4 md:grid-cols-2">
                {isAdvisorUsersScope ? (
                  <div className="space-y-2 text-sm">
                    <span className="font-medium text-zinc-800">
                      Inmobiliaria
                    </span>
                    <div className="flex h-11 items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700">
                      {options.inmobiliarias[0]?.name ?? "Tu inmobiliaria"}
                    </div>
                  </div>
                ) : (
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
                )}

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
                {isAdvisorUsersScope
                  ? "En este scope solo puedes mantener usuarios tipo asesor pertenecientes a tu inmobiliaria."
                  : "Si cambias el rol, respeta las mismas reglas operativas del sistema: `INMOBILIARIA` requiere tenant y `ASESOR` requiere asesor vinculado."}
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
            {user.emailVerifiedAt ? (
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Por seguridad, la contraseña solo la elige la persona dueña de
                la cuenta. Si perdió el acceso, enviale un link a{" "}
                <strong className="text-zinc-900">{user.email}</strong> para que
                elija una nueva. Si ese email no es correcto, corregilo primero
                en el formulario de arriba.
              </p>
            ) : (
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                <Badge tone="warning">Invitación pendiente</Badge>{" "}
                La cuenta se activa cuando la persona abre la invitación enviada
                a <strong className="text-zinc-900">{user.email}</strong> y elige
                su contraseña.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {user.emailVerifiedAt ? (
              <form action={sendPasswordResetLinkAction.bind(null, user.id)}>
                <FormSubmitButton
                  idleLabel="Enviar link para restablecer contraseña"
                  pendingLabel="Enviando..."
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                />
              </form>
            ) : (
              <form action={resendInvitationAction.bind(null, user.id)}>
                <FormSubmitButton
                  idleLabel="Reenviar invitación"
                  pendingLabel="Enviando..."
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                />
              </form>
            )}
            {user.pendingEmail ? (
              <form action={cancelEmailChangeAction.bind(null, user.id)}>
                <FormSubmitButton
                  idleLabel="Cancelar cambio de email"
                  pendingLabel="Cancelando..."
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                />
              </form>
            ) : null}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
