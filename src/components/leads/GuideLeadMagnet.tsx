"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BookOpen, Check, Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { KEY_EVENTS, trackEvent } from "@/lib/analytics";

// PDF servido desde /public. Al actualizar la guía, reemplazar este archivo.
export const GUIDE_PDF_PATH = "/guias/guia-invertir-departamentos-asuncion.pdf";

// Quien ya dejó sus datos ve directamente el botón de descarga.
const UNLOCK_STORAGE_KEY = "ip_guide_unlocked";

export type GuideLocation = "home" | "property" | "blog" | "about" | "zone";

function readUnlocked() {
  try {
    return window.localStorage.getItem(UNLOCK_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberUnlocked() {
  try {
    window.localStorage.setItem(UNLOCK_STORAGE_KEY, "1");
  } catch {
    // Navegación privada o almacenamiento bloqueado: no pasa nada.
  }
}

export function GuideLeadMagnet({
  location,
  propertySlug,
  variant = "section",
}: {
  location: GuideLocation;
  propertySlug?: string;
  // "section": banda a todo el ancho (home, Nosotros, blog).
  // "card": tarjeta dentro de una columna (fichas, artículos).
  variant?: "section" | "card";
}) {
  const t = useTranslations("site.guide");
  const locale = useLocale();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(readUnlocked());
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError(t("needName"));
      return;
    }

    if (!email.trim() && !whatsapp.trim()) {
      setError(t("needContact"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          whatsapp,
          propertySlug,
          sourcePage: window.location.pathname,
          notes: t("notes"),
        }),
      });

      if (!response.ok) {
        setError(t("error"));
        return;
      }

      trackEvent(KEY_EVENTS.lead, {
        method: "form",
        lead_type: "guide",
        location: `guide_${location}`,
        property_slug: propertySlug,
        locale,
      });
      rememberUnlocked();
      setUnlocked(true);
      setJustUnlocked(true);
    } catch {
      setError(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  const languageNote = t("languageNote");
  const isCard = variant === "card";

  const intro = (
    <div>
      <p className="mb-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-(--gold)">
        <BookOpen size={15} strokeWidth={1.8} aria-hidden="true" />
        {t("eyebrow")}
      </p>
      <h2
        className={cn(
          "font-cormorant font-normal leading-[1.15] text-primary",
          isCard ? "text-[26px]" : "text-[28px] md:text-[40px]",
        )}
      >
        {t("title")}
      </h2>
      <p className="mt-3 text-[15px] leading-7 text-secondary">
        {t("description")}
      </p>
      <ul className="mt-5 space-y-2.5">
        {(["point1", "point2", "point3"] as const).map((key) => (
          <li
            key={key}
            className="flex items-start gap-2.5 text-[14px] leading-6 text-primary"
          >
            <Check
              size={16}
              strokeWidth={2}
              className="mt-1 shrink-0 text-(--gold)"
              aria-hidden="true"
            />
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>
      {languageNote ? (
        <p className="mt-4 text-[12px] font-medium text-muted">{languageNote}</p>
      ) : null}
    </div>
  );

  const downloadButton = (
    <a
      href={GUIDE_PDF_PATH}
      download
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xs bg-(--gold) px-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--carbon) transition-colors duration-150 hover:bg-(--carbon) hover:text-(--ivory)"
      data-analytics-event="guide_download"
      data-analytics-category="lead_magnet"
      data-analytics-location={`guide_${location}`}
    >
      <Download size={16} strokeWidth={1.8} aria-hidden="true" />
      {t("download")}
    </a>
  );

  const inputClass =
    "h-11 w-full rounded-xs border border-soft bg-white/80 px-3 text-sm outline-none transition-colors focus:border-(--gold)";

  const form = unlocked ? (
    <div className="grid gap-3">
      {justUnlocked ? (
        <p
          role="status"
          className="rounded-sm bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          {t("success")}
        </p>
      ) : null}
      {downloadButton}
    </div>
  ) : (
    <form onSubmit={onSubmit} className="grid gap-3" noValidate>
      <input
        required
        minLength={2}
        value={fullName}
        onChange={(event) => setFullName(event.currentTarget.value)}
        className={inputClass}
        placeholder={t("name")}
        aria-label={t("name")}
        autoComplete="name"
      />
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        className={inputClass}
        placeholder={t("email")}
        aria-label={t("email")}
        autoComplete="email"
      />
      <input
        type="tel"
        value={whatsapp}
        onChange={(event) => setWhatsapp(event.currentTarget.value)}
        className={inputClass}
        placeholder={t("whatsapp")}
        aria-label={t("whatsapp")}
        autoComplete="tel"
      />
      <p className="text-[12px] text-muted">{t("contactHint")}</p>

      {error ? (
        <p
          role="alert"
          className="rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 items-center justify-center rounded-xs bg-(--carbon) px-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--ivory) transition-colors duration-150 hover:bg-(--gold) hover:text-(--carbon) disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t("sending") : t("submit")}
      </button>
      <p className="text-[11px] leading-5 text-muted">{t("privacy")}</p>
    </form>
  );

  if (isCard) {
    return (
      <aside
        id="guia"
        className="rounded-lg border border-soft bg-(--stone) p-6 md:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {intro}
          <div className="self-end">{form}</div>
        </div>
      </aside>
    );
  }

  return (
    <section id="guia" className="bg-(--stone) px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-16">
        {intro}
        <div className="rounded-lg border border-soft bg-(--ivory) p-6 shadow-[0_18px_48px_rgba(10,10,10,0.08)] md:p-8">
          {form}
        </div>
      </div>
    </section>
  );
}
