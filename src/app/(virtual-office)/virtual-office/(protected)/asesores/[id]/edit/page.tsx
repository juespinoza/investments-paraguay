import { notFound } from "next/navigation";
import { getAdvisorById } from "@/app/api/virtualoffice/advisors/repo";
import { PageHeader, Card, CardBody } from "@/components/virtualoffice/Page";
import { AdvisorForm } from "@/components/virtualoffice/advisors/AdvisorForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditAdvisorPage({ params }: PageProps) {
  const { id } = await params;

  const advisor = await getAdvisorById(id);
  if (!advisor) return notFound();

  return (
    <div>
      <PageHeader
        title="Editar asesor"
        description="Actualizá los datos del asesor."
      />

      <Card>
        <CardBody>
          <AdvisorForm mode="edit" advisorId={id} initialData={advisor} />
        </CardBody>
      </Card>
    </div>
  );
}
