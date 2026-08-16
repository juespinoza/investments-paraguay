"use client";

import { cn } from "@/lib/cn";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { isAnalyticsEnabled } from "@/lib/analytics";
import { usePathname, useRouter } from "@/i18n/navigation";
import { DEFAULT_LOCALE, type AppLocale } from "@/lib/i18n";

type LocaleOption = { value: AppLocale; label: string };

const LOCALES: LocaleOption[] = [
  { value: "es", label: "ES" },
];

const DISPLAY_LOCALES: Array<
  LocaleOption | { value: "en"; label: string; disabled: true }
> = [
  ...LOCALES,
  // TODO(i18n): Reactivar "en" como AppLocale soportado cuando el contenido
  // esté traducido. Se muestra para preservar la dirección visual solicitada,
  // pero no navega mientras routing solo soporte "es".
  { value: "en", label: "EN", disabled: true },
];

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
  className,
}: {
  showLabel?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selected, setSelected] = useState<AppLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    setSelected(readCookieLocale());
  }, []);

  const selectedLocale = useMemo(() => {
    return LOCALES.find((l) => l.value === selected) ?? LOCALES[0];
  }, [selected]);

  function pick(locale: AppLocale) {
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

  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-2 text-[13px] font-medium uppercase tracking-[0.05em]",
        className,
      )}
      aria-label={`Idioma actual: ${selectedLocale.label}`}
    >
      {DISPLAY_LOCALES.map((locale, index) => {
        const supported = isSupportedLocale(locale.value);
        const active = locale.value === selected;

        return (
          <span key={locale.value} className="inline-flex items-center gap-2">
            <button
              type="button"
              disabled={isPending || !supported}
              onClick={() => {
                if (supported) pick(locale.value);
              }}
              className={cn(
                "text-[13px] font-medium uppercase tracking-[0.05em] transition-colors duration-150 disabled:cursor-default",
                active
                  ? "text-primary"
                  : "text-muted hover:text-primary disabled:hover:text-muted",
                !supported && "opacity-55",
              )}
              aria-current={active ? "true" : undefined}
              aria-disabled={!supported}
              title={
                supported
                  ? locale.label
                  : "TODO(i18n): habilitar cuando exista contenido en inglés."
              }
              data-analytics-event="language_change"
              data-analytics-category="i18n"
              data-analytics-label={locale.value}
            >
              {locale.label}
            </button>
            {index < DISPLAY_LOCALES.length - 1 ? (
              <span aria-hidden className="text-muted opacity-50">
                |
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
