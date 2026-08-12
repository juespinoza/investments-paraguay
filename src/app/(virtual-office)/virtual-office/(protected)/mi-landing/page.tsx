import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdvisorById } from "@/app/api/virtualoffice/advisors/repo";
import { AdvisorForm } from "@/components/virtualoffice/advisors/AdvisorForm";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import { isAdvisor } from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/require-session";

export default async function AdvisorSelfServiceLandingPage() {
  const session = await requireSession();

  if (!isAdvisor(session) || !session.advisorId) {
    redirect("/virtual-office");
  }

  const advisor = await getAdvisorById(session.advisorId);
  if (!advisor) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi landing pública"
        description="Mantén tu perfil público, tu propuesta de valor y tus propiedades destacadas siempre actualizadas."
        actions={
          <Link
            href={`/virtual-office/propiedades/new?advisorId=${session.advisorId}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Crear propiedad
          </Link>
        }
      />

      <Card>
        <CardBody>
          <AdvisorForm
            mode="edit"
            advisorId={session.advisorId}
            section="landing"
            initialData={advisor}
            canEditInmobiliariaId={false}
            inmobiliariaOptions={[]}
            showDeleteButton={false}
          />
        </CardBody>
      </Card>
    </div>
  );
}
