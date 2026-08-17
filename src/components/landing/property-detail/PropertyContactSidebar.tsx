"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ImageCloudinary } from "@/components/ui/ImageCloudinary";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type Advisor = {
  slug: string;
  fullName: string;
  headline: string | null;
  photoUrl: string | null;
  whatsapp: string | null;
  phone: string | null;
};

type PropertyContactSidebarProps = {
  priceUsd: number | null;
  roiAnnualPct: number | null;
  propertySlug: string;
  advisor: Advisor | null;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatPrice(priceUsd: number | null) {
  if (priceUsd === null) return "Precio a consultar";

  return `USD ${priceUsd.toLocaleString("en-US")}`;
}

function formatRoi(roiAnnualPct: number | null) {
  if (roiAnnualPct === null) return null;

  return `ROI ~${roiAnnualPct.toLocaleString("es-PY", {
    maximumFractionDigits: 1,
  })}% anual`;
}

export function PropertyContactSidebar({
  priceUsd,
  roiAnnualPct,
  propertySlug,
  advisor,
}: PropertyContactSidebarProps) {
  const locale = useLocale();
  const [formOpen, setFormOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const roi = formatRoi(roiAnnualPct);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          notes,
          propertySlug,
          advisorSlug: advisor?.slug,
          sourcePage: `/bienes-raices/propiedades/${propertySlug}`,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({
          type: "error",
          text: data?.error ?? "No pudimos enviar tu consulta.",
        });
        return;
      }

      setStatus({
        type: "success",
        text: "Consulta enviada. Te contactaremos a la brevedad.",
      });
      setFullName("");
      setEmail("");
      setNotes("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <aside className="rounded-lg border border-soft bg-(--ivory) p-6 shadow-[0_18px_48px_rgba(10,10,10,0.08)]">
      <p className="font-cormorant text-[32px] font-normal leading-none text-primary">
        {formatPrice(priceUsd)}
      </p>

      {roi ? (
        <span className="mt-4 inline-flex rounded-xs bg-[rgba(191,168,130,0.22)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-(--carbon)">
          {roi}
        </span>
      ) : null}

      <div className="my-6 h-px bg-(--line)" />

      {advisor ? (
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-soft bg-(--stone) text-sm font-semibold text-primary">
            {advisor.photoUrl ? (
              <ImageCloudinary
                imageUrl={advisor.photoUrl}
                alt={advisor.fullName}
              />
            ) : (
              initials(advisor.fullName)
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-primary">
              {advisor.fullName}
            </p>
            <p className="mt-0.5 text-[12px] text-muted">
              Asesora inmobiliaria
            </p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm font-semibold text-primary">
            Investments Paraguay
          </p>
          <p className="mt-0.5 text-[12px] text-muted">Asesoría inmobiliaria</p>
        </div>
      )}

      <div className="mt-6 grid gap-3">
        <a
          href={buildWhatsAppHref(
            advisor?.whatsapp ?? advisor?.phone ?? undefined,
            locale,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xs bg-(--gold) px-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--carbon) transition-colors duration-150 hover:bg-(--carbon) hover:text-(--ivory)"
        >
          <FaWhatsapp size={17} aria-hidden="true" />
          Consultar por WhatsApp
        </a>

        <button
          type="button"
          onClick={() => setFormOpen((current) => !current)}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xs border border-(--line) px-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-primary transition-colors duration-150 hover:border-(--gold) hover:text-(--gold)"
          aria-expanded={formOpen}
        >
          <Send size={15} strokeWidth={1.8} aria-hidden="true" />
          Enviar mensaje
        </button>
      </div>

      {formOpen ? (
        <form onSubmit={onSubmit} className="mt-5 grid gap-3">
          <input
            required
            value={fullName}
            onChange={(event) => setFullName(event.currentTarget.value)}
            className="h-11 rounded-xs border border-soft bg-white/80 px-3 text-sm outline-none transition-colors focus:border-(--gold)"
            placeholder="Nombre"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            className="h-11 rounded-xs border border-soft bg-white/80 px-3 text-sm outline-none transition-colors focus:border-(--gold)"
            placeholder="Email"
          />
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.currentTarget.value)}
            className="min-h-24 resize-none rounded-xs border border-soft bg-white/80 px-3 py-3 text-sm outline-none transition-colors focus:border-(--gold)"
            placeholder="Mensaje"
            rows={3}
          />

          {status ? (
            <p
              className={
                status.type === "success"
                  ? "rounded-sm bg-emerald-50 px-3 py-2 text-xs text-emerald-700"
                  : "rounded-sm bg-red-50 px-3 py-2 text-xs text-red-700"
              }
            >
              {status.text}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xs bg-(--carbon) px-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-(--ivory) transition-colors duration-150 hover:bg-(--gold) hover:text-(--carbon) disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Enviando..." : "Enviar consulta"}
          </button>
        </form>
      ) : null}

      <p className="mt-5 text-[11px] leading-5 text-muted">
        Tus datos se usan solo para responder tu consulta.
      </p>
    </aside>
  );
}
