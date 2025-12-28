import { apiGet } from "@/lib/api/public";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";

export const revalidate = 60;

type PublicPropertyListItem = {
  slug: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  priceUsd: number | null;
  city: string | null;
  advisor: { slug: string; fullName: string } | null;
};

export default async function BienesRaicesPage() {
  const properties = await apiGet<PublicPropertyListItem[]>(
    "/api/public/bienes-raices",
    60
  );

  const items =
    properties?.map((p) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle ?? "",
      coverImageUrl: p.coverImageUrl ?? "/placeholders/property.jpg",
      href: `/bienes-raices/${p.slug}`,
      badge: "Venta",
    })) ?? [];

  return <FeaturedGrid title="Propiedades disponibles" items={items} />;
}
