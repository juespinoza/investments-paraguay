"use client";

import { cn } from "@/lib/cn";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions/set-locate";

type Locale = "en" | "es" | "pt" | "de";

const LOCALES: Array<{ value: Locale; icon: string; label: string }> = [
  { value: "en", icon: "🇺🇸", label: "English" },
  { value: "es", icon: "🇵🇾", label: "Español" },
  { value: "pt", icon: "🇧🇷", label: "Português" },
  { value: "de", icon: "🇩🇪", label: "Deutsch" },
];

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return "en";

  const match = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("locale="));

  const value = match?.split("=")[1];
  return value === "es"
    ? "es"
    : value === "pt"
      ? "pt"
      : value === "de"
        ? "de"
        : "en";
}

export function LocaleSwitcher({
  showLabel = false,
  className,
}: {
  showLabel?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Locale>("en");
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

  function pick(locale: Locale) {
    setOpen(false);
    setSelected(locale);

    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-soft bg-white px-3 text-sm font-medium text-primary disabled:opacity-60"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Select language"
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
          className="absolute right-0 top-full z-50 mt-2 w-16 overflow-hidden rounded-lg border border-soft bg-[rgba(255,253,249,0.98)] shadow-[0_18px_48px_rgba(15,23,38,0.16)] backdrop-blur-xl"
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
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-white disabled:opacity-60 ${
                  active ? "bg-[#f5ecdd] text-primary" : "text-secondary"
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
