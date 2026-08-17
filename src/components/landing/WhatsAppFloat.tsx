"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/cn";
import { buildWhatsAppHref } from "@/lib/whatsapp";

function isContactPath(pathname: string | null) {
  if (!pathname) return false;
  return /^\/(?:[a-z]{2}\/)?contacto(?:\/)?$/.test(pathname);
}

export function WhatsAppFloat() {
  const pathname = usePathname();
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  if (isContactPath(pathname)) return null;

  return (
    <a
      href={buildWhatsAppHref(undefined, locale)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar con un asesor por WhatsApp"
      className={cn(
        "group fixed right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(0,0,0,0.16)] transition-[opacity,transform] duration-300 ease-out",
        "bottom-[calc(80px+env(safe-area-inset-bottom))] md:bottom-[calc(24px+env(safe-area-inset-bottom))]",
        isVisible
          ? "pointer-events-auto scale-100 opacity-100"
          : "pointer-events-none scale-0 opacity-0",
      )}
      data-analytics-event="whatsapp_float_click"
      data-analytics-category="contact"
      data-analytics-label="whatsapp_float"
    >
      <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden whitespace-nowrap rounded-[4px] bg-[var(--carbon)] px-3 py-2 text-[12px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 md:block">
        Hablar con un asesor
      </span>
      <FaWhatsapp size={30} aria-hidden="true" />
    </a>
  );
}
