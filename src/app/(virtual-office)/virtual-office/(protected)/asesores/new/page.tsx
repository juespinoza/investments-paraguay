import { AdvisorForm } from "@/components/virtualoffice/advisors/AdvisorForm";
import { PageHeader, Card, CardBody } from "@/components/virtualoffice/Page";
import { isAdmin, isInmobiliaria } from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/require-session";
import { listUserFormOptions } from "@/lib/auth/users";

type NewAdvisorPageProps = {
  searchParams: Promise<{ inmobiliariaId?: string }>;
};

export default async function NewAdvisorPage({
  searchParams,
}: NewAdvisorPageProps) {
  const session = await requireSession();
  const isAdminUser = isAdmin(session);
  const isInmobiliariaUser = isInmobiliaria(session);
  const options = isAdminUser ? await listUserFormOptions() : null;
  const params = await searchParams;

  return (
    <div>
      <PageHeader
        eyebrow="Gestión de perfiles"
        title="Nuevo asesor"
        description={
          isInmobiliariaUser
            ? "Creá un asesor dentro de tu tenant. La asociación con tu inmobiliaria se aplicará automáticamente."
            : "Creá un asesor, asígnalo a una inmobiliaria si corresponde y opcionalmente genera su usuario de acceso."
        }
      />

      <Card>
        <CardBody>
          <AdvisorForm
            mode="create"
            canEditInmobiliariaId={isAdminUser}
            allowUserBootstrap={isAdminUser}
            initialData={{
              inmobiliariaId: params.inmobiliariaId?.trim() || null,
            }}
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
