"use client";

import { cn } from "@/lib/cn";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { isAnalyticsEnabled } from "@/lib/analytics";
import { usePathname, useRouter } from "@/i18n/navigation";
import { DEFAULT_LOCALE, type AppLocale } from "@/lib/i18n";

type LocaleOption = { value: AppLocale; icon: string; label: string };

const LOCALES: LocaleOption[] = [
  { value: "es", icon: "🇵🇾", label: "Español" },
];

// TODO(i18n): Reactivar estas opciones cuando sus contenidos estén traducidos.
// { value: "en", icon: "🇺🇸", label: "English" }
// { value: "pt", icon: "🇧🇷", label: "Português" }
// { value: "de", icon: "🇩🇪", label: "Deutsch" }

function isSupportedLocale(value: string | undefined): value is AppLocale {
  return LOCALES.some((locale) => locale.value === value);
}

function readCookieLocale(): AppLocale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;

  const match = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("locale="));

  const value = match?.split("=")[1];
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

export function LocaleSwitcher({
  showLabel = false,
  className,
}: {
  showLabel?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AppLocale>(DEFAULT_LOCALE);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelected(readCookieLocale());
  }, []);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }

    function onDocKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, []);

  const selectedLocale = useMemo(() => {
    return LOCALES.find((l) => l.value === selected) ?? LOCALES[0];
  }, [selected]);

  function pick(locale: AppLocale) {
    setOpen(false);
    setSelected(locale);

    if (typeof window !== "undefined" && isAnalyticsEnabled() && window.gtag) {
      window.gtag("event", "language_change", {
        event_category: "i18n",
        event_label: locale,
      });
    }

    startTransition(async () => {
      const query = searchParams.toString();
      const nextPath = query ? `${pathname}?${query}` : pathname;
      router.replace(nextPath, { locale });
    });
  }

  if (LOCALES.length === 1) {
    return (
      <div className={cn("relative inline-flex", className)}>
        <div
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-soft bg-[var(--ivory)] px-3 text-sm font-medium text-primary"
          aria-label="Idioma disponible: Español"
          title="Idioma disponible: Español"
        >
          <span className="text-base">{selectedLocale.icon}</span>
          {showLabel ? (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              {selectedLocale.value}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-soft bg-[var(--ivory)] px-3 text-sm font-medium text-primary disabled:opacity-60"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Select language"
        data-analytics-event="locale_switcher_open"
        data-analytics-category="i18n"
        data-analytics-label={selectedLocale.value}
      >
        <span className="text-base">{selectedLocale.icon}</span>
        {showLabel ? (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            {selectedLocale.value}
          </span>
        ) : null}
        <span aria-hidden className="text-xs text-secondary">
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Select language"
          className="absolute right-0 top-full z-50 mt-2 w-16 overflow-hidden rounded-lg border border-soft bg-[rgba(250,250,248,0.98)] shadow-[0_18px_48px_rgba(10,10,10,0.16)] backdrop-blur-xl"
        >
          {LOCALES.map((l) => {
            const active = l.value === selected;
            return (
              <button
                key={l.value}
                type="button"
                role="menuitem"
                onClick={() => pick(l.value)}
                disabled={isPending}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[var(--stone)] disabled:opacity-60 ${
                  active ? "bg-[var(--stone)] text-primary" : "text-secondary"
                }`}
                aria-label={l.label}
              >
                <span className="text-base">{l.icon}</span>
                {active ? (
                  <span className="text-lg text-accent1" aria-hidden>
                    •
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
