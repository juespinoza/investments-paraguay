import { AdvisorForm } from "@/components/virtualoffice/advisors/AdvisorForm";
import { PageHeader, Card, CardBody } from "@/components/virtualoffice/Page";
import { isAdmin } from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/require-session";
import { listUserFormOptions } from "@/lib/auth/users";

export default async function NewAdvisorPage() {
  const session = await requireSession();
  const isAdminUser = isAdmin(session);
  const options = isAdminUser ? await listUserFormOptions() : null;

  return (
    <div>
      <PageHeader
        eyebrow="Gestión de perfiles"
        title="Nuevo asesor"
        description="Creá un asesor, asígnalo a una inmobiliaria si corresponde y opcionalmente genera su usuario de acceso."
      />

      <Card>
        <CardBody>
          <AdvisorForm
            mode="create"
            canEditInmobiliariaId={isAdminUser}
            allowUserBootstrap={isAdminUser}
            inmobiliariaOptions={
              options?.inmobiliarias.map((item) => ({
                id: item.id,
                label: item.name,
              })) ?? []
            }
          />
        </CardBody>
      </Card>
    </div>
  );
}
