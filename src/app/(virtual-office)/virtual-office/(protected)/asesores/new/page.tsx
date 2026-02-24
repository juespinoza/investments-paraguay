import { AdvisorForm } from "@/components/virtualoffice/advisors/AdvisorForm";
import { PageHeader, Card, CardBody } from "@/components/virtualoffice/Page";

export default function NewAdvisorPage() {
  return (
    <div>
      <PageHeader
        title="Nuevo asesor"
        description="Creá un asesor para mostrarlo en el sitio público."
      />

      <Card>
        <CardBody>
          <AdvisorForm mode="create" />
        </CardBody>
      </Card>
    </div>
  );
}
