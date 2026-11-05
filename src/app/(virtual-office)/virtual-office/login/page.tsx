// src/app/(virtual-office)/virtual-office/login/page.tsx
import LoginClient from "./LoginClient";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login Oficina virtual | Investments Paraguay",
  description: "Acceso al panel interno.",
  pathname: "/virtual-office/login",
  noIndex: true,
});

// Solo rutas internas: evita usar el login para redirigir a otro sitio.
function safeNext(next: string) {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/virtual-office";
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const next =
    typeof resolvedSearchParams?.next === "string" &&
    resolvedSearchParams.next.trim().length > 0
      ? resolvedSearchParams.next
      : "/virtual-office";

  const notices: Record<string, string> = {
    "password-reset": "Listo, tu contraseña cambió. Ingresá con la nueva.",
    activated: "Tu cuenta está activada. Ingresá con tu email y la contraseña que elegiste.",
    "email-confirmed": "Email confirmado. Desde ahora ingresás con el email nuevo.",
  };
  const status = resolvedSearchParams?.status;
  const notice = typeof status === "string" ? notices[status] ?? null : null;

  return <LoginClient nextUrl={safeNext(next)} notice={notice} />;
}
