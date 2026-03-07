"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PropertyFormValues = {
  title: string;
  slug: string;
  city: string;
  priceUsd: string;
  description: string;
  coverImageUrl: string;
  galleryCsv: string;
  advisorId: string;
};

type PropertyPayload = {
  title: string;
  slug: string;
  city: string | null;
  priceUsd: number | null;
  description: string | null;
  coverImageUrl: string | null;
  gallery: string[];
  advisorId: string | null;
};

const EMPTY_VALUES: PropertyFormValues = {
  title: "",
  slug: "",
  city: "",
  priceUsd: "",
  description: "",
  coverImageUrl: "",
  galleryCsv: "",
  advisorId: "",
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

  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    city: values.city.trim() || null,
    priceUsd:
      Number.isFinite(priceNum) && priceNum > 0 ? Math.floor(priceNum) : null,
    description: values.description.trim() || null,
    coverImageUrl: values.coverImageUrl.trim() || null,
    gallery,
    advisorId: values.advisorId.trim() || null,
  };
}

export function PropertyForm({
  mode,
  propertyId,
  initialData,
}: {
  mode: "create" | "edit";
  propertyId?: string;
  initialData?: Partial<PropertyFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PropertyFormValues>({
    ...EMPTY_VALUES,
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

        <div>
          <label className="text-sm text-secondary">ID asesor (opcional)</label>
          <input
            value={values.advisorId}
            onChange={(e) => update("advisorId", e.target.value)}
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="cuid..."
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-secondary">Galería (CSV)</label>
        <input
          value={values.galleryCsv}
          onChange={(e) => update("galleryCsv", e.target.value)}
          className="mt-1 h-11 w-full rounded-md border px-3"
          placeholder="img1,img2,img3"
        />
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

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
