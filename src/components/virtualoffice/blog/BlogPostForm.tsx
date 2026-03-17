"use client";

import { useState } from "react";
import { Role } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import FormMessage from "@/components/virtualoffice/FormMessage";

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
            placeholder="Nuevo análisis del mercado"
          />
        </div>

        <div>
          <label className="text-sm text-secondary">Slug</label>
          <input
            required
            value={values.slug}
            onChange={(e) => update("slug", toSlug(e.target.value))}
            className="mt-1 h-11 w-full rounded-md border px-3"
            placeholder="nuevo-analisis-del-mercado"
          />
        </div>
      </div>

      {canManageAssignments ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm text-secondary">Autor</label>
            <select
              value={values.authorRole}
              onChange={(e) => update("authorRole", e.target.value)}
              className="mt-1 h-11 w-full rounded-md border px-3"
            >
              <option value={Role.BLOGUERO}>Bloguero</option>
              <option value={Role.ADMIN}>Admin</option>
              <option value={Role.INMOBILIARIA}>Inmobiliaria</option>
              <option value={Role.ASESOR}>Asesor</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-secondary">Inmobiliaria</label>
            <select
              value={values.inmobiliariaId}
              onChange={(e) => update("inmobiliariaId", e.target.value)}
              disabled={values.authorRole !== Role.INMOBILIARIA}
              className="mt-1 h-11 w-full rounded-md border px-3 disabled:bg-zinc-100"
            >
              <option value="">Sin asignar</option>
              {inmobiliarias.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-secondary">Asesor</label>
            <select
              value={values.advisorId}
              onChange={(e) => update("advisorId", e.target.value)}
              disabled={values.authorRole !== Role.ASESOR}
              className="mt-1 h-11 w-full rounded-md border px-3 disabled:bg-zinc-100"
            >
              <option value="">Sin asignar</option>
              {advisors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div>
        <label className="text-sm text-secondary">Cover Image URL</label>
        <input
          value={values.coverImageUrl}
          onChange={(e) => update("coverImageUrl", e.target.value)}
          className="mt-1 h-11 w-full rounded-md border px-3"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="text-sm text-secondary">Contenido</label>
        <textarea
          required
          value={values.content}
          onChange={(e) => update("content", e.target.value)}
          className="mt-1 min-h-80 w-full rounded-md border px-3 py-2"
          placeholder="Escribe el artículo. Puedes separar párrafos con una línea en blanco."
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
            ? "Crear post"
            : "Guardar cambios"}
      </button>
    </form>
  );
}
