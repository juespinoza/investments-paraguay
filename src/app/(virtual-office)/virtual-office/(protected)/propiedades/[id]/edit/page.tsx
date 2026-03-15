import { notFound } from "next/navigation";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import { PropertyForm } from "@/components/virtualoffice/properties/PropertyForm";
import { requireSession } from "@/lib/auth/require-session";
import { prisma } from "@/lib/prisma";
import {
  assertPropertyScope,
  canEditProperty,
  getPropertyFormOptions,
  PropertyRepoError,
} from "@/lib/virtualoffice/properties";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireSession();

  if (!canEditProperty(session)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Editar propiedad</h1>
        <p className="mt-2 text-secondary">
          No tienes permisos para editar propiedades.
        </p>
      </div>
    );
  }

  try {
    await assertPropertyScope(session, id);
  } catch (error) {
    if (error instanceof PropertyRepoError && error.status === 404) {
      return notFound();
    }
    if (error instanceof PropertyRepoError && error.status === 403) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Editar propiedad</h1>
          <p className="mt-2 text-secondary">
            No tienes permisos para editar esta propiedad.
          </p>
        </div>
      );
    }
    throw error;
  }

  const options = await getPropertyFormOptions(session);

  const property = await prisma.property.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      city: true,
      neighborhood: true,
      address: true,
      latitude: true,
      longitude: true,
      roiAnnualPct: true,
      appreciationAnnualPct: true,
      isFeatured: true,
      featuredOrder: true,
      priceUsd: true,
      description: true,
      coverImageUrl: true,
      gallery: true,
      advisorId: true,
      inmobiliariaId: true,
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
              neighborhood: property.neighborhood ?? "",
              address: property.address ?? "",
              latitude:
                property.latitude !== null ? String(property.latitude) : "",
              longitude:
                property.longitude !== null ? String(property.longitude) : "",
              roiAnnualPct:
                property.roiAnnualPct !== null
                  ? String(property.roiAnnualPct)
                  : "",
              appreciationAnnualPct:
                property.appreciationAnnualPct !== null
                  ? String(property.appreciationAnnualPct)
                  : "",
              isFeatured: property.isFeatured ? "true" : "false",
              featuredOrder:
                property.featuredOrder !== null
                  ? String(property.featuredOrder)
                  : "",
              priceUsd: property.priceUsd ? String(property.priceUsd) : "",
              description: property.description ?? "",
              coverImageUrl: property.coverImageUrl ?? "",
              galleryCsv: property.gallery.join(","),
              advisorId: property.advisorId ?? "",
              inmobiliariaId: property.inmobiliariaId ?? "",
            }}
            canManageAssignments={session.role === "ADMIN" || session.role === "INMOBILIARIA"}
            canManageFeatured={session.role === "ADMIN" || session.role === "INMOBILIARIA"}
            advisors={options.advisors.map((advisor) => ({
              id: advisor.id,
              label: advisor.fullName,
              inmobiliariaId: advisor.inmobiliariaId,
            }))}
            inmobiliarias={options.inmobiliarias.map((item) => ({
              id: item.id,
              label: item.name,
            }))}
            lockedAdvisorId={session.role === "ASESOR" ? session.advisorId ?? "" : undefined}
            lockedInmobiliariaId={
              session.role === "INMOBILIARIA" || session.role === "ASESOR"
                ? session.inmobiliariaId ?? ""
                : undefined
            }
          />
        </CardBody>
      </Card>
    </div>
  );
}
