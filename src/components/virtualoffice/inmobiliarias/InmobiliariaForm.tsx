"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormMessage from "@/components/virtualoffice/FormMessage";

type FormValues = {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
};

const EMPTY_VALUES: FormValues = {
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
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

export function InmobiliariaForm({
  mode,
  inmobiliariaId,
  initialData,
}: {
  mode: "create" | "edit";
  inmobiliariaId?: string;
  initialData?: Partial<FormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    ...EMPTY_VALUES,
    ...initialData,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof FormValues, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint =
        mode === "create"
          ? "/api/virtualoffice/inmobiliarias"
          : `/api/virtualoffice/inmobiliarias/${inmobiliariaId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          slug: values.slug.trim(),
          description: values.description.trim() || null,
          logoUrl: values.logoUrl.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "No se pudo guardar.");
        return;
      }

      router.push("/virtual-office/inmobiliaria");
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
          <label className="text-sm text-secondary">Nombre</label>
          <input
            required
            value={values.name}
            onChange={(e) => {
              const nextName = e.target.value;
              update("name", nextName);
              if (!values.slug.trim()) update("slug", toSlug(nextName));
            }}
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="SkyOne"
          />
        </div>

        <div>
          <label className="text-sm text-secondary">Slug</label>
          <input
            required
            value={values.slug}
            onChange={(e) => update("slug", toSlug(e.target.value))}
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="skyone"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-secondary">Descripción</label>
        <textarea
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="mt-1 min-h-28 w-full rounded-md border px-3 py-2"
          placeholder="Resumen público de la inmobiliaria."
        />
      </div>

      <div>
        <label className="text-sm text-secondary">Logo (Cloudinary)</label>
        <input
          value={values.logoUrl}
          onChange={(e) => update("logoUrl", e.target.value)}
          className="mt-1 h-11 w-full rounded-md border px-3"
          placeholder="carpeta/logo"
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
            ? "Crear inmobiliaria"
            : "Guardar cambios"}
      </button>
    </form>
  );
}
