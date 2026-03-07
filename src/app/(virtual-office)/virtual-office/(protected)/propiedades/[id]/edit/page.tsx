import { notFound } from "next/navigation";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import { PropertyForm } from "@/components/virtualoffice/properties/PropertyForm";
import { requireSession } from "@/lib/auth/require-session";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireSession();

  const property = await prisma.property.findFirst({
    where: {
      id,
      deletedAt: null,
      ...(session.role === "ADMIN"
        ? {}
        : { inmobiliariaId: session.inmobiliariaId ?? "__none__" }),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      city: true,
      priceUsd: true,
      description: true,
      coverImageUrl: true,
      gallery: true,
      advisorId: true,
    },
  });

  if (!property) return notFound();

  return (
    <div>
      <PageHeader
        title="Editar propiedad"
        description="Actualizá la información de la propiedad."
      />

      <Card>
        <CardBody>
          <PropertyForm
            mode="edit"
            propertyId={id}
            initialData={{
              title: property.title,
              slug: property.slug,
              city: property.city ?? "",
              priceUsd: property.priceUsd ? String(property.priceUsd) : "",
              description: property.description ?? "",
              coverImageUrl: property.coverImageUrl ?? "",
              galleryCsv: property.gallery.join(","),
              advisorId: property.advisorId ?? "",
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
