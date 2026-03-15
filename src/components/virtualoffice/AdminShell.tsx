"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { AdminAuthProvider, useAdminAuth } from "./AuthProvider";

function AdminShellInner({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAdminAuth();

  // Loading: podés poner skeleton si querés
  if (isLoading) return null;

  // Si NO está autenticado, podés renderizar un CTA o redirigir
  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh bg-zinc-50 text-zinc-950">
        <div className="mx-auto max-w-md px-6 py-20">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold">Sesión requerida</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Iniciá sesión para acceder al panel.
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
    <div className="min-h-dvh bg-zinc-50 text-zinc-950">
      <AdminHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <AdminFooter />
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
