import Link from "next/link";
import {
  can,
  canCreateInmobiliaria,
} from "@/lib/auth/permissions";
import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/require-session";
import {
  Card,
  CardBody,
  CardSection,
  PageHeader,
  StatCard,
} from "@/components/virtualoffice/Page";

const onboardingByRole = {
  ADMIN:
    "Configura inmobiliarias, ordena el equipo y controla que la información pública esté consistente.",
  INMOBILIARIA:
    "Mantén tu landing actualizada, crea asesores y usuarios de asesores, y supervisa que las propiedades de tu equipo estén completas.",
  ASESOR:
    "Mantén tu perfil actualizado y revisa que tus propiedades tengan datos completos, fotos y asignación correcta.",
  BLOGUERO:
    "Publica artículos claros, con autoría correcta y una portada que ayude a generar confianza.",
} as const;

export default async function AdminHome() {
  const session = await requireSession();
  const canSeeUsers = can(session, "users", "read");
  const canSeeAdvisors = can(session, "advisor_core", "read");
  const canSeeProperties = can(session, "properties", "read");
  const canSeeInmobiliarias =
    can(session, "inmobiliaria_core", "read") ||
    can(session, "inmobiliaria_landing", "read");
  const canCreateTenant = canCreateInmobiliaria(session);
  const canSeeBlog = can(session, "blogs", "read");

  const advisorIdsForScopedUsers =
    session.role === Role.INMOBILIARIA && session.inmobiliariaId
      ? (
          await prisma.advisor.findMany({
            where: {
              deletedAt: null,
              inmobiliariaId: session.inmobiliariaId,
            },
            select: { id: true },
          })
        ).map((advisor) => advisor.id)
      : [];

  const [userCount, advisorCount, propertyCount, inmobiliariaCount, blogCount] =
    await Promise.all([
      canSeeUsers
        ? prisma.user.count({
            where: {
              deletedAt: null,
              ...(session.role === Role.ADMIN
                ? {}
                : session.role === Role.INMOBILIARIA
                  ? {
                      role: Role.ASESOR,
                      advisorId: {
                        in: advisorIdsForScopedUsers.length
                          ? advisorIdsForScopedUsers
                          : ["__none__"],
                      },
                    }
                  : { id: "__none__" }),
            },
          })
        : Promise.resolve(0),
      prisma.advisor.count({
        where: {
          deletedAt: null,
          ...(session.role === Role.ADMIN
            ? {}
            : session.role === Role.INMOBILIARIA
              ? { inmobiliariaId: session.inmobiliariaId ?? "__none__" }
              : session.role === Role.ASESOR
                ? { id: session.advisorId ?? "__none__" }
                : { id: "__none__" }),
        },
      }),
      prisma.property.count({
        where: {
          deletedAt: null,
          ...(session.role === Role.ADMIN
            ? {}
            : session.role === Role.INMOBILIARIA
              ? { inmobiliariaId: session.inmobiliariaId ?? "__none__" }
              : session.role === Role.ASESOR
                ? { advisorId: session.advisorId ?? "__none__" }
                : { id: "__none__" }),
        },
      }),
      session.role === Role.ADMIN || session.role === Role.INMOBILIARIA
        ? prisma.inmobiliaria.count({
            where: {
              deletedAt: null,
              ...(session.role === Role.ADMIN
                ? {}
                : { id: session.inmobiliariaId ?? "__none__" }),
            },
          })
        : Promise.resolve(0),
      prisma.blogPost.count({
        where: {
          deletedAt: null,
          ...(session.role === Role.ADMIN
            ? {}
            : session.role === Role.BLOGUERO
              ? { authorRole: "BLOGUERO" }
              : session.role === Role.INMOBILIARIA
                ? {
                    authorRole: "INMOBILIARIA",
                    inmobiliariaId: session.inmobiliariaId ?? "__none__",
                  }
                : session.role === Role.ASESOR
                  ? {
                      authorRole: "ASESOR",
                      advisorId: session.advisorId ?? "__none__",
                    }
                  : { id: "__none__" }),
        },
      }),
    ]);

  const modules = [
    {
      label: "Usuarios",
      description:
        session.role === Role.INMOBILIARIA
          ? "Gestiona accesos de asesores vinculados a tu inmobiliaria."
          : "Cuentas de acceso, roles y asignaciones operativas.",
      href: "/virtual-office/usuarios",
      enabled: canSeeUsers,
      count: userCount,
    },
    {
      label: session.role === Role.ASESOR ? "Mi landing" : "Asesores",
      description:
        session.role === Role.ASESOR
          ? "Edita tu perfil público, propuesta de valor y propiedades destacadas."
          : "Perfiles públicos, bios, landing y propiedades destacadas.",
      href:
        session.role === Role.ASESOR
          ? "/virtual-office/mi-landing"
          : "/virtual-office/asesores",
      enabled: canSeeAdvisors,
      count: advisorCount,
    },
    {
      label: "Propiedades",
      description:
        session.role === Role.INMOBILIARIA
          ? "Supervisa y actualiza el portafolio de propiedades de tus asesores."
          : "Alta, edición y curación del portafolio público.",
      href: "/virtual-office/propiedades",
      enabled: canSeeProperties,
      count: propertyCount,
    },
    {
      label: "Inmobiliarias",
      description: "Gestión del tenant, relaciones y estructura operativa.",
      href: "/virtual-office/inmobiliaria",
      enabled: canSeeInmobiliarias,
      count: inmobiliariaCount,
    },
    {
      label: "Blog",
      description: "Artículos y visibilidad editorial por autor o tenant.",
      href: "/virtual-office/blog",
      enabled: canSeeBlog,
      count: blogCount,
    },
  ].filter((module) => module.enabled);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Panel operativo"
        title="Dashboard"
        description="Accesos rápidos, volumen de datos dentro de tu scope y una guía ligera para mantener la información actualizada."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {canSeeUsers && (
          <StatCard
            label="Usuarios"
            value={userCount}
            hint="Accesos activos dentro de tu scope."
          />
        )}
        <StatCard
          label="Asesores"
          value={advisorCount}
          hint="Perfiles activos dentro de tu scope."
        />
        <StatCard
          label="Propiedades"
          value={propertyCount}
          hint="Inventario disponible para gestión."
        />
        {canSeeInmobiliarias && (
          <StatCard
            label="Inmobiliarias"
            value={inmobiliariaCount}
            hint="Tenant visible desde tu rol."
          />
        )}
        <StatCard
          label="Blog"
          value={blogCount}
          hint="Contenido activo dentro de tu alcance."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <Card>
          <CardBody className="space-y-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                Acciones rápidas
              </div>
              <h2 className="mt-2 text-xl font-semibold text-zinc-950">
                Trabaja por módulos con menos fricción
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {modules.map((module) => (
                <CardSection
                  key={module.href}
                  title={module.label}
                  description={module.description}
                  className="h-full"
                >
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-3xl font-semibold tracking-tight text-zinc-950">
                        {module.count}
                      </div>
                      <div className="mt-1 text-sm text-zinc-500">
                        registros en tu alcance
                      </div>
                    </div>
                    <Link
                      className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                      href={module.href}
                    >
                      Abrir
                    </Link>
                  </div>
                </CardSection>
              ))}
              {canCreateTenant ? (
                <CardSection
                  title="Alta operativa"
                  description="Crea la estructura inicial de una nueva inmobiliaria y ordénala desde el panel."
                  className="h-full"
                >
                  <div className="flex items-end justify-between gap-4">
                    <div className="text-sm text-zinc-500">
                      Disponible solo para administración central.
                    </div>
                    <Link
                      className="inline-flex rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                      href="/virtual-office/inmobiliaria/new"
                    >
                      Crear tenant
                    </Link>
                  </div>
                </CardSection>
              ) : null}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
              Onboarding por rol
            </div>
            <h2 className="mt-2 text-xl font-semibold text-zinc-950">
              Qué conviene hacer primero
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {onboardingByRole[session.role]}
            </p>
            <div className="mt-5 rounded-[1.5rem] border border-[rgba(24,39,63,0.08)] bg-[#fcfaf6] p-4 text-sm leading-6 text-zinc-600">
              Prioriza registros completos, asignaciones correctas y consistencia
              entre tenant, asesor y contenido público.
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
