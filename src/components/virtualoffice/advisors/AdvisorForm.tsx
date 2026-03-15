"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, SocialPlatformSchema } from "./schema";
import type { z } from "zod";
import { slugify } from "./utils";
import BaseSection from "./sections/BaseSection";
import { FeaturedPicker } from "./FeaturedPicker";
import { StringArrayEditor } from "./StringArrayEditor";
import {
  updateAdvisorAction,
  createAdvisorAction,
  deleteAdvisorAction,
} from "@/app/api/virtualoffice/advisors/actions";

export type AdvisorFormValues = z.input<typeof FormSchema>;
export type AdvisorFormOutput = z.output<typeof FormSchema>;

type Props = {
  mode: "create" | "edit";
  advisorId?: string;
  initialData?: Partial<AdvisorFormValues>;
  canEditInmobiliariaId?: boolean;
};

type Banner = { type: "success" | "error"; message: string } | null;

function BannerMessage({ banner }: { banner: Banner }) {
  if (!banner) return null;

  const cls =
    banner.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${cls}`}>
      {banner.message}
    </div>
  );
}

export function AdvisorForm({
  mode,
  advisorId,
  initialData,
  canEditInmobiliariaId = false,
}: Props) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  // ========= Defaults (centralizados) =========
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
    [initialData],
  );

  // ========= RHF =========
  const form = useForm<AdvisorFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaults,
    mode: "onBlur",
    shouldFocusError: true,
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isDirty, isSubmitting },
    setFocus,
  } = form;

  // Arrays dinámicos
  const testimoniesFA = useFieldArray({ control, name: "landing.testimonies" });
  const socialFA = useFieldArray({ control, name: "landing.socialMedia" });

  // Watch solo lo necesario
  const fullName = useWatch({ control, name: "fullName" });
  const slug = useWatch({ control, name: "slug" });

  const propertyTypes =
    useWatch({ control, name: "landing.propertyTypes" }) ?? [];
  const clientTypes = useWatch({ control, name: "landing.clientTypes" }) ?? [];
  const areas = useWatch({ control, name: "landing.areas" }) ?? [];
  const serviceList = useWatch({ control, name: "landing.serviceList" }) ?? [];
  const featuredIds =
    useWatch({ control, name: "landing.featuredPropertyIds" }) ?? [];

  // ========= Slug autofill con “touched” =========
  const slugTouchedRef = useRef(false);
  const initialSlugRef = useRef(defaults.slug);

  useEffect(() => {
    if (slugTouchedRef.current) return;
    const name = (fullName ?? "").trim();
    if (!name) return;

    const next = slugify(name);

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

  // ========= Helpers StringArrays (sin watch extra) =========
  const addToArray = useCallback(
    (
      path:
        | "landing.propertyTypes"
        | "landing.clientTypes"
        | "landing.areas"
        | "landing.serviceList",
      value: string,
    ) => {
      const v = value.trim();
      if (!v) return;

      const current = (getValues(path) as string[]) ?? [];
      if (current.includes(v)) return;

      setValue(path as any, [...current, v], {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [getValues, setValue],
  );

  const removeFromArray = useCallback(
    (
      path:
        | "landing.propertyTypes"
        | "landing.clientTypes"
        | "landing.areas"
        | "landing.serviceList",
      value: string,
    ) => {
      const current = (getValues(path) as string[]) ?? [];
      setValue(
        path as any,
        current.filter((x) => x !== value),
        { shouldDirty: true, shouldValidate: true },
      );
    },
    [getValues, setValue],
  );

  // ========= UX: focus al primer error visible =========
  const focusFirstError = useCallback(() => {
    // Prioridad: fullName -> slug -> campos landing comunes
    if (errors.fullName) return setFocus("fullName");
    if (errors.slug) return setFocus("slug");
    // si querés extender, acá agregás más
  }, [errors.fullName, errors.slug, setFocus]);

  // ========= Submit =========
  const onSubmit: SubmitHandler<AdvisorFormValues> = async (values) => {
    setSaving(true);
    setBanner(null);

    try {
      const parsed: AdvisorFormOutput = FormSchema.parse(values);

      let res = null;
      if (mode === "edit" && advisorId !== undefined) {
        res = await updateAdvisorAction(advisorId, parsed);
        if (!res.ok) throw new Error(res.error ?? "No se pudo guardar.");
      } else {
        res = await createAdvisorAction(parsed);
        if (!res.ok) throw new Error(res.error ?? "No se pudo guardar.");
      }

      setBanner({
        type: "success",
        message:
          mode === "create"
            ? "Asesor creado correctamente."
            : "Cambios guardados.",
      });

      if (mode === "create") {
        router.replace(`/virtual-office/asesores/${res.id}/edit`);
        return;
      }
      router.refresh();
    } catch (e: any) {
      setBanner({ type: "error", message: e?.message ?? "Error" });
      focusFirstError();
    } finally {
      setSaving(false);
    }
  };

  // ========= Delete =========
  const onDelete = useCallback(async () => {
    if (!advisorId) return;

    const ok = confirm(
      "¿Seguro que querés eliminar este asesor? (soft delete)",
    );
    if (!ok) return;

    setSaving(true);
    setBanner(null);

    try {
      const res = await deleteAdvisorAction(advisorId);
      if (!res.ok) throw new Error(res.error ?? "No se pudo eliminar.");

      router.replace("/virtual-office/asesores");
      router.refresh();
    } catch (e: any) {
      setBanner({ type: "error", message: e?.message ?? "Error" });
    } finally {
      setSaving(false);
    }
  }, [advisorId, router]);

  const disableSave = saving || isSubmitting || !isDirty;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sticky action bar (real UX) */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-zinc-200 bg-white/85 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {mode === "create" ? "Nuevo asesor" : "Editar asesor"}
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Landing · redes · testimonios · destacadas (máx 3)
              {isDirty ? (
                <span className="ml-2 font-medium text-zinc-900">
                  • Cambios sin guardar
                </span>
              ) : null}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {mode === "edit" ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={saving}
                className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                Eliminar
              </button>
            ) : null}

            <button
              type="submit"
              disabled={disableSave}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>

      <BannerMessage banner={banner} />

      {/* Base */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <BaseSection
          register={register}
          formState={form.formState}
          setValue={setValue}
          slugify={slugify}
          slugTouchedRef={slugTouchedRef}
          canEditInmobiliariaId={canEditInmobiliariaId}
        />
        {/* Tip de UX: si querés mostrar error de slug/fullName arriba */}
        {(errors.fullName || errors.slug) && (
          <p className="mt-3 text-sm text-red-700">
            Revisá los campos marcados. (Nombre completo / Slug)
          </p>
        )}
      </section>

      {/* About */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-semibold">About (Landing)</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field
            label="Imagen (Cloudinary public_id o URL)"
            hint="Ej: profile_xxx"
          >
            <input
              {...register("landing.aboutImageUrl")}
              className="input"
              placeholder="profile_xxx"
            />
          </Field>

          <Field label="Título" hint="Ej: Sobre mí">
            <input
              {...register("landing.aboutTitle")}
              className="input"
              placeholder="Sobre mí"
            />
          </Field>

          <Field label="Fecha inicio">
            <input
              type="date"
              {...register("landing.startDate")}
              className="input"
            />
          </Field>

          <Field label="Empresa" hint="Ej: SkyOne">
            <input
              {...register("landing.company")}
              className="input"
              placeholder="SkyOne"
            />
          </Field>

          <Field label="Descripción (opcional)" className="md:col-span-2">
            <textarea
              {...register("landing.aboutDescription")}
              className="textarea"
              rows={2}
            />
          </Field>

          <Field label="Párrafo 1" className="md:col-span-2">
            <textarea
              {...register("landing.aboutParagraph1")}
              className="textarea"
              rows={3}
            />
          </Field>

          <Field label="Párrafo 2" className="md:col-span-2">
            <textarea
              {...register("landing.aboutParagraph2")}
              className="textarea"
              rows={3}
            />
          </Field>
        </div>
      </section>

      {/* Services */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-semibold">Servicios (Landing)</h2>

        <div className="mt-4 grid gap-4">
          <Field label="Servicios - párrafo 1">
            <textarea
              {...register("landing.servicesParagraph1")}
              className="textarea"
              rows={3}
            />
          </Field>

          <Field label="Servicios - párrafo 2">
            <textarea
              {...register("landing.servicesParagraph2")}
              className="textarea"
              rows={3}
            />
          </Field>

          <StringArrayEditor
            title="Tipos de propiedad"
            items={propertyTypes}
            onAdd={(v) => addToArray("landing.propertyTypes", v)}
            onRemove={(v) => removeFromArray("landing.propertyTypes", v)}
          />

          <StringArrayEditor
            title="Tipos de clientes"
            items={clientTypes}
            onAdd={(v) => addToArray("landing.clientTypes", v)}
            onRemove={(v) => removeFromArray("landing.clientTypes", v)}
          />

          <StringArrayEditor
            title="Zonas / Áreas"
            items={areas}
            onAdd={(v) => addToArray("landing.areas", v)}
            onRemove={(v) => removeFromArray("landing.areas", v)}
          />

          <StringArrayEditor
            title="Lista de servicios"
            items={serviceList}
            onAdd={(v) => addToArray("landing.serviceList", v)}
            onRemove={(v) => removeFromArray("landing.serviceList", v)}
          />
        </div>
      </section>

      {/* Featured properties */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-semibold">
          Propiedades destacadas (máx 3)
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Solo propiedades de este asesor.
        </p>

        <div className="mt-4">
          <FeaturedPicker
            advisorId={mode === "edit" ? advisorId : undefined}
            selectedIds={featuredIds}
            onChange={(ids) =>
              setValue("landing.featuredPropertyIds", ids, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            max={3}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-semibold">Testimonios</h2>

        <div className="mt-4 space-y-3">
          {testimoniesFA.fields.map((f, idx) => (
            <div key={f.id} className="rounded-xl border border-zinc-200 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Nombre">
                  <input
                    {...register(`landing.testimonies.${idx}.name` as const)}
                    className="input"
                    placeholder="Nombre del cliente"
                  />
                </Field>

                <Field label="Texto" className="md:col-span-2">
                  <textarea
                    {...register(`landing.testimonies.${idx}.text` as const)}
                    className="textarea"
                    rows={2}
                    placeholder="Comentario del cliente..."
                  />
                </Field>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => testimoniesFA.remove(idx)}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => testimoniesFA.append({ name: "", text: "" })}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            + Agregar testimonio
          </button>
        </div>
      </section>

      {/* Social links */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-semibold">Redes sociales</h2>

        <div className="mt-4 space-y-3">
          {socialFA.fields.map((f, idx) => (
            <div key={f.id} className="rounded-xl border border-zinc-200 p-4">
              <div className="grid gap-3 md:grid-cols-4">
                <Field label="Plataforma">
                  <select
                    {...register(
                      `landing.socialMedia.${idx}.platform` as const,
                    )}
                    className="input"
                  >
                    {SocialPlatformSchema.options.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Label">
                  <input
                    {...register(`landing.socialMedia.${idx}.label` as const)}
                    className="input"
                    placeholder="WhatsApp"
                  />
                </Field>

                <Field label="Value">
                  <input
                    {...register(`landing.socialMedia.${idx}.value` as const)}
                    className="input"
                    placeholder="+595..."
                  />
                </Field>

                <Field label="Href">
                  <input
                    {...register(`landing.socialMedia.${idx}.href` as const)}
                    className="input"
                    placeholder="https://..."
                  />
                </Field>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => socialFA.remove(idx)}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
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
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            + Agregar red social
          </button>
        </div>
      </section>

      {/* util: clases locales */}
      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(228 228 231);
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: rgb(161 161 170);
        }
        .textarea {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(228 228 231);
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .textarea:focus {
          border-color: rgb(161 161 170);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className ?? ""}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-zinc-800">{label}</span>
        {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}
