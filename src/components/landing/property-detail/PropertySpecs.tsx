import { Bath, Bed, Building2, Maximize2 } from "lucide-react";

type Spec = {
  label: string;
  value: string | null;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

function textValue(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized || null;
}

function numberValue(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function PropertySpecs({
  propertyType,
  bedrooms,
  bathrooms,
  areaM2,
}: {
  propertyType?: string | null;
  bedrooms?: string | null;
  bathrooms?: number | null;
  areaM2?: number | null;
}) {
  const validBathrooms = numberValue(bathrooms);
  const validAreaM2 = numberValue(areaM2);

  const specs: Spec[] = [
    { label: "Tipo", value: textValue(propertyType), icon: Building2 },
    { label: "Habitaciones", value: textValue(bedrooms), icon: Bed },
    {
      label: "Baños",
      value: validBathrooms !== null ? String(validBathrooms) : null,
      icon: Bath,
    },
    {
      label: "Superficie",
      value:
        validAreaM2 !== null
          ? `${validAreaM2.toLocaleString("es-PY")} m²`
          : null,
      icon: Maximize2,
    },
  ].filter((spec) => spec.value);

  if (!specs.length) return null;

  return (
    <section className="px-4 pb-4">
      <div className="container-page">
        <div className="surface-card grid gap-4 rounded-[1.75rem] p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div key={spec.label} className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-soft bg-(--stone) text-accent1">
                  <Icon size={19} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                    {spec.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {spec.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
