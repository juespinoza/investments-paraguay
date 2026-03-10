import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { VIRTUALOFFICE_MENU, Role } from "@/lib/virtualoffice/menu";
import { useAdminAuth } from "./AuthProvider";

export default function AdminHeader() {
  const { user, isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/virtual-office/login");
      router.refresh();
    }
  }

  const items = useMemo(() => {
    if (isLoading) return [];
    if (!isAuthenticated || !user) return [];
    return VIRTUALOFFICE_MENU.filter((i) => i.roles.includes(user.role));
  }, [isLoading, isAuthenticated, user]);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/virtual-office"
            className="group inline-flex items-center gap-2"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
              <span className="text-sm font-semibold">IP</span>
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Investments Paraguay</div>
              <div className="text-xs text-zinc-500">Admin</div>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Placeholder: user menu / logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 rounded-md px-3 py-2 text-left text-secondary hover:bg-accent2 hover:text-primary"
          >
            Logout
          </button>
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium">Admin</div>
            <div className="text-xs text-zinc-500">Panel</div>
          </div>
          <div className="h-9 w-9 rounded-full border border-zinc-200 bg-linear-to-br from-zinc-100 to-zinc-200" />
        </div>
      </div>

      {/* Mobile nav */}
      <div className="border-t border-zinc-200 sm:hidden">
        <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 py-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
