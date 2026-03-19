import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/users";
import { listUserFormOptions } from "@/lib/auth/users";
import {
  PageHeader,
  StatCard,
} from "@/components/virtualoffice/Page";
import { SuperAdminWizard } from "@/components/virtualoffice/workflow/SuperAdminWizard";

export default async function SuperAdminWorkflowPage() {
  await requireAdminSession();

  const [inmobiliarias, advisors, properties, users, options] = await Promise.all([
    prisma.inmobiliaria.count({ where: { deletedAt: null } }),
    prisma.advisor.count({ where: { deletedAt: null } }),
    prisma.property.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null } }),
    listUserFormOptions(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workflow fuerte"
        title="Super Admin"
        description="Crea tenants, asesores, propiedades y accesos siguiendo un flujo operativo consistente."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Inmobiliarias" value={inmobiliarias} hint="Tenants activos." />
        <StatCard label="Asesores" value={advisors} hint="Perfiles operativos." />
        <StatCard label="Propiedades" value={properties} hint="Inventario actual." />
        <StatCard label="Usuarios" value={users} hint="Accesos activos." />
      </div>

      <SuperAdminWizard
        initialInmobiliarias={options.inmobiliarias.map((item) => ({
          id: item.id,
          label: item.name,
        }))}
        initialAdvisors={options.advisors.map((item) => ({
          id: item.id,
          label: item.fullName,
          inmobiliariaId: item.inmobiliariaId,
        }))}
      />
    </div>
  );
}
