import { notFound } from "next/navigation";
import { getAdvisorById } from "@/app/api/virtualoffice/advisors/repo";
import { PageHeader, Card, CardBody } from "@/components/virtualoffice/Page";
import { AdvisorForm } from "@/components/virtualoffice/advisors/AdvisorForm";
import { isAdmin } from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/require-session";
import { listUserFormOptions } from "@/lib/auth/users";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditAdvisorPage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireSession();
  const isAdminUser = isAdmin(session);
  const options = isAdminUser ? await listUserFormOptions() : null;

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
          <AdvisorForm
            mode="edit"
            advisorId={id}
            initialData={advisor}
            canEditInmobiliariaId={isAdminUser}
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
