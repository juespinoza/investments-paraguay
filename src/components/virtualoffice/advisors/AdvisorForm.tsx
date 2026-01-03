// src/components/virtualoffice/advisors/AdvisorForm.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SocialPlatformSchema = z.enum([
  "WHATSAPP",
  "EMAIL",
  "BLOG",
  "WEB",
  "INSTAGRAM",
  "FACEBOOK",
  "X",
  "TIKTOK",
]);

const FormSchema = z.object({
  fullName: z.string().min(3, "Full name required"),
  slug: z
    .string()
    .min(3)
    .transform((v) => slugify(v))
    .refine((v) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v), "Invalid slug"),
  headline: z.string().optional().nullable(),
  heroBgUrl: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),

  // si admin: puede reasignar inmobiliaria
  inmobiliariaId: z.string().optional().nullable(),

  landing: z.object({
    aboutImageUrl: z.string().optional().nullable(),
    aboutTitle: z.string().min(1),
    startDate: z.string().min(1),
    company: z.string().min(1),
    aboutDescription: z.string().optional().nullable(),
    aboutParagraph1: z.string().min(1),
    aboutParagraph2: z.string().min(1),

    servicesParagraph1: z.string().min(1),
    servicesParagraph2: z.string().min(1),

    propertyTypes: z.array(z.string()).default([]),
    clientTypes: z.array(z.string()).default([]),
    areas: z.array(z.string()).default([]),
    serviceList: z.array(z.string()).default([]),

    testimonies: z
      .array(
        z.object({
          name: z.string().min(1),
          text: z.string().min(1),
        })
      )
      .default([]),

    socialMedia: z
      .array(
        z.object({
          platform: SocialPlatformSchema,
          label: z.string().min(1),
          value: z.string().min(1),
          href: z.string().min(1),
        })
      )
      .default([]),

    featuredPropertyIds: z.array(z.string()).max(3).default([]),
  }),
});

export type AdvisorFormValues = z.input<typeof FormSchema>; // lo que RHF maneja
export type AdvisorFormOutput = z.output<typeof FormSchema>; // lo que Zod entrega (slug transformado)

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type PropertyOption = {
  id: string;
  title: string;
  city?: string | null;
  priceUsd?: number | null;
};

type Props = {
  mode: "create" | "edit";
  advisorId?: string; // requerido para edit
  initialData?: Partial<AdvisorFormValues>;
  propertiesOptions?: PropertyOption[];
  canEditInmobiliariaId?: boolean; // true para ADMIN
};

export function AdvisorForm({
  mode,
  advisorId,
  initialData,
  propertiesOptions = [],
  canEditInmobiliariaId = false,
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const defaults: AdvisorFormValues = useMemo(
    () => ({
      fullName: initialData?.fullName ?? "",
      slug: initialData?.slug ?? "",
      headline: initialData?.headline ?? null,
      heroBgUrl: initialData?.heroBgUrl ?? null,
      ctaLabel: initialData?.ctaLabel ?? "Contactar",
      ctaHref: initialData?.ctaHref ?? "#",
      inmobiliariaId: initialData?.inmobiliariaId ?? null,
      landing: {
        aboutImageUrl: initialData?.landing?.aboutImageUrl ?? null,
        aboutTitle: initialData?.landing?.aboutTitle ?? "Sobre mí",
        startDate:
          initialData?.landing?.startDate ??
          new Date().toISOString().slice(0, 10),
        company: initialData?.landing?.company ?? "SkyOne",
        aboutDescription: initialData?.landing?.aboutDescription ?? null,
        aboutParagraph1: initialData?.landing?.aboutParagraph1 ?? "Párrafo 1",
        aboutParagraph2: initialData?.landing?.aboutParagraph2 ?? "Párrafo 2",
        servicesParagraph1:
          initialData?.landing?.servicesParagraph1 ?? "Servicios párrafo 1",
        servicesParagraph2:
          initialData?.landing?.servicesParagraph2 ?? "Servicios párrafo 2",

        propertyTypes: initialData?.landing?.propertyTypes ?? [],
        clientTypes: initialData?.landing?.clientTypes ?? [],
        areas: initialData?.landing?.areas ?? [],
        serviceList: initialData?.landing?.serviceList ?? [],
        testimonies: initialData?.landing?.testimonies ?? [],
        socialMedia: initialData?.landing?.socialMedia ?? [],
        featuredPropertyIds: initialData?.landing?.featuredPropertyIds ?? [],
      },
    }),
    [initialData]
  );

  const form = useForm<AdvisorFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const { register, handleSubmit, watch, setValue, control, formState } = form;

  const testimoniesFA = useFieldArray({
    control,
    name: "landing.testimonies",
  });

  const socialFA = useFieldArray({
    control,
    name: "landing.socialMedia",
  });

  const featured = watch("landing.featuredPropertyIds");

  const fullName = watch("fullName");
  const slug = watch("slug");
  const propertyTypes = watch("landing.propertyTypes") ?? [];
  const clientTypes = watch("landing.clientTypes") ?? [];
  const areas = watch("landing.areas") ?? [];
  const serviceList = watch("landing.serviceList") ?? [];
  const featuredIds = watch("landing.featuredPropertyIds") ?? [];

  // si el usuario tocó slug manualmente, no autogeneramos más
  const slugTouchedRef = useRef(false);

  // valor inicial del slug para detectar si lo modificó
  const initialSlugRef = useRef(defaults.slug);

  const onSubmit: SubmitHandler<AdvisorFormValues> = async (values) => {
    setSaving(true);
    setErrorMsg(null);

    try {
      // ✅ acá Zod valida + aplica transform() (slugify)
      const parsed: AdvisorFormOutput = FormSchema.parse(values);

      if (mode === "create") {
        const res = await fetch("/api/virtualoffice/advisors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: parsed.fullName,
            slug: parsed.slug, // ✅ ya viene slugified
            inmobiliariaId: parsed.inmobiliariaId,
            headline: parsed.headline,
            heroBgUrl: parsed.heroBgUrl,
            ctaLabel: parsed.ctaLabel,
            ctaHref: parsed.ctaHref,
            landing: {
              aboutTitle: parsed.landing.aboutTitle,
              company: parsed.landing.company,
            },
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Create failed");

        router.replace(`/virtual-office/asesores/${json.id}`);
        router.refresh();
        return;
      }

      if (!advisorId) throw new Error("Missing advisorId for edit");

      const res = await fetch(`/api/virtualoffice/advisors/${advisorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed), // ✅ mandás el payload normalizado
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Update failed");

      router.refresh();
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  };

  async function onDelete() {
    if (!advisorId) return;
    if (!confirm("¿Seguro que quieres eliminar este asesor? (soft delete)"))
      return;

    setSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/virtualoffice/advisors/${advisorId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      router.replace("/virtual-office/asesores");
      router.refresh();
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  function addToStringArray(
    path:
      | "landing.propertyTypes"
      | "landing.clientTypes"
      | "landing.areas"
      | "landing.serviceList",
    value: string
  ) {
    const v = value.trim();
    if (!v) return;
    const current = (watch(path) as string[]) ?? [];
    if (current.includes(v)) return;
    setValue(path as any, [...current, v], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function removeFromStringArray(
    path:
      | "landing.propertyTypes"
      | "landing.clientTypes"
      | "landing.areas"
      | "landing.serviceList",
    value: string
  ) {
    const current = (watch(path) as string[]) ?? [];
    setValue(
      path as any,
      current.filter((x) => x !== value),
      { shouldDirty: true, shouldValidate: true }
    );
  }

  useEffect(() => {
    // si el usuario ya tocó el slug, no lo pises
    if (slugTouchedRef.current) return;

    const name = (fullName ?? "").trim();
    if (!name) return;

    const next = slugify(name);

    // si en modo edit ya venía un slug distinto, no lo pises automáticamente
    // a menos que el slug actual sea igual al initialSlug o esté vacío
    const current = (slug ?? "").trim();
    const initial = (initialSlugRef.current ?? "").trim();

    const canAutofill =
      current.length === 0 ||
      current === initial ||
      current === slugify(fullName ?? "");

    if (!canAutofill) return;

    if (next && next !== current) {
      setValue("slug", next, { shouldDirty: true, shouldValidate: true });
    }
  }, [fullName, slug, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            {mode === "create" ? "Nuevo asesor" : "Editar asesor"}
          </h1>
          <p className="text-secondary">
            Landing + redes + testimonios + destacadas (máx 3).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mode === "edit" ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={saving}
              className="rounded-md border px-3 py-2 text-sm hover:bg-accent2 disabled:opacity-60"
            >
              Eliminar
            </button>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-accent1 px-4 py-2 text-sm font-medium text-primary hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {errorMsg ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      ) : null}

      {/* Base */}
      <section className="rounded-xl border border-accent2 bg-white p-4">
        <h2 className="text-lg font-semibold">Datos base</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-secondary">Nombre completo</label>
            <input
              {...register("fullName")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Julia Espinoza"
            />
            {formState.errors.fullName ? (
              <p className="mt-1 text-xs text-red-600">
                {formState.errors.fullName.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="text-sm text-secondary">Slug</label>
            <input
              {...register("slug", {
                onChange: () => {
                  slugTouchedRef.current = true;
                },
                onBlur: (e) => {
                  // normaliza en blur (por si pegó texto raro)
                  const normalized = slugify(e.target.value);
                  setValue("slug", normalized, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                },
              })}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="nombre-completo"
            />
            {formState.errors.slug ? (
              <p className="mt-1 text-xs text-red-600">
                {formState.errors.slug.message as any}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-secondary">Headline / Slogan</label>
            <input
              {...register("headline")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Inversiones inteligentes en Paraguay"
            />
          </div>

          <div>
            <label className="text-sm text-secondary">CTA Label</label>
            <input
              {...register("ctaLabel")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Contactar"
            />
          </div>

          <div>
            <label className="text-sm text-secondary">CTA Href</label>
            <input
              {...register("ctaHref")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="https://wa.me/..."
            />
          </div>

          <div>
            <label className="text-sm text-secondary">
              Hero Bg (Cloudinary public_id o URL)
            </label>
            <input
              {...register("heroBgUrl")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="office_bg_xxx"
            />
          </div>

          {canEditInmobiliariaId ? (
            <div>
              <label className="text-sm text-secondary">Inmobiliaria ID</label>
              <input
                {...register("inmobiliariaId")}
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="cuid..."
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* About */}
      <section className="rounded-xl border border-accent2 bg-white p-4">
        <h2 className="text-lg font-semibold">About (Landing)</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-secondary">
              Imagen (Cloudinary public_id o URL)
            </label>
            <input
              {...register("landing.aboutImageUrl")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="profile_xxx"
            />
          </div>

          <div>
            <label className="text-sm text-secondary">Título</label>
            <input
              {...register("landing.aboutTitle")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Sobre mí"
            />
          </div>

          <div>
            <label className="text-sm text-secondary">Fecha inicio</label>
            <input
              type="date"
              {...register("landing.startDate")}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-secondary">Empresa</label>
            <input
              {...register("landing.company")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="SkyOne"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-secondary">
              Descripción (opcional)
            </label>
            <textarea
              {...register("landing.aboutDescription")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={2}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-secondary">Párrafo 1</label>
            <textarea
              {...register("landing.aboutParagraph1")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-secondary">Párrafo 2</label>
            <textarea
              {...register("landing.aboutParagraph2")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="rounded-xl border border-accent2 bg-white p-4">
        <h2 className="text-lg font-semibold">Servicios (Landing)</h2>

        <div className="mt-4 grid gap-4">
          <div>
            <label className="text-sm text-secondary">
              Servicios - párrafo 1
            </label>
            <textarea
              {...register("landing.servicesParagraph1")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm text-secondary">
              Servicios - párrafo 2
            </label>
            <textarea
              {...register("landing.servicesParagraph2")}
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={3}
            />
          </div>

          <StringArrayEditor
            title="Tipos de propiedad"
            items={propertyTypes}
            onAdd={(v) => addToStringArray("landing.propertyTypes", v)}
            onRemove={(v) => removeFromStringArray("landing.propertyTypes", v)}
          />

          <StringArrayEditor
            title="Tipos de clientes"
            items={clientTypes}
            onAdd={(v) => addToStringArray("landing.clientTypes", v)}
            onRemove={(v) => removeFromStringArray("landing.clientTypes", v)}
          />

          <StringArrayEditor
            title="Zonas / Areas"
            items={areas}
            onAdd={(v) => addToStringArray("landing.areas", v)}
            onRemove={(v) => removeFromStringArray("landing.areas", v)}
          />

          <StringArrayEditor
            title="Lista de servicios"
            items={serviceList}
            onAdd={(v) => addToStringArray("landing.serviceList", v)}
            onRemove={(v) => removeFromStringArray("landing.serviceList", v)}
          />
        </div>
      </section>

      {/* Featured properties */}
      <section className="rounded-xl border border-accent2 bg-white p-4">
        <h2 className="text-lg font-semibold">
          Propiedades destacadas (máx 3)
        </h2>
        <p className="text-sm text-secondary">
          Solo propiedades de este asesor.
        </p>

        <div className="mt-4">
          <FeaturedPicker
            properties={propertiesOptions}
            selectedIds={featuredIds}
            onChange={(ids) =>
              setValue("landing.featuredPropertyIds", ids, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="rounded-xl border border-accent2 bg-white p-4">
        <h2 className="text-lg font-semibold">Testimonios</h2>

        <div className="mt-4 space-y-3">
          {testimoniesFA.fields.map((f, idx) => (
            <div key={f.id} className="rounded-md border p-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm text-secondary">Nombre</label>
                  <input
                    {...register(`landing.testimonies.${idx}.name` as const)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-secondary">Texto</label>
                  <textarea
                    {...register(`landing.testimonies.${idx}.text` as const)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    rows={2}
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => testimoniesFA.remove(idx)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent2"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => testimoniesFA.append({ name: "", text: "" })}
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent2"
          >
            + Agregar testimonio
          </button>
        </div>
      </section>

      {/* Social links */}
      <section className="rounded-xl border border-accent2 bg-white p-4">
        <h2 className="text-lg font-semibold">Redes sociales</h2>

        <div className="mt-4 space-y-3">
          {socialFA.fields.map((f, idx) => (
            <div key={f.id} className="rounded-md border p-3">
              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <label className="text-sm text-secondary">Plataforma</label>
                  <select
                    {...register(
                      `landing.socialMedia.${idx}.platform` as const
                    )}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  >
                    {SocialPlatformSchema.options.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-secondary">Label</label>
                  <input
                    {...register(`landing.socialMedia.${idx}.label` as const)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="WhatsApp"
                  />
                </div>
                <div>
                  <label className="text-sm text-secondary">Value</label>
                  <input
                    {...register(`landing.socialMedia.${idx}.value` as const)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="+595..."
                  />
                </div>
                <div>
                  <label className="text-sm text-secondary">Href</label>
                  <input
                    {...register(`landing.socialMedia.${idx}.href` as const)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => socialFA.remove(idx)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent2"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              socialFA.append({
                platform: "WHATSAPP",
                label: "WhatsApp",
                value: "",
                href: "",
              })
            }
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent2"
          >
            + Agregar red social
          </button>
        </div>
      </section>
    </form>
  );
}

// ---------- small components ----------
function StringArrayEditor({
  title,
  items,
  onAdd,
  onRemove,
}: {
  title: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="rounded-md border p-3">
      <div className="font-medium">{title}</div>

      <div className="mt-2 flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Agregar..."
        />
        <button
          type="button"
          onClick={() => {
            onAdd(value);
            setValue("");
          }}
          className="rounded-md bg-accent1 px-3 py-2 text-sm font-medium text-primary hover:opacity-90"
        >
          Agregar
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {items?.map((it) => (
          <button
            key={it}
            type="button"
            onClick={() => onRemove(it)}
            className="rounded-full bg-accent2 px-3 py-1 text-sm text-secondary hover:opacity-80"
            title="Quitar"
          >
            {it} ✕
          </button>
        ))}
      </div>
    </div>
  );
}

function FeaturedPicker({
  properties,
  selectedIds,
  onChange,
}: {
  properties: PropertyOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    const exists = selectedIds.includes(id);
    if (exists) {
      onChange(selectedIds.filter((x) => x !== id));
      return;
    }
    if (selectedIds.length >= 3) return;
    onChange([...selectedIds, id]);
  }

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  return (
    <div className="space-y-2">
      <div className="text-sm text-secondary">
        Seleccionadas: {selectedIds.length}/3
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {properties.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => toggle(p.id)}
            className={`rounded-md border p-3 text-left hover:bg-accent2 ${
              selectedSet.has(p.id) ? "border-accent1" : "border-accent2"
            }`}
          >
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-secondary">
              {p.city ?? "-"} {p.priceUsd ? `• USD ${p.priceUsd}` : ""}
            </div>
            {selectedSet.has(p.id) ? (
              <div className="mt-1 text-xs text-secondary">Seleccionada</div>
            ) : null}
          </button>
        ))}

        {!properties.length ? (
          <div className="text-sm text-secondary">
            Este asesor todavía no tiene propiedades cargadas.
          </div>
        ) : null}
      </div>
    </div>
  );
}
