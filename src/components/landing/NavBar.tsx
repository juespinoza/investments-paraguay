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
    <header className="border-b bg-white">
      <div className="container-page container-narrow flex items-center justify-between py-4">
        <Link href="/" className="font-semibold tracking-wide" onClick={close}>
          <Image
            src="/images/logo.png"
            alt="Investments Paraguay"
            width={180}
            height={59.4}
          />
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-3 md:flex">
          <Link className="bg-primary px-4 py-2 text-sm text-white" href="/">
            {t("header.home")}
          </Link>
          <Link
            className="bg-secondary px-4 py-2 text-sm text-white"
            href="/bienes-raices"
          >
            {t("header.realEstate")}
          </Link>
          <Link
            className="bg-secondary px-4 py-2 text-sm text-white"
            href="/blog"
          >
            {t("header.blog")}
          </Link>
          <LocaleSwitcher />
        </nav>

        {/* Mobile: burger */}
        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-md border p-2"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          {/* overlay */}
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40"
            onClick={close}
          />

          {/* panel */}
          <div className="fixed right-0 top-0 z-50 h-full w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <span className="text-sm font-semibold">{t("header.home")}</span>
              <button
                type="button"
                onClick={close}
                className="inline-flex items-center justify-center rounded-md border p-2"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 p-4">
              <Link
                className="rounded-md bg-primary px-4 py-3 text-sm text-white"
                href="/"
                onClick={close}
              >
                {t("header.home")}
              </Link>

              <Link
                className="rounded-md bg-secondary px-4 py-3 text-sm text-white"
                href="/bienes-raices"
                onClick={close}
              >
                {t("header.realEstate")}
              </Link>

              <Link
                className="rounded-md bg-secondary px-4 py-3 text-sm text-white"
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
