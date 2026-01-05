interface BaseSectionProps {
  register: any;
  formState: any;
  setValue: any;
  slugify: (value: string) => string;
  slugTouchedRef: React.MutableRefObject<boolean>;
  canEditInmobiliariaId: boolean;
}

export default function BaseSection({
  register,
  formState,
  setValue,
  slugify,
  slugTouchedRef,
  canEditInmobiliariaId,
}: BaseSectionProps) {
  return (
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
              onBlur: (e: any) => {
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
  );
}
