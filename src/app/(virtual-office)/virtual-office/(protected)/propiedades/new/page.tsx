import { PropertyForm } from "@/components/virtualoffice/properties/PropertyForm";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import { requireSession } from "@/lib/auth/require-session";
import {
  canCreateProperty,
  getPropertyFormOptions,
} from "@/lib/virtualoffice/properties";

export default async function NewPropertyPage() {
  const session = await requireSession();

  if (!canCreateProperty(session)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Nueva propiedad</h1>
        <p className="mt-2 text-secondary">
          No tienes permisos para crear propiedades.
        </p>
      </div>
    );
  }

  const options = await getPropertyFormOptions(session);

  return (
    <div>
      <PageHeader
        title="Nueva propiedad"
        description="Creá una propiedad para publicarla en el sitio."
      />

      <Card>
        <CardBody>
          <PropertyForm
            mode="create"
            canManageAssignments={session.role === "ADMIN" || session.role === "INMOBILIARIA"}
            canManageFeatured={session.role === "ADMIN" || session.role === "INMOBILIARIA"}
            advisors={options.advisors.map((advisor) => ({
              id: advisor.id,
              label: advisor.fullName,
              inmobiliariaId: advisor.inmobiliariaId,
            }))}
            inmobiliarias={options.inmobiliarias.map((item) => ({
              id: item.id,
              label: item.name,
            }))}
            lockedAdvisorId={session.role === "ASESOR" ? session.advisorId ?? "" : undefined}
            lockedInmobiliariaId={
              session.role === "INMOBILIARIA" || session.role === "ASESOR"
                ? session.inmobiliariaId ?? ""
                : undefined
            }
          />
        </CardBody>
      </Card>
    </div>
  );
}
