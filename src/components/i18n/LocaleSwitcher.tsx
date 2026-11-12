"use client";

import { cn } from "@/lib/cn";
import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { isAnalyticsEnabled } from "@/lib/analytics";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  toSupportedLocale,
  type SupportedLocale,
} from "@/lib/i18n";

function rememberLocale(locale: SupportedLocale) {
  document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export function LocaleSwitcher({
  className,
}: {
  showLabel?: boolean;
  className?: string;
}) {
  const t = useTranslations("site.locale");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const current = toSupportedLocale(useLocale());

  function pick(locale: SupportedLocale) {
    if (locale === current) return;

    rememberLocale(locale);

    if (typeof window !== "undefined" && isAnalyticsEnabled() && window.gtag) {
      window.gtag("event", "language_change", {
        event_category: "i18n",
        event_label: locale,
        from_locale: current,
      });
    }

    startTransition(() => {
      // Se lee al hacer clic (y no con useSearchParams) para que el
      // selector no impida generar las páginas de forma estática.
      const query = window.location.search.replace(/^\?/, "");
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
      aria-label={t("current", { locale: LOCALE_LABELS[current] })}
    >
      {SUPPORTED_LOCALES.map((locale, index) => {
        const active = locale === current;

        return (
          <span key={locale} className="inline-flex items-center gap-2">
            <button
              type="button"
              lang={locale}
              disabled={isPending}
              onClick={() => pick(locale)}
              className={cn(
                "text-[13px] font-medium uppercase tracking-[0.05em] transition-colors duration-150 disabled:cursor-wait",
                active ? "text-primary" : "text-muted hover:text-primary",
              )}
              aria-current={active ? "true" : undefined}
            >
              {LOCALE_LABELS[locale]}
            </button>
            {index < SUPPORTED_LOCALES.length - 1 ? (
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
