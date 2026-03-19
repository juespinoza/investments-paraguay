import Link from "next/link";
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
        actions={
          <Link
            href={`/virtual-office/propiedades/new?advisorId=${id}${advisor.inmobiliariaId ? `&inmobiliariaId=${advisor.inmobiliariaId}` : ""}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Crear propiedad para este asesor
          </Link>
        }
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
