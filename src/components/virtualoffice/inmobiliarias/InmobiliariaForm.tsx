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
  createUser: boolean;
  userName: string;
  userEmail: string;
  userPassword: string;
};

const EMPTY_VALUES: FormValues = {
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
  createUser: false,
  userName: "",
  userEmail: "",
  userPassword: "",
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
  allowUserBootstrap = false,
}: {
  mode: "create" | "edit";
  inmobiliariaId?: string;
  initialData?: Partial<FormValues>;
  allowUserBootstrap?: boolean;
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

  const update = (key: keyof FormValues, value: FormValues[keyof FormValues]) =>
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
          user:
            mode === "create" && allowUserBootstrap && values.createUser
              ? {
                  name: values.userName.trim() || null,
                  email: values.userEmail.trim(),
                  password: values.userPassword,
                }
              : undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "No se pudo guardar.");
        return;
      }

      router.push(
        mode === "create"
          ? `/virtual-office/inmobiliaria/${data.id}/edit?status=created`
          : "/virtual-office/inmobiliaria",
      );
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

      {mode === "create" && allowUserBootstrap ? (
        <FormSection
          title="Usuario inicial"
          description="Opcionalmente crea en el mismo paso la cuenta operativa de la inmobiliaria."
        >
          <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={values.createUser}
              onChange={(e) => update("createUser", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300"
            />
            Crear también el usuario principal de la inmobiliaria
          </label>

          {values.createUser ? (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Field label="Nombre del usuario">
                <input
                  value={values.userName}
                  onChange={(e) => update("userName", e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                  placeholder="Equipo SkyOne"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  required={values.createUser}
                  value={values.userEmail}
                  onChange={(e) => update("userEmail", e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                  placeholder="admin@skyone.com"
                />
              </Field>

              <Field label="Contraseña" hint="Min. 8 caracteres">
                <input
                  type="password"
                  required={values.createUser}
                  minLength={8}
                  value={values.userPassword}
                  onChange={(e) => update("userPassword", e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                  placeholder="********"
                />
              </Field>
            </div>
          ) : null}
        </FormSection>
      ) : null}
    </form>
  );
}
