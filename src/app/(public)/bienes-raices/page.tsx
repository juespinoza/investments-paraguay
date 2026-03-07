import { apiGet } from "@/lib/api/public";
import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Real Estate Investment in Paraguay | Apartments, Land and Projects",
  description:
    "Find apartments, land, houses and investment projects in Paraguay with professional advisory for local and international buyers.",
  pathname: "/bienes-raices",
  locale: "es",
  keywords: [
    "inversion inmobiliaria paraguay",
    "departamentos en paraguay",
    "terrenos en paraguay",
    "proyectos inmobiliarios paraguay",
    "asesor inmobiliario paraguay",
  ],
});

export const revalidate = 60;

type PublicPropertyListItem = {
  slug: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  priceUsd: number | null;
  city: string | null;
  isFeatured: boolean;
  updatedAt: string;
  roiAnnualApproxPct: number;
  appreciationAnnualApproxPct: number;
  advisor: { slug: string; fullName: string } | null;
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    min?: string;
    max?: string;
  }>;
};

export default async function BienesRaicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const min = params.min?.trim() ?? "";
  const max = params.max?.trim() ?? "";

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (min) qs.set("min", min);
  if (max) qs.set("max", max);

  const properties = await apiGet<PublicPropertyListItem[]>(
    `/api/public/bienes-raices${qs.toString() ? `?${qs.toString()}` : ""}`,
    60,
  );

  const items =
    properties?.map((p) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle ?? "",
      coverImageUrl: p.coverImageUrl ?? "intentoPortada_wku8ef",
      href: `/bienes-raices/propiedades/${p.slug}`,
      badge: p.isFeatured ? "Destacada" : "Venta",
    })) ?? [];

  const mapQuery = encodeURIComponent(
    q || properties?.[0]?.city || "Paraguay",
  );

  return (
    <>
      <section className="container-page container-narrow py-6">
        <h1 className="text-3xl font-semibold">Inversiones inmobiliarias</h1>
        <p className="mt-2 text-secondary">
          Propiedades destacadas primero y luego por fecha de actualización.
        </p>

        <form className="mt-6 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
          <input
            name="q"
            defaultValue={q}
            placeholder="Zona, barrio o ciudad"
            className="h-11 rounded-sm border px-3 md:col-span-2"
          />
          <input
            name="min"
            defaultValue={min}
            placeholder="Inversión mínima (USD)"
            inputMode="numeric"
            className="h-11 rounded-sm border px-3"
          />
          <input
            name="max"
            defaultValue={max}
            placeholder="Inversión máxima (USD)"
            inputMode="numeric"
            className="h-11 rounded-sm border px-3"
          />
          <button
            type="submit"
            className="h-11 rounded-sm bg-secondary px-4 text-sm font-medium text-white md:col-span-4"
          >
            Aplicar filtros
          </button>
        </form>
      </section>

      <section className="container-page container-narrow pb-6">
        <h2 className="text-xl font-semibold">Mapa interactivo</h2>
        <p className="mt-2 text-sm text-secondary">
          Vista geográfica por zona de búsqueda.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border bg-white">
          <iframe
            title="Mapa de propiedades en Paraguay"
            className="h-[320px] w-full"
            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
            loading="lazy"
          />
        </div>
      </section>

      <FeaturedGrid title="Propiedades disponibles" items={items} />
    </>
  );
}
