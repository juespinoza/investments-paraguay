import { notFound } from "next/navigation";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";
import { PropertyForm } from "@/components/virtualoffice/properties/PropertyForm";
import {
  canManagePropertyAssignments,
  canManagePropertyFeatured,
  isAdvisor,
} from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/require-session";
import { prisma } from "@/lib/prisma";
import {
  assertPropertyScope,
  canEditProperty,
  getPropertyFormOptions,
  PropertyRepoError,
} from "@/lib/virtualoffice/properties";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

export default async function EditPropertyPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const session = await requireSession();
  const query = await searchParams;

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
    await assertPropertyScope(session, id, "update");
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
      locationUrl: true,
      latitude: true,
      longitude: true,
      roiAnnualPct: true,
      appreciationAnnualPct: true,
      isFeatured: true,
      featuredOrder: true,
      price: true,
      currency: true,
      status: true,
      hasPropertyDocuments: true,
      propertyTypeId: true,
      areaM2: true,
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
        eyebrow="Portafolio"
        title={isAdvisor(session) ? "Mi propiedad" : "Editar propiedad"}
        description={
          isAdvisor(session)
            ? "Actualiza únicamente la información de una propiedad dentro de tu propio alcance."
            : "Actualizá la información de la propiedad."
        }
      />

      {query.status === "created" ? (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Propiedad creada correctamente.
        </div>
      ) : null}

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
              locationUrl: property.locationUrl ?? "",
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
              price: property.price !== null ? String(property.price) : "",
              currency: property.currency,
              status: property.status,
              hasPropertyDocuments: property.hasPropertyDocuments
                ? "true"
                : "false",
              propertyTypeId: property.propertyTypeId,
              areaM2: property.areaM2 !== null ? String(property.areaM2) : "",
              description: property.description ?? "",
              coverImageUrl: property.coverImageUrl ?? "",
              galleryCsv: property.gallery.join(","),
              advisorId: property.advisorId ?? "",
            }}
            canManageAssignments={canManagePropertyAssignments(session)}
            canManageFeatured={canManagePropertyFeatured(session)}
            advisors={options.advisors.map((advisor) => ({
              id: advisor.id,
              label: advisor.fullName,
              inmobiliariaId: advisor.inmobiliariaId,
            }))}
            inmobiliarias={options.inmobiliarias.map((item) => ({
              id: item.id,
              label: item.name,
            }))}
            propertyTypes={options.propertyTypes}
            lockedAdvisorId={isAdvisor(session) ? session.advisorId ?? "" : undefined}
          />
        </CardBody>
      </Card>
    </div>
  );
}
