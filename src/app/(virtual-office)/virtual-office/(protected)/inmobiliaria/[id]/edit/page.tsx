import { notFound } from "next/navigation";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import { InmobiliariaForm } from "@/components/virtualoffice/inmobiliarias/InmobiliariaForm";
import {
  getInmobiliariaById,
  InmobiliariaRepoError,
} from "@/lib/virtualoffice/inmobiliarias";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditInmobiliariaPage({ params }: PageProps) {
  const { id } = await params;

  let inmobiliaria;
  try {
    inmobiliaria = await getInmobiliariaById(id);
  } catch (error) {
    if (error instanceof InmobiliariaRepoError && error.status === 404) {
      return notFound();
    }
    if (error instanceof InmobiliariaRepoError && error.status === 403) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Editar inmobiliaria</h1>
          <p className="mt-2 text-secondary">
            No tienes permisos para editar esta inmobiliaria.
          </p>
        </div>
      );
    }
    throw error;
  }

  if (!inmobiliaria) return notFound();

  return (
    <div>
      <PageHeader
        title="Editar inmobiliaria"
        description="Actualiza la información principal de la inmobiliaria."
      />

      <Card>
        <CardBody>
          <InmobiliariaForm
            mode="edit"
            inmobiliariaId={id}
            initialData={{
              name: inmobiliaria.name,
              slug: inmobiliaria.slug,
              description: inmobiliaria.description ?? "",
              logoUrl: inmobiliaria.logoUrl ?? "",
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
