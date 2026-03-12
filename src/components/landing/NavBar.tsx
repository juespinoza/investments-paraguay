"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocaleSwitcher } from "../i18n/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

export function NavBar() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 px-4 py-4 bg-white border-b border-grey-200">
      <div className="container-page">
        <div className="luxury-panel flex items-center justify-between rounded-full px-4 py-3 md:px-6">
          <Link
            href="/"
            className="font-semibold tracking-wide"
            onClick={close}
          >
            <Image
              src="/images/logo.png"
              alt="Investments Paraguay"
              width={180}
              height={59.4}
              className="h-9 w-auto md:h-11"
            />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              className="rounded-full px-4 py-2 text-sm font-medium text-primary hover:bg-white/70"
              href="/"
            >
              {t("header.home")}
            </Link>
            <Link
              className="rounded-full px-4 py-2 text-sm font-medium text-primary hover:bg-white/70"
              href="/bienes-raices"
            >
              {t("header.realEstate")}
            </Link>
            <Link
              className="rounded-full px-4 py-2 text-sm font-medium text-primary hover:bg-white/70"
              href="/blog"
            >
              {t("header.blog")}
            </Link>
            <LocaleSwitcher />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <LocaleSwitcher />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-primary"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <>
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-[#0f1726]/45 backdrop-blur-sm"
            onClick={close}
          />

          <div className="fixed inset-x-4 top-4 z-50 rounded-xl bg-[linear-gradient(180deg,#fffdf9_0%,#f4ecdf_100%)] p-4 shadow-[0_28px_80px_rgba(15,23,38,0.24)] md:hidden">
            <div className="flex items-center justify-between border-b border-soft pb-4">
              <Image
                src="/images/logo.png"
                alt="Investments Paraguay"
                width={150}
                height={49}
                className="h-9 w-auto"
              />
              <button
                type="button"
                onClick={close}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft bg-white/70 text-primary"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-2">
              <Link
                className="rounded-2xl bg-white/70 px-4 py-4 text-base font-medium text-primary"
                href="/"
                onClick={close}
              >
                {t("header.home")}
              </Link>
              <Link
                className="rounded-2xl bg-white/70 px-4 py-4 text-base font-medium text-primary"
                href="/bienes-raices"
                onClick={close}
              >
                {t("header.realEstate")}
              </Link>
              <Link
                className="rounded-2xl bg-white/70 px-4 py-4 text-base font-medium text-primary"
                href="/blog"
                onClick={close}
              >
                {t("header.blog")}
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
