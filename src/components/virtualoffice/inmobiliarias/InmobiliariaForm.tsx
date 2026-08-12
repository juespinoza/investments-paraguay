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
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroBackgroundUrl: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactWebsite: string;
  contactAddress: string;
  advisorsTitle: string;
  advisorsSubtitle: string;
  propertiesTitle: string;
  propertiesSubtitle: string;
  featuredPropertyIds: string[];
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
  heroTitle: "",
  heroSubtitle: "",
  heroCtaLabel: "",
  heroCtaHref: "",
  heroBackgroundUrl: "",
  contactTitle: "",
  contactEmail: "",
  contactPhone: "",
  contactWhatsapp: "",
  contactWebsite: "",
  contactAddress: "",
  advisorsTitle: "",
  advisorsSubtitle: "",
  propertiesTitle: "",
  propertiesSubtitle: "",
  featuredPropertyIds: [],
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
  section = "full",
  inmobiliariaId,
  initialData,
  allowUserBootstrap = false,
  propertyOptions = [],
  redirectOnSuccess = true,
  onSuccess,
}: {
  mode: "create" | "edit";
  section?: "full" | "core" | "landing";
  inmobiliariaId?: string;
  initialData?: Partial<FormValues>;
  allowUserBootstrap?: boolean;
  propertyOptions?: Array<{ id: string; title: string; slug: string }>;
  redirectOnSuccess?: boolean;
  onSuccess?: (result: { id: string; values: FormValues }) => void;
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
  const showCore = section !== "landing";
  const showLanding = section !== "core";
  const isFull = section === "full";
  const formTitle =
    mode === "create"
      ? "Nueva inmobiliaria"
      : section === "core"
        ? "Datos operativos del tenant"
        : section === "landing"
          ? "Landing pública"
          : "Editar inmobiliaria";
  const formDescription =
    section === "core"
      ? "Nombre, slug y presentación base de la entidad operativa."
      : section === "landing"
        ? "Hero, contacto, destacados y contenido visible al público."
        : "Identidad pública y estructura base del tenant.";

  const update = (key: keyof FormValues, value: FormValues[keyof FormValues]) =>
    setValues((prev) => ({ ...prev, [key]: value }));
  const toggleFeaturedProperty = (propertyId: string) =>
    setValues((prev) => ({
      ...prev,
      featuredPropertyIds: prev.featuredPropertyIds.includes(propertyId)
        ? prev.featuredPropertyIds.filter((id) => id !== propertyId)
        : [...prev.featuredPropertyIds, propertyId].slice(0, 6),
    }));

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
        body: JSON.stringify(
          isFull
            ? {
                name: values.name.trim(),
                slug: values.slug.trim(),
                description: values.description.trim() || null,
                logoUrl: values.logoUrl.trim() || null,
                landing: {
                  heroTitle: values.heroTitle.trim() || null,
                  heroSubtitle: values.heroSubtitle.trim() || null,
                  heroCtaLabel: values.heroCtaLabel.trim() || null,
                  heroCtaHref: values.heroCtaHref.trim() || null,
                  heroBackgroundUrl: values.heroBackgroundUrl.trim() || null,
                  contactTitle: values.contactTitle.trim() || null,
                  contactEmail: values.contactEmail.trim() || null,
                  contactPhone: values.contactPhone.trim() || null,
                  contactWhatsapp: values.contactWhatsapp.trim() || null,
                  contactWebsite: values.contactWebsite.trim() || null,
                  contactAddress: values.contactAddress.trim() || null,
                  advisorsTitle: values.advisorsTitle.trim() || null,
                  advisorsSubtitle: values.advisorsSubtitle.trim() || null,
                  propertiesTitle: values.propertiesTitle.trim() || null,
                  propertiesSubtitle: values.propertiesSubtitle.trim() || null,
                  featuredPropertyIds: values.featuredPropertyIds,
                },
                user:
                  mode === "create" && allowUserBootstrap && values.createUser
                    ? {
                        name: values.userName.trim() || null,
                        email: values.userEmail.trim(),
                        password: values.userPassword,
                      }
                    : undefined,
              }
            : section === "core"
              ? {
                  mode: "core",
                  name: values.name.trim(),
                  slug: values.slug.trim(),
                  description: values.description.trim() || null,
                  logoUrl: values.logoUrl.trim() || null,
                }
              : {
                  mode: "landing",
                  landing: {
                    heroTitle: values.heroTitle.trim() || null,
                    heroSubtitle: values.heroSubtitle.trim() || null,
                    heroCtaLabel: values.heroCtaLabel.trim() || null,
                    heroCtaHref: values.heroCtaHref.trim() || null,
                    heroBackgroundUrl: values.heroBackgroundUrl.trim() || null,
                    contactTitle: values.contactTitle.trim() || null,
                    contactEmail: values.contactEmail.trim() || null,
                    contactPhone: values.contactPhone.trim() || null,
                    contactWhatsapp: values.contactWhatsapp.trim() || null,
                    contactWebsite: values.contactWebsite.trim() || null,
                    contactAddress: values.contactAddress.trim() || null,
                    advisorsTitle: values.advisorsTitle.trim() || null,
                    advisorsSubtitle: values.advisorsSubtitle.trim() || null,
                    propertiesTitle: values.propertiesTitle.trim() || null,
                    propertiesSubtitle: values.propertiesSubtitle.trim() || null,
                    featuredPropertyIds: values.featuredPropertyIds,
                  },
                },
        ),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "No se pudo guardar.");
        return;
      }

      onSuccess?.({ id: data.id, values });

      if (redirectOnSuccess) {
        router.push(
          mode === "create"
            ? `/virtual-office/inmobiliaria/${data.id}/edit?status=created`
            : `/virtual-office/inmobiliaria/${inmobiliariaId}/edit?status=${
                section === "core"
                  ? "core-updated"
                  : section === "landing"
                    ? "landing-updated"
                    : "updated"
              }`,
        );
        router.refresh();
      }
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
              {formTitle}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
              <span>{formDescription}</span>
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
                : section === "core"
                  ? "Guardar datos operativos"
                  : section === "landing"
                    ? "Guardar landing"
                    : "Guardar cambios"}
          </button>
        </div>
      </div>

      {error ? <InlineAlert type="error" message={error} /> : null}

      {showCore ? (
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
      ) : null}

      {showCore ? (
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
      ) : null}

      {showLanding ? (
      <FormSection
        title="Landing pública"
        description="Controla el mensaje principal y los títulos visibles en la página pública de la inmobiliaria."
      >
        <div className="grid gap-4">
          <Field label="Título principal del hero">
            <input
              value={values.heroTitle}
              onChange={(e) => update("heroTitle", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="Inversiones inmobiliarias con respaldo local"
            />
          </Field>

          <Field label="Subtítulo del hero">
            <textarea
              value={values.heroSubtitle}
              onChange={(e) => update("heroSubtitle", e.target.value)}
              className="min-h-28 w-full rounded-xl border border-zinc-200 px-3 py-2"
              placeholder="Describe la propuesta de valor, el foco geográfico y el tipo de oportunidades que ofrece la inmobiliaria."
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="CTA principal">
              <input
                value={values.heroCtaLabel}
                onChange={(e) => update("heroCtaLabel", e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                placeholder="Ver propiedades"
              />
            </Field>

            <Field label="Destino del CTA" hint="Ancla o URL">
              <input
                value={values.heroCtaHref}
                onChange={(e) => update("heroCtaHref", e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                placeholder="#propiedades"
              />
            </Field>
          </div>

          <Field label="Background del hero" hint="Cloudinary public_id o URL">
            <input
              value={values.heroBackgroundUrl}
              onChange={(e) => update("heroBackgroundUrl", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="/backgrounds/background.png"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Título de asesores">
              <input
                value={values.advisorsTitle}
                onChange={(e) => update("advisorsTitle", e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                placeholder="Equipo de asesores"
              />
            </Field>

            <Field label="Título de propiedades">
              <input
                value={values.propertiesTitle}
                onChange={(e) => update("propertiesTitle", e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-200 px-3"
                placeholder="Propiedades de la inmobiliaria"
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Subtítulo de asesores">
              <textarea
                value={values.advisorsSubtitle}
                onChange={(e) => update("advisorsSubtitle", e.target.value)}
                className="min-h-24 w-full rounded-xl border border-zinc-200 px-3 py-2"
                placeholder="Conectá con profesionales que conocen el mercado y las oportunidades activas."
              />
            </Field>

            <Field label="Subtítulo de propiedades">
              <textarea
                value={values.propertiesSubtitle}
                onChange={(e) => update("propertiesSubtitle", e.target.value)}
                className="min-h-24 w-full rounded-xl border border-zinc-200 px-3 py-2"
                placeholder="Presenta el tipo de inventario y propuesta comercial que la inmobiliaria quiere destacar."
              />
            </Field>
          </div>
        </div>
      </FormSection>
      ) : null}

      {showLanding ? (
      <FormSection
        title="Contacto público"
        description="Estos datos se mostrarán al público para facilitar consultas comerciales y coordinación de visitas."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Título del bloque de contacto">
            <input
              value={values.contactTitle}
              onChange={(e) => update("contactTitle", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="Contacto de la inmobiliaria"
            />
          </Field>

          <Field label="Email público">
            <input
              value={values.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="contacto@inmobiliaria.com"
            />
          </Field>

          <Field label="Teléfono">
            <input
              value={values.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="+595..."
            />
          </Field>

          <Field label="WhatsApp">
            <input
              value={values.contactWhatsapp}
              onChange={(e) => update("contactWhatsapp", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="+595..."
            />
          </Field>

          <Field label="Web">
            <input
              value={values.contactWebsite}
              onChange={(e) => update("contactWebsite", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="https://..."
            />
          </Field>

          <Field label="Dirección">
            <input
              value={values.contactAddress}
              onChange={(e) => update("contactAddress", e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 px-3"
              placeholder="Av. principal, ciudad"
            />
          </Field>
        </div>
      </FormSection>
      ) : null}

      {showLanding && mode === "edit" ? (
        <FormSection
          title="Propiedades destacadas"
          description="Selecciona hasta 6 propiedades activas del tenant para priorizarlas en la landing pública."
        >
          {propertyOptions.length === 0 ? (
            <InlineAlert
              type="info"
              message="Todavía no hay propiedades activas vinculadas a esta inmobiliaria."
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {propertyOptions.map((property) => {
                const checked = values.featuredPropertyIds.includes(property.id);
                return (
                  <label
                    key={property.id}
                    className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFeaturedProperty(property.id)}
                      disabled={!checked && values.featuredPropertyIds.length >= 6}
                    />
                    <span>
                      <span className="block font-medium text-zinc-900">
                        {property.title}
                      </span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        /{property.slug}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </FormSection>
      ) : null}

      {isFull && mode === "create" && allowUserBootstrap ? (
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
