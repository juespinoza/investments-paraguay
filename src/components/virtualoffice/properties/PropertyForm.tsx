"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormMessage from "@/components/virtualoffice/FormMessage";

type PropertyFormValues = {
  title: string;
  slug: string;
  city: string;
  neighborhood: string;
  address: string;
  latitude: string;
  longitude: string;
  roiAnnualPct: string;
  appreciationAnnualPct: string;
  isFeatured: string;
  featuredOrder: string;
  priceUsd: string;
  description: string;
  coverImageUrl: string;
  galleryCsv: string;
  advisorId: string;
  inmobiliariaId: string;
};

type PropertyOption = {
  id: string;
  label: string;
  inmobiliariaId?: string | null;
};

type PropertyPayload = {
  title: string;
  slug: string;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  roiAnnualPct: number | null;
  appreciationAnnualPct: number | null;
  isFeatured: boolean;
  featuredOrder: number | null;
  priceUsd: number | null;
  description: string | null;
  coverImageUrl: string | null;
  gallery: string[];
  advisorId: string | null;
  inmobiliariaId: string | null;
};

const EMPTY_VALUES: PropertyFormValues = {
  title: "",
  slug: "",
  city: "",
  neighborhood: "",
  address: "",
  latitude: "",
  longitude: "",
  roiAnnualPct: "",
  appreciationAnnualPct: "",
  isFeatured: "false",
  featuredOrder: "",
  priceUsd: "",
  description: "",
  coverImageUrl: "",
  galleryCsv: "",
  advisorId: "",
  inmobiliariaId: "",
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function toPayload(values: PropertyFormValues): PropertyPayload {
  const gallery = values.galleryCsv
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const priceNum = Number(values.priceUsd);
  const latitude = Number(values.latitude);
  const longitude = Number(values.longitude);
  const roiAnnualPct = Number(values.roiAnnualPct);
  const appreciationAnnualPct = Number(values.appreciationAnnualPct);
  const featuredOrder = Number(values.featuredOrder);

  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    city: values.city.trim() || null,
    neighborhood: values.neighborhood.trim() || null,
    address: values.address.trim() || null,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    roiAnnualPct: Number.isFinite(roiAnnualPct) ? roiAnnualPct : null,
    appreciationAnnualPct: Number.isFinite(appreciationAnnualPct)
      ? appreciationAnnualPct
      : null,
    isFeatured: values.isFeatured === "true",
    featuredOrder: Number.isFinite(featuredOrder) ? Math.floor(featuredOrder) : null,
    priceUsd:
      Number.isFinite(priceNum) && priceNum > 0 ? Math.floor(priceNum) : null,
    description: values.description.trim() || null,
    coverImageUrl: values.coverImageUrl.trim() || null,
    gallery,
    advisorId: values.advisorId.trim() || null,
    inmobiliariaId: values.inmobiliariaId.trim() || null,
  };
}

export function PropertyForm({
  mode,
  propertyId,
  initialData,
  canManageAssignments = false,
  canManageFeatured = false,
  advisors = [],
  inmobiliarias = [],
  lockedAdvisorId,
  lockedInmobiliariaId,
}: {
  mode: "create" | "edit";
  propertyId?: string;
  initialData?: Partial<PropertyFormValues>;
  canManageAssignments?: boolean;
  canManageFeatured?: boolean;
  advisors?: PropertyOption[];
  inmobiliarias?: PropertyOption[];
  lockedAdvisorId?: string;
  lockedInmobiliariaId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PropertyFormValues>({
    ...EMPTY_VALUES,
    advisorId: lockedAdvisorId ?? EMPTY_VALUES.advisorId,
    inmobiliariaId: lockedInmobiliariaId ?? EMPTY_VALUES.inmobiliariaId,
    ...initialData,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof PropertyFormValues, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = toPayload(values);
      const endpoint =
        mode === "create"
          ? "/api/virtualoffice/properties"
          : `/api/virtualoffice/properties/${propertyId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "No se pudo guardar.");
        return;
      }

      router.push("/virtual-office/propiedades");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {error ? <FormMessage type="error" message={error} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-secondary">Título</label>
          <input
            required
            value={values.title}
            onChange={(e) => {
              const nextTitle = e.target.value;
              update("title", nextTitle);
              if (!values.slug.trim()) update("slug", toSlug(nextTitle));
            }}
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="Departamento en Asunción"
          />
        </div>

        <div>
          <label className="text-sm text-secondary">Slug</label>
          <input
            required
            value={values.slug}
            onChange={(e) => update("slug", toSlug(e.target.value))}
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="departamento-asuncion"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-secondary">Ciudad / zona</label>
          <input
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="Asunción"
          />
        </div>
        <div>
          <label className="text-sm text-secondary">Barrio</label>
          <input
            value={values.neighborhood}
            onChange={(e) => update("neighborhood", e.target.value)}
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="Villa Morra"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-secondary">Dirección exacta</label>
          <input
            value={values.address}
            onChange={(e) => update("address", e.target.value)}
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="Av. Santa Teresa 1234"
          />
        </div>
        <div>
          <label className="text-sm text-secondary">Inversión (USD)</label>
          <input
            value={values.priceUsd}
            onChange={(e) => update("priceUsd", e.target.value)}
            inputMode="numeric"
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="85000"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-secondary">Latitud</label>
          <input
            value={values.latitude}
            onChange={(e) => update("latitude", e.target.value)}
            inputMode="decimal"
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="-25.2867"
          />
        </div>
        <div>
          <label className="text-sm text-secondary">Longitud</label>
          <input
            value={values.longitude}
            onChange={(e) => update("longitude", e.target.value)}
            inputMode="decimal"
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="-57.5962"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-secondary">ROI anual (%)</label>
          <input
            value={values.roiAnnualPct}
            onChange={(e) => update("roiAnnualPct", e.target.value)}
            inputMode="decimal"
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="8.50"
          />
        </div>
        <div>
          <label className="text-sm text-secondary">Plusvalía anual (%)</label>
          <input
            value={values.appreciationAnnualPct}
            onChange={(e) => update("appreciationAnnualPct", e.target.value)}
            inputMode="decimal"
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="5.20"
          />
        </div>
      </div>

      {canManageFeatured ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-secondary">Destacada</label>
            <select
              value={values.isFeatured}
              onChange={(e) => update("isFeatured", e.target.value)}
              className="mt-1 h-11 w-full rounded-md border px-3"
            >
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-secondary">Orden destacada</label>
            <input
              value={values.featuredOrder}
              onChange={(e) => update("featuredOrder", e.target.value)}
              inputMode="numeric"
              className="mt-1 h-11 w-full rounded-md border px-3"
              placeholder="1"
            />
          </div>
        </div>
      ) : null}

      <div>
        <label className="text-sm text-secondary">Descripción</label>
        <textarea
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="mt-1 min-h-28 w-full rounded-md border px-3 py-2"
          placeholder="Detalle de la propiedad y propuesta de valor."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-secondary">Portada (Cloudinary)</label>
          <input
            value={values.coverImageUrl}
            onChange={(e) => update("coverImageUrl", e.target.value)}
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="carpeta/imagen"
          />
        </div>

        {canManageAssignments ? (
          <div>
            <label className="text-sm text-secondary">Asesor</label>
            <select
              value={values.advisorId}
              onChange={(e) => update("advisorId", e.target.value)}
              className="mt-1 h-11 w-full rounded-md border px-3"
            >
              <option value="">Sin asignar</option>
              {advisors
                .filter((advisor) => {
                  if (!values.inmobiliariaId) return true;
                  return (
                    !advisor.inmobiliariaId ||
                    advisor.inmobiliariaId === values.inmobiliariaId
                  );
                })
                .map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.label}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="text-sm text-secondary">Asesor asignado</label>
            <input
              value={
                advisors.find((advisor) => advisor.id === values.advisorId)?.label ??
                "Mi perfil"
              }
              disabled
              className="mt-1 h-11 w-full rounded-md border px-3 bg-zinc-50 text-zinc-500"
            />
          </div>
        )}
      </div>

      {(canManageAssignments || lockedInmobiliariaId) && (
        <div>
          <label className="text-sm text-secondary">Inmobiliaria</label>
          {canManageAssignments ? (
            <select
              value={values.inmobiliariaId}
              onChange={(e) => {
                const nextInmobiliariaId = e.target.value;
                update("inmobiliariaId", nextInmobiliariaId);

                const advisorStillValid =
                  !values.advisorId ||
                  advisors.some(
                    (advisor) =>
                      advisor.id === values.advisorId &&
                      (!nextInmobiliariaId ||
                        !advisor.inmobiliariaId ||
                        advisor.inmobiliariaId === nextInmobiliariaId),
                  );

                if (!advisorStillValid) {
                  update("advisorId", "");
                }
              }}
              className="mt-1 h-11 w-full rounded-md border px-3"
            >
              <option value="">Sin asignar</option>
              {inmobiliarias.map((inmobiliaria) => (
                <option key={inmobiliaria.id} value={inmobiliaria.id}>
                  {inmobiliaria.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={
                inmobiliarias.find(
                  (inmobiliaria) => inmobiliaria.id === values.inmobiliariaId,
                )?.label ?? "Inmobiliaria asignada"
              }
              disabled
              className="mt-1 h-11 w-full rounded-md border px-3 bg-zinc-50 text-zinc-500"
            />
          )}
        </div>
      )}

      <div>
        <label className="text-sm text-secondary">Galería (CSV)</label>
        <input
          value={values.galleryCsv}
          onChange={(e) => update("galleryCsv", e.target.value)}
          className="mt-1 h-11 w-full rounded-md border px-3"
          placeholder="img1,img2,img3"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="h-11 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-70"
      >
        {isLoading
          ? "Guardando..."
          : mode === "create"
            ? "Crear propiedad"
            : "Guardar cambios"}
      </button>
    </form>
  );
}
