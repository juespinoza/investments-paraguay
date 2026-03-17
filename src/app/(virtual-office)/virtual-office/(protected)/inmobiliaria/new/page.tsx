import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import { InmobiliariaForm } from "@/components/virtualoffice/inmobiliarias/InmobiliariaForm";
import { requireInmobiliariaRoles } from "@/lib/virtualoffice/inmobiliarias";

export default async function NewInmobiliariaPage() {
  const session = await requireInmobiliariaRoles();

  if (session.role !== "ADMIN") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Nueva inmobiliaria</h1>
        <p className="mt-2 text-secondary">
          Solo un admin puede crear inmobiliarias.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Tenant management"
        title="Nueva inmobiliaria"
        description="Crea una inmobiliaria para usarla en el panel y sitio público."
      />

      <Card>
        <CardBody>
          <InmobiliariaForm mode="create" />
        </CardBody>
      </Card>
    </div>
  );
}
