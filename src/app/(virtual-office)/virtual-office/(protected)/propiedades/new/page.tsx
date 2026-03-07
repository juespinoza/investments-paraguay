import { PropertyForm } from "@/components/virtualoffice/properties/PropertyForm";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";

export default function NewPropertyPage() {
  return (
    <div>
      <PageHeader
        title="Nueva propiedad"
        description="Creá una propiedad para publicarla en el sitio."
      />

      <Card>
        <CardBody>
          <PropertyForm mode="create" />
        </CardBody>
      </Card>
    </div>
  );
}
