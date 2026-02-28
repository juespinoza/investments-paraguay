"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { setLocale } from "@/app/actions/set-locate";

type Locale = "en" | "es";

const LOCALES: Array<{ value: Locale; icon: string; label: string }> = [
  { value: "en", icon: "🇺🇸", label: "English" },
  { value: "es", icon: "🇵🇾", label: "Español" },
];

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return "en";

  const match = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("locale="));

  const value = match?.split("=")[1];
  return value === "es" ? "es" : "en";
}

export function LocaleSwitcher() {
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
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        disabled={isPending}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-2 text-md disabled:opacity-60"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Select language"
      >
        {/* <Globe size={16} /> */}
        <span className="text-base">{selectedLocale.icon}</span>
        <span aria-hidden className="text-md">
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Select language"
          className="absolute right-0 top-full z-50 mt-2 w-16 overflow-hidden rounded-md bg-white shadow-lg"
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
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-md hover:bg-gray-50 disabled:opacity-60 ${
                  active ? "bg-gray-100 text-green-500" : ""
                }`}
                aria-label={l.label}
              >
                <span className="text-base">{l.icon}</span>
                {active ? (
                  <span className="text-2xl" aria-hidden>
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
