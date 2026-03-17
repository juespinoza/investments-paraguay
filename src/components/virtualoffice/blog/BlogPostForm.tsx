"use client";

import { useMemo, useState } from "react";
import { Role } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import {
  Badge,
  FormSection,
  InlineAlert,
} from "@/components/virtualoffice/Page";

type Option = {
  id: string;
  name?: string;
  fullName?: string;
  inmobiliariaId?: string | null;
};

type FormValues = {
  title: string;
  slug: string;
  content: string;
  coverImageUrl: string;
  authorRole: Role;
  advisorId: string;
  inmobiliariaId: string;
};

const EMPTY_VALUES: FormValues = {
  title: "",
  slug: "",
  content: "",
  coverImageUrl: "",
  authorRole: Role.BLOGUERO,
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

export default function BlogPostForm({
  mode,
  postId,
  initialData,
  canManageAssignments,
  inmobiliarias,
  advisors,
}: {
  mode: "create" | "edit";
  postId?: string;
  initialData?: Partial<FormValues>;
  canManageAssignments: boolean;
  inmobiliarias: Array<Option>;
  advisors: Array<Option>;
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

  const advisorsForSelectedInmobiliaria =
    values.authorRole === Role.ASESOR && values.inmobiliariaId
      ? advisors.filter(
          (item) => item.inmobiliariaId === values.inmobiliariaId,
        )
      : advisors;

  const update = (key: keyof FormValues, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint =
        mode === "create"
          ? "/api/virtualoffice/blog"
          : `/api/virtualoffice/blog/${postId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title.trim(),
          slug: values.slug.trim(),
          content: values.content.trim(),
          coverImageUrl: values.coverImageUrl.trim() || null,
          authorRole: canManageAssignments ? values.authorRole : undefined,
          advisorId:
            canManageAssignments && values.authorRole === Role.ASESOR
              ? values.advisorId || null
              : null,
          inmobiliariaId:
            canManageAssignments && values.authorRole === Role.INMOBILIARIA
              ? values.inmobiliariaId || null
              : null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "No se pudo guardar.");
        return;
      }

      router.push("/virtual-office/blog");
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
              {mode === "create" ? "Nuevo artículo" : "Editar artículo"}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
              <span>Título, autoría, contenido y portada.</span>
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
                ? "Crear post"
                : "Guardar cambios"}
          </button>
        </div>
      </div>

      {error ? <InlineAlert type="error" message={error} /> : null}

      <FormSection
        title="Identidad editorial"
        description="Define el título público y el slug con el que el post quedará expuesto."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="mb-1.5 text-sm font-medium text-zinc-800">Título</div>
            <input
              required
              value={values.title}
              onChange={(e) => {
                const nextTitle = e.target.value;
                update("title", nextTitle);
                if (!values.slug.trim()) update("slug", toSlug(nextTitle));
              }}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              placeholder="Nuevo análisis del mercado"
            />
          </label>

          <label className="block">
            <div className="mb-1.5 text-sm font-medium text-zinc-800">Slug</div>
            <input
              required
              value={values.slug}
              onChange={(e) => update("slug", toSlug(e.target.value))}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              placeholder="nuevo-analisis-del-mercado"
            />
          </label>
        </div>
      </FormSection>

      <FormSection
        title="Portada y presentación"
        description="Usa una imagen clara y consistente para mejorar la lectura del índice del blog."
      >
        <label className="block">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-zinc-800">
              Cover Image URL
            </span>
            <span className="text-xs text-zinc-500">Opcional</span>
          </div>
          <input
            value={values.coverImageUrl}
            onChange={(e) => update("coverImageUrl", e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="https://..."
          />
        </label>
      </FormSection>

      {canManageAssignments ? (
        <FormSection
          title="Autoría y tenant"
          description="La lógica del sistema no cambia: aquí solo haces más visible quién firma el contenido y bajo qué scope opera."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-zinc-800">
                Autor
              </div>
              <select
                value={values.authorRole}
                onChange={(e) => {
                  const nextRole = e.target.value as Role;
                  setValues((prev) => ({
                    ...prev,
                    authorRole: nextRole,
                    advisorId: nextRole === Role.ASESOR ? prev.advisorId : "",
                    inmobiliariaId:
                      nextRole === Role.INMOBILIARIA || nextRole === Role.ASESOR
                        ? prev.inmobiliariaId
                        : "",
                  }));
                }}
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              >
                <option value={Role.BLOGUERO}>Bloguero</option>
                <option value={Role.ADMIN}>Admin</option>
                <option value={Role.INMOBILIARIA}>Inmobiliaria</option>
                <option value={Role.ASESOR}>Asesor</option>
              </select>
            </label>

            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-zinc-800">
                Inmobiliaria
              </div>
              <select
                value={values.inmobiliariaId}
                onChange={(e) => {
                  const nextInmobiliariaId = e.target.value;
                  setValues((prev) => ({
                    ...prev,
                    inmobiliariaId: nextInmobiliariaId,
                    advisorId:
                      prev.authorRole === Role.ASESOR &&
                      nextInmobiliariaId &&
                      advisors.some(
                        (item) =>
                          item.id === prev.advisorId &&
                          item.inmobiliariaId === nextInmobiliariaId,
                      )
                        ? prev.advisorId
                        : "",
                  }));
                }}
                disabled={
                  values.authorRole !== Role.INMOBILIARIA &&
                  values.authorRole !== Role.ASESOR
                }
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:bg-zinc-100"
              >
                <option value="">Sin asignar</option>
                {inmobiliarias.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-zinc-800">
                Asesor
              </div>
              <select
                value={values.advisorId}
                onChange={(e) => update("advisorId", e.target.value)}
                disabled={values.authorRole !== Role.ASESOR}
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:bg-zinc-100"
              >
                <option value="">Sin asignar</option>
                {advisorsForSelectedInmobiliaria.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </FormSection>
      ) : null}

      <FormSection
        title="Contenido"
        description="Escribe el artículo completo. Mantén párrafos separados para mejorar legibilidad y publicación."
      >
        <label className="block">
          <div className="mb-1.5 text-sm font-medium text-zinc-800">
            Cuerpo del post
          </div>
          <textarea
            required
            value={values.content}
            onChange={(e) => update("content", e.target.value)}
            className="min-h-80 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="Escribe el artículo. Puedes separar párrafos con una línea en blanco."
          />
        </label>
      </FormSection>
    </form>
  );
}
