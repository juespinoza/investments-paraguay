import { PropertyForm } from "@/components/virtualoffice/properties/PropertyForm";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import {
  canManagePropertyAssignments,
  canManagePropertyFeatured,
  isAdvisor,
} from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/require-session";
import {
  canCreateProperty,
  getPropertyFormOptions,
} from "@/lib/virtualoffice/properties";

type NewPropertyPageProps = {
  searchParams: Promise<{ advisorId?: string }>;
};

export default async function NewPropertyPage({
  searchParams,
}: NewPropertyPageProps) {
  const session = await requireSession();
  const params = await searchParams;

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
  const defaultAdvisorId = params.advisorId?.trim() || "";

  return (
    <div>
      <PageHeader
        eyebrow="Portafolio"
        title="Nueva propiedad"
        description="Creá una propiedad y asígnala al asesor o tenant correcto desde el mismo flujo."
      />

      <Card>
        <CardBody>
          <PropertyForm
            mode="create"
            canManageAssignments={canManagePropertyAssignments(session)}
            canManageFeatured={canManagePropertyFeatured(session)}
            advisors={options.advisors.map((advisor) => ({
              id: advisor.id,
              label: advisor.fullName,
              inmobiliariaId: advisor.inmobiliariaId,
            }))}
            inmobiliarias={options.inmobiliarias.map((item) => ({
              id: item.id,
              label: item.name,
            }))}
            initialData={{
              advisorId: defaultAdvisorId,
            }}
            lockedAdvisorId={isAdvisor(session) ? session.advisorId ?? "" : undefined}
          />
        </CardBody>
      </Card>
    </div>
  );
}
