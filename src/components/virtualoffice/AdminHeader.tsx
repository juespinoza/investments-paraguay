"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Menu, PanelLeftOpen, ShieldCheck, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { VIRTUALOFFICE_MENU } from "@/lib/virtualoffice/menu";
import { Badge } from "@/components/virtualoffice/Page";
import { useAdminAuth } from "./AuthProvider";

function humanizeSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

const ROLE_LABELS = {
  ADMIN: "Admin",
  INMOBILIARIA: "Inmobiliaria",
  ASESOR: "Asesor",
  BLOGUERO: "Bloguero",
} as const;

export default function AdminHeader({
  onOpenNav,
}: {
  onOpenNav: () => void;
}) {
  const { user } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const currentItem = useMemo(
    () =>
      [...VIRTUALOFFICE_MENU]
        .sort((a, b) => b.href.length - a.href.length)
        .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
    [pathname],
  );

  const breadcrumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean).slice(1);
    const crumbs = [
      { href: "/virtual-office", label: "Dashboard" },
      ...parts.map((segment, index) => ({
        href: `/virtual-office/${parts.slice(0, index + 1).join("/")}`,
        label: humanizeSegment(segment),
      })),
    ];

    return crumbs;
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/virtual-office/login");
      router.refresh();
    }
  }

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(24,39,63,0.08)] bg-[rgba(250,248,244,0.84)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenNav}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm lg:hidden"
            aria-label="Abrir navegación"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warning">Oficina virtual</Badge>
              <span className="text-sm font-medium text-zinc-900">
                {currentItem?.label ?? "Panel"}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  {index > 0 ? <span>/</span> : null}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-zinc-700">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-zinc-900">
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[rgba(24,39,63,0.08)] bg-white px-3 py-2 text-xs text-zinc-600 shadow-sm sm:flex">
            <Sparkles size={14} className="text-amber-600" />
            Carga guiada y permisos activos
          </div>

          <div className="rounded-2xl border border-[rgba(24,39,63,0.08)] bg-white px-3 py-2 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#f4ead7_0%,#e9dbc2_100%)] text-zinc-900">
                <ShieldCheck size={16} />
              </div>
              <div className="hidden min-w-0 sm:block">
                <div className="truncate text-sm font-semibold text-zinc-950">
                  {user.email}
                </div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {ROLE_LABELS[user.role]}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
          >
            <PanelLeftOpen size={16} />
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
