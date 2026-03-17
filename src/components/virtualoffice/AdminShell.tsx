"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Building2, Home, X } from "lucide-react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { AdminAuthProvider, useAdminAuth } from "./AuthProvider";
import { VIRTUALOFFICE_MENU } from "@/lib/virtualoffice/menu";
import { cn } from "@/lib/cn";

function AdminShellInner({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, user } = useAdminAuth();
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  const items = useMemo(() => {
    if (!user) return [];
    return VIRTUALOFFICE_MENU.filter((item) => item.roles.includes(user.role));
  }, [user]);

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-dvh bg-[linear-gradient(180deg,#faf8f4_0%,#f4efe7_100%)] text-zinc-950">
        <div className="mx-auto max-w-md px-6 py-20">
          <div className="rounded-[1.75rem] border border-[rgba(24,39,63,0.08)] bg-white p-6 shadow-[0_18px_60px_rgba(15,23,38,0.06)]">
            <h1 className="text-lg font-semibold">Sesión requerida</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Iniciá sesión para acceder al panel y gestionar tu información.
            </p>
            <Link
              href="/virtual-office/login"
              className="mt-4 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Ir a login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#faf8f4_0%,#f4efe7_100%)] text-zinc-950">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-400">
        {navOpen ? (
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            className="fixed inset-0 z-30 bg-zinc-950/30 lg:hidden"
            aria-label="Cerrar navegación"
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-72.5 flex-col border-r border-[rgba(24,39,63,0.08)] bg-[linear-gradient(180deg,#fffdfa_0%,#f7f1e8_100%)] px-4 py-4 shadow-[0_18px_80px_rgba(15,23,38,0.12)] transition-transform lg:sticky lg:translate-x-0 lg:shadow-none",
            navOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/virtual-office"
              className="flex min-w-0 items-center gap-3"
              onClick={() => setNavOpen(false)}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-sm">
                <Building2 size={18} />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-zinc-950">
                  Investments Paraguay
                </div>
                <div className="mt-0.5 text-xs uppercase tracking-[0.18em] text-amber-700">
                  Oficina virtual
                </div>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white lg:hidden"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-5 rounded-3xl border border-[rgba(24,39,63,0.08)] bg-white/90 p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Sesión activa
            </div>
            <div className="mt-2 text-sm font-semibold text-zinc-950">
              {user.email}
            </div>
            <div className="mt-1 text-sm text-zinc-600">
              Acceso filtrado por tu rol y tenant.
            </div>
          </div>

          <nav className="mt-5 flex-1 space-y-1">
            {items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-zinc-900 text-white shadow-[0_16px_36px_rgba(15,23,38,0.18)]"
                      : "text-zinc-700 hover:bg-white hover:text-zinc-950",
                  )}
                >
                  <Home size={16} className={active ? "text-amber-300" : ""} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="rounded-3xl border border-[rgba(24,39,63,0.08)] bg-white/90 p-4 text-sm text-zinc-600 shadow-sm">
            Usa el panel para crear, editar y revisar solo la información que te corresponde.
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:pl-0">
          <AdminHeader onOpenNav={() => setNavOpen(true)} />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              {children}
              <AdminFooter />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminAuthProvider>
  );
}
