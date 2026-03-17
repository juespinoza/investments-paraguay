"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocaleSwitcher } from "../i18n/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function NavBar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: t("header.home") },
    { href: "/bienes-raices", label: t("header.realEstate") },
    { href: "/blog", label: t("header.blog") },
  ];

  // Cerrar con Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Bloquear scroll cuando el menu está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 px-3 py-3 md:px-4">
      <div className="container-page">
        <div className="border border-[rgba(201,164,92,0.18)] bg-[rgba(255,252,246,0.84)] px-3 py-3 shadow-[0_18px_48px_rgba(15,23,38,0.08)] backdrop-blur-xl md:px-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3"
              onClick={close}
              data-analytics-event="navigation_click"
              data-analytics-category="header"
              data-analytics-label="logo"
              data-analytics-location="desktop"
            >
              <Image
                src="/images/logo.png"
                alt="Investments Paraguay"
                width={180}
                height={59}
                className="h-9 w-auto min-w-[132px] object-contain md:h-10"
                priority
              />
            </Link>

            <div className="flex items-center gap-2 md:hidden">
              <LocaleSwitcher />
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center border border-soft bg-white text-primary rounded-lg"
                aria-label={t("header.openMenu")}
              >
                <Menu size={18} />
              </button>
            </div>

            <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 md:flex">
              <nav className="flex h-10 items-center gap-1 rounded-lg border border-soft bg-white/70 p-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  className={cn(
                    "inline-flex h-8 items-center rounded-md px-3.5 text-sm font-medium leading-none whitespace-nowrap transition lg:px-4",
                    isActive(link.href)
                      ? "bg-primary text-white shadow-[0_12px_28px_rgba(15,23,38,0.18)]"
                      : "text-primary hover:bg-white",
                  )}
                  href={link.href}
                  data-analytics-event="navigation_click"
                  data-analytics-category="header"
                  data-analytics-label={link.href}
                  data-analytics-location="desktop"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <LocaleSwitcher showLabel className="shrink-0" />

              <Link
                href="https://wa.me/595985444801"
                target="_blank"
                className="group inline-flex h-10 items-center gap-2 rounded-lg border border-[rgba(201,164,92,0.28)] bg-[linear-gradient(135deg,#fffdf8_0%,#f6ebdc_100%)] px-4"
                data-analytics-event="cta_click"
                data-analytics-category="header"
                data-analytics-label="whatsapp_primary"
                data-analytics-location="desktop"
              >
                <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-accent1 xl:block">
                  {t("header.ctaLabel")}
                </span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold leading-none text-primary">
                  {t("header.cta")}
                  <ArrowUpRight
                    size={15}
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <>
          <button
            aria-label={t("header.closeMenu")}
            className="fixed inset-0 z-40 bg-[#0f1726]/45 backdrop-blur-sm"
            onClick={close}
          />

          <div className="fixed inset-x-3 top-3 z-50 border border-[rgba(201,164,92,0.18)] bg-[linear-gradient(180deg,#fffdf9_0%,#f4ecdf_100%)] p-4 shadow-[0_28px_80px_rgba(15,23,38,0.24)] md:hidden">
            <div className="flex items-center justify-between gap-4 border-b border-soft pb-4">
              <div className="min-w-0">
                <Image
                  src="/images/logo.png"
                  alt="Investments Paraguay"
                  width={150}
                  height={49}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-10 w-10 items-center justify-center border border-soft bg-white text-primary rounded-lg"
                aria-label={t("header.closeMenu")}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-b border-soft pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent1">
                  {t("header.localeLabel")}
                </p>
                <p className="mt-1 text-sm text-secondary">
                  {t("header.localeDescription")}
                </p>
              </div>
              <LocaleSwitcher showLabel />
            </div>

            <nav className="mt-4 flex flex-col gap-2">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  className={cn(
                    "rounded-md border border-soft border-l-4 px-4 py-3 transition",
                    isActive(link.href)
                      ? "border-l-[var(--ip-accent1)] bg-[#f5ecdd]"
                      : "border-l-transparent bg-white/82",
                  )}
                  href={link.href}
                  onClick={close}
                  data-analytics-event="navigation_click"
                  data-analytics-category="header"
                  data-analytics-label={link.href}
                  data-analytics-location="mobile_menu"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-medium text-primary">
                      {link.label}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent1">
                      0{index + 1}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>

            <Link
              href="https://wa.me/595985444801"
              target="_blank"
              className="btn-primary mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg"
              data-analytics-event="cta_click"
              data-analytics-category="header"
              data-analytics-label="whatsapp_primary"
              data-analytics-location="mobile_menu"
            >
              {t("header.cta")}
              <ArrowUpRight size={16} />
            </Link>

            <p className="mt-4 text-xs leading-5 text-secondary">
              {t("header.tagline")}
            </p>
          </div>
        </>
      )}
    </header>
  );
}
