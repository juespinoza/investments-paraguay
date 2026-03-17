"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  FormSection,
  InlineAlert,
} from "@/components/virtualoffice/Page";

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

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-zinc-800">{label}</span>
        {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
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
  const initialValues = useMemo(
    () => ({
      ...EMPTY_VALUES,
      advisorId: lockedAdvisorId ?? EMPTY_VALUES.advisorId,
      inmobiliariaId: lockedInmobiliariaId ?? EMPTY_VALUES.inmobiliariaId,
      ...initialData,
    }),
    [initialData, lockedAdvisorId, lockedInmobiliariaId],
  );

  const [values, setValues] = useState<PropertyFormValues>(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty =
    JSON.stringify(values) !== JSON.stringify(initialValues);

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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="sticky top-0 z-20 -mx-4 rounded-b-[1.5rem] border-b border-[rgba(24,39,63,0.08)] bg-[rgba(255,253,250,0.9)] px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              {mode === "create" ? "Nueva propiedad" : "Editar propiedad"}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
              <span>Identidad, ubicación, inversión y asignaciones.</span>
              {isDirty ? <Badge tone="warning">Cambios sin guardar</Badge> : null}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {isLoading
              ? "Guardando..."
              : mode === "create"
                ? "Crear propiedad"
                : "Guardar cambios"}
          </button>
        </div>
      </div>

      {error ? <InlineAlert type="error" message={error} /> : null}

      <FormSection
        title="Identidad"
        description="Empieza por la información esencial con la que la propiedad será encontrada y listada."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Título">
            <input
              required
              value={values.title}
              onChange={(e) => {
                const nextTitle = e.target.value;
                update("title", nextTitle);
                if (!values.slug.trim()) update("slug", toSlug(nextTitle));
              }}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="Departamento en Asunción"
            />
          </Field>

          <Field label="Slug" hint="Se usa en la URL pública">
            <input
              required
              value={values.slug}
              onChange={(e) => update("slug", toSlug(e.target.value))}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="departamento-asuncion"
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title="Ubicación"
        description="Haz que el equipo identifique rápidamente dónde está el inmueble y cómo ubicarlo."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Ciudad / zona">
            <input
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="Asunción"
            />
          </Field>
          <Field label="Barrio">
            <input
              value={values.neighborhood}
              onChange={(e) => update("neighborhood", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="Villa Morra"
            />
          </Field>
          <Field label="Dirección exacta">
            <input
              value={values.address}
              onChange={(e) => update("address", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="Av. Santa Teresa 1234"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitud">
              <input
                value={values.latitude}
                onChange={(e) => update("latitude", e.target.value)}
                inputMode="decimal"
                className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                placeholder="-25.2867"
              />
            </Field>
            <Field label="Longitud">
              <input
                value={values.longitude}
                onChange={(e) => update("longitude", e.target.value)}
                inputMode="decimal"
                className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                placeholder="-57.5962"
              />
            </Field>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Inversión y rentabilidad"
        description="Carga los datos financieros clave para que el equipo compare y priorice oportunidades."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Field label="Inversión (USD)">
            <input
              value={values.priceUsd}
              onChange={(e) => update("priceUsd", e.target.value)}
              inputMode="numeric"
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="85000"
            />
          </Field>
          <Field label="ROI anual (%)">
            <input
              value={values.roiAnnualPct}
              onChange={(e) => update("roiAnnualPct", e.target.value)}
              inputMode="decimal"
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="8.50"
            />
          </Field>
          <Field label="Plusvalía anual (%)">
            <input
              value={values.appreciationAnnualPct}
              onChange={(e) => update("appreciationAnnualPct", e.target.value)}
              inputMode="decimal"
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="5.20"
            />
          </Field>
          {canManageFeatured ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-1">
              <Field label="Destacada">
                <select
                  value={values.isFeatured}
                  onChange={(e) => update("isFeatured", e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </Field>
              <Field label="Orden">
                <input
                  value={values.featuredOrder}
                  onChange={(e) => update("featuredOrder", e.target.value)}
                  inputMode="numeric"
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                  placeholder="1"
                />
              </Field>
            </div>
          ) : null}
        </div>
      </FormSection>

      <FormSection
        title="Contenido y medios"
        description="Agrupa la narrativa comercial con la portada y la galería para que el alta quede completa."
      >
        <div className="grid gap-4">
          <Field label="Descripción">
            <textarea
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-32 w-full rounded-xl border border-zinc-200 px-3 py-2"
              placeholder="Detalle de la propiedad y propuesta de valor."
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Portada (Cloudinary)">
              <input
                value={values.coverImageUrl}
                onChange={(e) => update("coverImageUrl", e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                placeholder="carpeta/imagen"
              />
            </Field>
            <Field
              label="Galería (CSV)"
              hint="Separar con coma"
            >
              <input
                value={values.galleryCsv}
                onChange={(e) => update("galleryCsv", e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                placeholder="img1,img2,img3"
              />
            </Field>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Asignaciones"
        description="Haz visible el alcance real de la propiedad sin cambiar las reglas de permisos del sistema."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {lockedInmobiliariaId ? (
            <Badge tone="info">Inmobiliaria fijada por tu rol</Badge>
          ) : null}
          {lockedAdvisorId ? (
            <Badge tone="warning">Asesor fijado por tu rol</Badge>
          ) : null}
          {!canManageAssignments ? (
            <Badge tone="default">Solo lectura en asignaciones</Badge>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(canManageAssignments || lockedInmobiliariaId) && (
            <Field label="Inmobiliaria">
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
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3"
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
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-zinc-500"
                />
              )}
            </Field>
          )}

          <Field label={canManageAssignments ? "Asesor" : "Asesor asignado"}>
            {canManageAssignments ? (
              <select
                value={values.advisorId}
                onChange={(e) => update("advisorId", e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-200 px-3"
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
            ) : (
              <input
                value={
                  advisors.find((advisor) => advisor.id === values.advisorId)?.label ??
                  "Mi perfil"
                }
                disabled
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-zinc-500"
              />
            )}
          </Field>
        </div>
      </FormSection>
    </form>
  );
}
