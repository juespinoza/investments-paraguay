// src/components/virtualoffice/advisors/AdvisorForm.tsx
"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, SocialPlatformSchema } from "./schema";
import { slugify } from "./utils";
import { useWatch } from "react-hook-form";
import { FeaturedPicker } from "./FeaturedPicker";
import { StringArrayEditor } from "./StringArrayEditor";
import BaseSection from "./sections/BaseSection";

export type AdvisorFormValues = z.input<typeof FormSchema>; // lo que RHF maneja
export type AdvisorFormOutput = z.output<typeof FormSchema>; // lo que Zod entrega (slug transformado)

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
  canEditInmobiliariaId?: boolean; // true para ADMIN
};

export function AdvisorForm({
  mode,
  advisorId,
  initialData,
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
  //   const propertyTypes = watch("landing.propertyTypes") ?? [];
  const propertyTypes =
    useWatch({ control, name: "landing.propertyTypes" }) ?? [];
  //   const clientTypes = watch("landing.clientTypes") ?? [];
  const clientTypes = useWatch({ control, name: "landing.clientTypes" }) ?? [];
  //   const areas = watch("landing.areas") ?? [];
  const areas = useWatch({ control, name: "landing.areas" }) ?? [];
  //   const serviceList = watch("landing.serviceList") ?? [];
  const serviceList = useWatch({ control, name: "landing.serviceList" }) ?? [];
  //   const featuredIds = watch("landing.featuredPropertyIds") ?? [];
  const featuredIds =
    useWatch({ control, name: "landing.featuredPropertyIds" }) ?? [];

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

  const onFeaturedChange = useCallback(
    (ids: string[]) => {
      setValue("landing.featuredPropertyIds", ids, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

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
      <BaseSection
        register={register}
        formState={formState}
        setValue={setValue}
        slugify={slugify}
        slugTouchedRef={slugTouchedRef}
        canEditInmobiliariaId={canEditInmobiliariaId}
      />

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
            advisorId={mode === "edit" ? advisorId : undefined}
            selectedIds={featuredIds}
            onChange={onFeaturedChange}
            max={3}
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
