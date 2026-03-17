"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  FormSection,
  InlineAlert,
} from "@/components/virtualoffice/Page";

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
  const initialValues = useMemo(
    () => ({
      ...EMPTY_VALUES,
      ...initialData,
    }),
    [initialData],
  );
  const [values, setValues] = useState<FormValues>(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="sticky top-0 z-20 -mx-4 rounded-b-[1.5rem] border-b border-[rgba(24,39,63,0.08)] bg-[rgba(255,253,250,0.9)] px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              {mode === "create" ? "Nueva inmobiliaria" : "Editar inmobiliaria"}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
              <span>Identidad pública y estructura base del tenant.</span>
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
                ? "Crear inmobiliaria"
                : "Guardar cambios"}
          </button>
        </div>
      </div>

      {error ? <InlineAlert type="error" message={error} /> : null}

      <FormSection
        title="Identidad"
        description="Configura el nombre visible y el slug que servirá como base pública del tenant."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre">
            <input
              required
              value={values.name}
              onChange={(e) => {
                const nextName = e.target.value;
                update("name", nextName);
                if (!values.slug.trim()) update("slug", toSlug(nextName));
              }}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="SkyOne"
            />
          </Field>

          <Field label="Slug" hint="Se usa en la URL">
            <input
              required
              value={values.slug}
              onChange={(e) => update("slug", toSlug(e.target.value))}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="skyone"
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title="Presentación"
        description="Estos campos ayudan a que la inmobiliaria se entienda rápido cuando se vea desde el panel o el sitio."
      >
        <div className="grid gap-4">
          <Field label="Descripción">
            <textarea
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-32 w-full rounded-xl border border-zinc-200 px-3 py-2"
              placeholder="Resumen público de la inmobiliaria."
            />
          </Field>

          <Field label="Logo (Cloudinary)" hint="Opcional">
            <input
              value={values.logoUrl}
              onChange={(e) => update("logoUrl", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="carpeta/logo"
            />
          </Field>
        </div>
      </FormSection>
    </form>
  );
}
