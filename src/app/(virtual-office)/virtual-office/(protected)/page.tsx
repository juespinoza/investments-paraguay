import Link from "next/link";
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
    "Carga primero la información de tu inmobiliaria, luego tus asesores y finalmente las propiedades que publicarás.",
  ASESOR:
    "Mantén tu perfil actualizado y revisa que tus propiedades tengan datos completos, fotos y asignación correcta.",
  BLOGUERO:
    "Publica artículos claros, con autoría correcta y una portada que ayude a generar confianza.",
} as const;

export default async function AdminHome() {
  const session = await requireSession();

  const [advisorCount, propertyCount, inmobiliariaCount, blogCount] =
    await Promise.all([
      prisma.advisor.count({
        where: {
          deletedAt: null,
          ...(session.role === "ADMIN"
            ? {}
            : session.role === "INMOBILIARIA"
              ? { inmobiliariaId: session.inmobiliariaId ?? "__none__" }
              : session.role === "ASESOR"
                ? { id: session.advisorId ?? "__none__" }
                : { id: "__none__" }),
        },
      }),
      prisma.property.count({
        where: {
          deletedAt: null,
          ...(session.role === "ADMIN"
            ? {}
            : session.role === "INMOBILIARIA"
              ? { inmobiliariaId: session.inmobiliariaId ?? "__none__" }
              : session.role === "ASESOR"
                ? { advisorId: session.advisorId ?? "__none__" }
                : { id: "__none__" }),
        },
      }),
      session.role === "ADMIN" || session.role === "INMOBILIARIA"
        ? prisma.inmobiliaria.count({
            where: {
              deletedAt: null,
              ...(session.role === "ADMIN"
                ? {}
                : { id: session.inmobiliariaId ?? "__none__" }),
            },
          })
        : Promise.resolve(0),
      prisma.blogPost.count({
        where: {
          deletedAt: null,
          ...(session.role === "ADMIN"
            ? {}
            : session.role === "BLOGUERO"
              ? { authorRole: "BLOGUERO" }
              : session.role === "INMOBILIARIA"
                ? { inmobiliariaId: session.inmobiliariaId ?? "__none__" }
                : { advisorId: session.advisorId ?? "__none__" }),
        },
      }),
    ]);

  const modules = [
    {
      label: "Asesores",
      description: "Perfiles públicos, bios, landing y propiedades destacadas.",
      href: "/virtual-office/asesores",
      enabled:
        session.role === "ADMIN" ||
        session.role === "INMOBILIARIA" ||
        session.role === "ASESOR",
      count: advisorCount,
    },
    {
      label: "Propiedades",
      description: "Alta, edición y curación del portafolio público.",
      href: "/virtual-office/propiedades",
      enabled:
        session.role === "ADMIN" ||
        session.role === "INMOBILIARIA" ||
        session.role === "ASESOR",
      count: propertyCount,
    },
    {
      label: "Inmobiliarias",
      description: "Gestión del tenant, relaciones y estructura operativa.",
      href: "/virtual-office/inmobiliaria",
      enabled: session.role === "ADMIN" || session.role === "INMOBILIARIA",
      count: inmobiliariaCount,
    },
    {
      label: "Blog",
      description: "Artículos y visibilidad editorial por autor o tenant.",
      href: "/virtual-office/blog",
      enabled: true,
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
        {(session.role === "ADMIN" || session.role === "INMOBILIARIA") && (
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
