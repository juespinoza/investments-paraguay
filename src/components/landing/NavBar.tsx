"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { LocaleSwitcher } from "../i18n/LocaleSwitcher";
import { cn } from "@/lib/cn";
import { Link, usePathname } from "@/i18n/navigation";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const HEADER_BORDER = "border-[rgba(191,168,130,0.35)]";
const ITEM_BORDER = "border-[rgba(191,168,130,0.28)]";
const ITEM_DIVIDER = "divide-[rgba(191,168,130,0.28)]";

export function NavBar() {
  const t = useTranslations();
  const locale = useLocale();
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

  const navLinkClass = (href: string) =>
    cn(
      "text-[13px] font-medium uppercase tracking-[0.03em] transition-colors duration-150",
      isActive(href) ? "text-primary" : "text-muted hover:text-primary",
    );

  const ctaClass =
    "inline-flex items-center justify-center rounded-xs border border-current px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-primary transition-colors duration-150 hover:bg-(--carbon) hover:text-(--ivory)";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b-[0.5px] bg-(--ivory)",
        HEADER_BORDER,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          onClick={close}
          data-analytics-event="navigation_click"
          data-analytics-category="header"
          data-analytics-label="logo"
          data-analytics-location="desktop"
        >
          <div className="brand">
            Investments<span>Paraguay</span>
          </div>
        </Link>

        <div className="flex items-center gap-3 md:hidden">
          <LocaleSwitcher />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xs border border-(--line) bg-transparent text-primary transition-colors duration-150 hover:bg-(--carbon) hover:text-(--ivory)"
            aria-label={t("header.openMenu")}
          >
            <Menu size={18} />
          </button>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-8 md:flex">
          <nav className="flex items-center gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                className={navLinkClass(link.href)}
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
            href={buildWhatsAppHref(undefined, locale)}
            target="_blank"
            className={ctaClass}
            data-analytics-event="cta_click"
            data-analytics-category="header"
            data-analytics-label="whatsapp_primary"
            data-analytics-location="desktop"
          >
            {t("header.cta")}
          </Link>
        </div>
      </div>

      {open && (
        <>
          <button
            aria-label={t("header.closeMenu")}
            className="fixed inset-0 z-40 bg-[rgba(10,10,10,0.28)] md:hidden"
            onClick={close}
          />

          <div
            className={cn(
              "fixed inset-x-0 top-16 z-50 border-b-[0.5px] bg-(--ivory) px-4 md:hidden",
              HEADER_BORDER,
            )}
          >
            <div
              className={cn(
                "flex h-16 items-center justify-between gap-4 border-b-[0.5px]",
                ITEM_BORDER,
              )}
            >
              <div className="min-w-0">
                {/* <Image
                  src="/images/logo.png"
                  alt="Investments Paraguay"
                  width={150}
                  height={49}
                  className="h-8 w-auto object-contain"
                /> */}
                <div className="brand">
                  Investments<span>Paraguay</span>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xs border border-(--line) bg-transparent text-primary transition-colors duration-150 hover:bg-(--carbon) hover:text-(--ivory)"
                aria-label={t("header.closeMenu")}
              >
                <X size={18} />
              </button>
            </div>

            <div
              className={cn(
                "flex items-center justify-between gap-3 border-b-[0.5px] py-4",
                ITEM_BORDER,
              )}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                  {t("header.localeLabel")}
                </p>
                <p className="mt-1 text-sm text-secondary">
                  {t("header.localeDescription")}
                </p>
              </div>
              <LocaleSwitcher showLabel />
            </div>

            <nav className={cn("flex flex-col divide-y", ITEM_DIVIDER)}>
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  className={cn("px-1 py-4", navLinkClass(link.href))}
                  href={link.href}
                  onClick={close}
                  data-analytics-event="navigation_click"
                  data-analytics-category="header"
                  data-analytics-label={link.href}
                  data-analytics-location="mobile_menu"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{link.label}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                      0{index + 1}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>

            <Link
              href={buildWhatsAppHref(undefined, locale)}
              target="_blank"
              className={cn("my-4 w-full", ctaClass)}
              data-analytics-event="cta_click"
              data-analytics-category="header"
              data-analytics-label="whatsapp_primary"
              data-analytics-location="mobile_menu"
            >
              {t("header.cta")}
            </Link>

            <p
              className={cn(
                "border-t-[0.5px] py-4 text-xs leading-5 text-secondary",
                ITEM_BORDER,
              )}
            >
              {t("header.tagline")}
            </p>
          </div>
        </>
      )}
    </header>
  );
}
