"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { KEY_EVENTS, trackEvent } from "@/lib/analytics";

// Formulario corto para propiedades sin estrategia: el contacto entra como
// lead con la propiedad identificada y se le avisa cuando el análisis esté.
export function StrategyWaitlist({ propertySlug }: { propertySlug: string }) {
  const t = useTranslations("site.strategy");
  const locale = useLocale();
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState({ email: "", whatsapp: "" });
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) return setError(t("pendingNeedName"));
    if (!contact.email.trim() && !contact.whatsapp.trim()) {
      return setError(t("pendingNeedContact"));
    }

    setState("sending");
    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email: contact.email,
          whatsapp: contact.whatsapp,
          propertySlug,
          sourcePage: window.location.pathname,
          notes: t("pendingNotes"),
        }),
      });

      if (!response.ok) {
        setState("idle");
        return setError(t("pendingError"));
      }

      trackEvent(KEY_EVENTS.lead, {
        method: "form",
        lead_type: "strategy_waitlist",
        location: "property_strategy",
        property_slug: propertySlug,
        locale,
      });
      setState("done");
    } catch {
      setState("idle");
      setError(t("pendingError"));
    }
  }

  if (state === "done") {
    return (
      <p className="flex items-start gap-2 text-[15px] leading-7 text-primary" role="status">
        <Check size={18} strokeWidth={2} className="mt-1 shrink-0 text-(--gold)" aria-hidden="true" />
        {t("pendingDone")}
      </p>
    );
  }

  const inputClass =
    "h-11 w-full rounded-xs border border-(--line) bg-white px-3 text-[15px] text-primary outline-none focus:border-(--gold)";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-3 md:grid-cols-3">
      <label className="grid gap-1 text-[13px] text-secondary">
        {t("pendingName")}
        <input
          className={inputClass}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          autoComplete="name"
          required
        />
      </label>
      <label className="grid gap-1 text-[13px] text-secondary">
        {t("pendingEmail")}
        <input
          className={inputClass}
          type="email"
          value={contact.email}
          onChange={(event) => setContact({ ...contact, email: event.target.value })}
          autoComplete="email"
        />
      </label>
      <label className="grid gap-1 text-[13px] text-secondary">
        {t("pendingWhatsapp")}
        <input
          className={inputClass}
          type="tel"
          value={contact.whatsapp}
          onChange={(event) => setContact({ ...contact, whatsapp: event.target.value })}
          autoComplete="tel"
        />
      </label>
      {error ? (
        <p className="text-[14px] text-red-700 md:col-span-3" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex h-12 items-center justify-center rounded-xs bg-(--carbon) px-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--ivory) transition-colors duration-150 hover:bg-(--gold) hover:text-(--carbon) disabled:cursor-not-allowed disabled:opacity-60 md:col-span-3 md:justify-self-start"
      >
        {state === "sending" ? t("pendingSending") : t("pendingSubmit")}
      </button>
    </form>
  );
}
