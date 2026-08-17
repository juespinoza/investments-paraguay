import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { Link } from "@/i18n/navigation";
import { apiGet } from "@/lib/api/public";
import type { PublicPropertyListItem } from "@/lib/api/types";

function selectFeaturedProperties(properties: PublicPropertyListItem[]) {
  const featured = properties
    .filter((property) => property.isFeatured)
    .slice(0, 3);

  if (featured.length > 0) {
    return featured;
  }

  return properties.slice(0, 3);
}

export async function FeaturedPropertiesSection() {
  const properties = await apiGet<PublicPropertyListItem[]>(
    "/api/public/bienes-raices",
    60,
  );
  const selectedProperties = selectFeaturedProperties(properties ?? []);

  if (selectedProperties.length === 0) {
    return null;
  }

  return (
    <section className="bg-(--ivory) px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-130">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-(--gold)">
            Portafolio
          </p>
          <h2 className="font-cormorant text-[28px] font-normal leading-[1.15] text-primary md:text-[40px]">
            Inversiones seleccionadas
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {selectedProperties.map((property, index) => (
            <PropertyCard
              key={property.slug}
              property={property}
              priority={index === 0}
            />
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/bienes-raices"
            className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-primary transition-colors hover:text-(--gold)"
          >
            Ver todas las propiedades
            <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
