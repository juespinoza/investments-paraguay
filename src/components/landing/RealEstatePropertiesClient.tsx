"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchX, SlidersHorizontal, X } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { cn } from "@/lib/cn";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { PublicPropertyListItem } from "@/lib/api/types";
import {
  resolvePropertyListingType,
  type PropertyListingType,
} from "@/lib/properties/listing-type";

type ListingFilter = "todos" | PropertyListingType;
type PriceOption = {
  label: string;
  value: number | null;
};

type Filters = {
  tipo: ListingFilter;
  precio: number | null;
  ciudad: string;
};

type RealEstatePropertiesClientProps = {
  properties: PublicPropertyListItem[];
  title: string;
  initialQuery: {
    tipo: string | null;
    precio: string | null;
    ciudad: string | null;
  };
};

const FILTER_KEYS = ["tipo", "precio", "ciudad"] as const;
const ALL_CITIES = "Todas";

const TYPE_OPTIONS: Array<{ label: string; value: ListingFilter }> = [
  { label: "Todos", value: "todos" },
  { label: "Venta", value: "venta" },
  { label: "Alquiler", value: "alquiler" },
];

const PRICE_OPTIONS: PriceOption[] = [
  { label: "USD 40k", value: 40000 },
  { label: "USD 100k", value: 100000 },
  { label: "USD 200k", value: 200000 },
  { label: "USD 500k", value: 500000 },
  { label: "Sin límite", value: null },
];

const CITY_ORDER = [
  "Asunción",
  "Luque",
  "MRA",
  "San Bernardino",
  "Ciudad del Este",
];

function parseTipo(value: string | null): ListingFilter {
  if (value === "venta" || value === "alquiler") return value;
  return "todos";
}

function parsePrecio(value: string | null) {
  if (!value) return null;

  const numericValue = Number(value);
  const option = PRICE_OPTIONS.find((item) => item.value === numericValue);

  return option?.value ?? null;
}

function parseFilters(searchParams: URLSearchParams): Filters {
  return {
    tipo: parseTipo(searchParams.get("tipo")),
    precio: parsePrecio(searchParams.get("precio")),
    ciudad: searchParams.get("ciudad")?.trim() || ALL_CITIES,
  };
}

function parseFiltersFromQuery(query: RealEstatePropertiesClientProps["initialQuery"]) {
  const searchParams = new URLSearchParams();

  if (query.tipo) searchParams.set("tipo", query.tipo);
  if (query.precio) searchParams.set("precio", query.precio);
  if (query.ciudad) searchParams.set("ciudad", query.ciudad);

  return parseFilters(searchParams);
}

function getCurrentSearchParams() {
  if (typeof window === "undefined") return new URLSearchParams();

  return new URLSearchParams(window.location.search);
}

function getPriceIndex(value: number | null) {
  const index = PRICE_OPTIONS.findIndex((option) => option.value === value);
  return index >= 0 ? index : PRICE_OPTIONS.length - 1;
}

function getActiveFilterCount(filters: Filters) {
  return [
    filters.tipo !== "todos",
    filters.precio !== null,
    filters.ciudad !== ALL_CITIES,
  ].filter(Boolean).length;
}

function formatCounter(count: number) {
  return `${count} ${count === 1 ? "propiedad encontrada" : "propiedades encontradas"}`;
}

function getSortedCities(properties: PublicPropertyListItem[]) {
  const cities = Array.from(
    new Set(
      properties
        .map((property) => property.city?.trim())
        .filter((city): city is string => Boolean(city)),
    ),
  );

  return cities.sort((a, b) => {
    const aIndex = CITY_ORDER.indexOf(a);
    const bIndex = CITY_ORDER.indexOf(b);

    if (aIndex !== -1 || bIndex !== -1) {
      return (
        (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
        (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
      );
    }

    return a.localeCompare(b, "es-PY");
  });
}

function FilterBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--carbon)] px-1.5 text-[11px] font-semibold text-[var(--ivory)]">
      {count}
    </span>
  );
}

function FiltersPanel({
  filters,
  cityOptions,
  activeFilterCount,
  onChange,
  onClear,
  variant = "desktop",
}: {
  filters: Filters;
  cityOptions: string[];
  activeFilterCount: number;
  onChange: (nextFilters: Filters) => void;
  onClear: () => void;
  variant?: "desktop" | "mobile";
}) {
  const priceIndex = getPriceIndex(filters.precio);
  const priceLabel = PRICE_OPTIONS[priceIndex]?.label ?? "Sin límite";
  const isMobile = variant === "mobile";

  return (
    <div
      className={cn(
        "flex gap-5",
        isMobile ? "flex-col" : "items-end justify-start xl:gap-6",
      )}
    >
      <fieldset className={cn("min-w-0", isMobile ? "w-full" : "shrink-0")}>
        <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Tipo
        </legend>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((option) => {
            const active = filters.tipo === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...filters, tipo: option.value })}
                className={cn(
                  "rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors duration-150",
                  active
                    ? "border-[var(--carbon)] bg-[var(--carbon)] text-[var(--ivory)]"
                    : "border-[var(--line)] bg-transparent text-primary hover:border-[var(--gold)] hover:text-[var(--gold)]",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className={cn(isMobile ? "w-full" : "w-[300px] shrink-0")}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor={`precio-maximo-${variant}`}
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
          >
            Precio máximo
          </label>
          <span className="text-[12px] font-semibold text-primary">
            {priceLabel}
          </span>
        </div>
        <input
          id={`precio-maximo-${variant}`}
          type="range"
          min={0}
          max={PRICE_OPTIONS.length - 1}
          step={1}
          value={priceIndex}
          onChange={(event) => {
            const nextPrice =
              PRICE_OPTIONS[Number(event.currentTarget.value)]?.value ?? null;
            onChange({ ...filters, precio: nextPrice });
          }}
          className="block w-full accent-[var(--gold)]"
        />
        <div className="mt-1 grid grid-cols-5 text-[10px] font-medium text-muted">
          <span className="text-left">40k</span>
          <span className="text-center">100k</span>
          <span className="text-center">200k</span>
          <span className="text-center">500k</span>
          <span className="text-right">Sin límite</span>
        </div>
      </div>

      <div className={cn(isMobile ? "w-full" : "w-[220px] shrink-0")}>
        <label
          htmlFor={`ciudad-${variant}`}
          className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
        >
          Ubicación
        </label>
        <select
          id={`ciudad-${variant}`}
          value={filters.ciudad}
          onChange={(event) =>
            onChange({ ...filters, ciudad: event.currentTarget.value })
          }
          className="h-10 w-full rounded-[2px] border border-[var(--line)] bg-[var(--ivory)] px-3 text-[13px] text-primary outline-none transition-colors duration-150 focus:border-[var(--gold)]"
        >
          <option value={ALL_CITIES}>Todas</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {activeFilterCount > 0 ? (
        <button
          type="button"
          onClick={onClear}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-[2px] border border-[var(--line)] px-4 text-[12px] font-semibold uppercase tracking-[0.06em] text-primary transition-colors duration-150 hover:border-[var(--gold)] hover:text-[var(--gold)]",
            isMobile ? "w-full" : "shrink-0",
          )}
        >
          Limpiar
          <X size={14} strokeWidth={1.8} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export function RealEstatePropertiesClient({
  properties,
  title,
  initialQuery,
}: RealEstatePropertiesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(() =>
    parseFiltersFromQuery(initialQuery),
  );

  const cityOptions = useMemo(() => {
    const cities = getSortedCities(properties);

    if (filters.ciudad !== ALL_CITIES && !cities.includes(filters.ciudad)) {
      return [filters.ciudad, ...cities];
    }

    return cities;
  }, [filters.ciudad, properties]);

  const filteredProperties = useMemo(
    () =>
      properties.filter((property) => {
        if (
          filters.tipo !== "todos" &&
          resolvePropertyListingType(property) !== filters.tipo
        ) {
          return false;
        }

        if (
          filters.precio !== null &&
          (property.priceUsd === null || property.priceUsd > filters.precio)
        ) {
          return false;
        }

        if (filters.ciudad !== ALL_CITIES && property.city !== filters.ciudad) {
          return false;
        }

        return true;
      }),
    [filters, properties],
  );

  const activeFilterCount = getActiveFilterCount(filters);
  const counterLabel = formatCounter(filteredProperties.length);

  const pushFilters = useCallback(
    (nextFilters: Filters) => {
      const params = getCurrentSearchParams();

      if (nextFilters.tipo === "todos") params.delete("tipo");
      else params.set("tipo", nextFilters.tipo);

      if (nextFilters.precio === null) params.delete("precio");
      else params.set("precio", String(nextFilters.precio));

      if (nextFilters.ciudad === ALL_CITIES) params.delete("ciudad");
      else params.set("ciudad", nextFilters.ciudad);

      const query = params.toString();
      setFilters(nextFilters);
      router.push(`${pathname}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const clearFilters = useCallback(() => {
    const params = getCurrentSearchParams();
    FILTER_KEYS.forEach((key) => params.delete(key));

    const query = params.toString();
    setFilters({ tipo: "todos", precio: null, ciudad: ALL_CITIES });
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    function syncFiltersFromUrl() {
      setFilters(parseFilters(getCurrentSearchParams()));
    }

    window.addEventListener("popstate", syncFiltersFromUrl);
    return () => window.removeEventListener("popstate", syncFiltersFromUrl);
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sheetOpen]);

  useEffect(() => {
    if (!sheetOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSheetOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [sheetOpen]);

  return (
    <>
      <div className="sticky top-16 z-40 border-b-[0.5px] border-[rgba(191,168,130,0.35)] bg-[var(--ivory)] px-4 py-3 md:px-6">
        <div className="mx-auto max-w-[1280px]">
          <div className="hidden items-end gap-6 xl:flex">
            <div className="min-w-0 flex-1">
              <FiltersPanel
                filters={filters}
                cityOptions={cityOptions}
                activeFilterCount={activeFilterCount}
                onChange={pushFilters}
                onClear={clearFilters}
              />
            </div>

            <div className="flex h-10 shrink-0 items-center gap-3 text-right">
              {activeFilterCount > 0 ? (
                <FilterBadge count={activeFilterCount} />
              ) : null}
              <p className="text-[13px] font-medium text-muted">
                {counterLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 xl:hidden">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="inline-flex items-center gap-2 rounded-[2px] border border-[var(--line)] px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-primary"
            >
              <SlidersHorizontal
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              Filtros
              <FilterBadge count={activeFilterCount} />
            </button>

            <p className="min-w-0 flex-1 truncate text-right text-[12px] font-medium text-muted">
              {counterLabel}
            </p>

            {activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary"
              >
                Limpiar
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <section className="bg-[var(--ivory)] px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-[var(--gold)]">
                Portafolio
              </p>
              <h2 className="font-cormorant text-[28px] font-normal leading-[1.15] text-primary md:text-[40px]">
                {title}
              </h2>
            </div>

            {activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex w-fit items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary transition-colors hover:text-[var(--gold)]"
              >
                Limpiar filtros
                <X size={14} strokeWidth={1.8} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {filteredProperties.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property.slug}
                  property={property}
                  priority={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex min-h-[320px] flex-col items-center justify-center rounded-[4px] border border-[var(--line)] bg-[var(--stone)] px-6 py-12 text-center">
              <SearchX
                size={34}
                strokeWidth={1.6}
                className="text-[var(--gold)]"
                aria-hidden="true"
              />
              <h3 className="mt-5 font-cormorant text-[26px] font-normal text-primary">
                No encontramos propiedades con estos filtros
              </h3>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center justify-center rounded-[2px] bg-[var(--carbon)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--ivory)] transition-colors duration-150 hover:bg-[var(--gold)] hover:text-[var(--carbon)]"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {sheetOpen ? (
        <div className="fixed inset-0 z-[70] xl:hidden">
          <button
            type="button"
            aria-label="Cerrar filtros"
            className="absolute inset-0 bg-[rgba(10,10,10,0.42)]"
            onClick={() => setSheetOpen(false)}
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-[16px] border-t border-[var(--line)] bg-[var(--ivory)] px-4 pb-6 pt-4 shadow-[0_-18px_48px_rgba(10,10,10,0.18)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                  Filtros
                </p>
                <p className="mt-1 text-sm font-medium text-primary">
                  {counterLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-[var(--line)] text-primary"
                aria-label="Cerrar filtros"
              >
                <X size={17} strokeWidth={1.8} />
              </button>
            </div>

            <FiltersPanel
              filters={filters}
              cityOptions={cityOptions}
              activeFilterCount={activeFilterCount}
              onChange={pushFilters}
              onClear={clearFilters}
              variant="mobile"
            />

          </div>
        </div>
      ) : null}
    </>
  );
}
