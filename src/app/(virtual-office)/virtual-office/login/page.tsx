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

  const notice =
    resolvedSearchParams?.status === "password-reset"
      ? "Listo, tu contraseña cambió. Ingresá con la nueva."
      : null;

  return <LoginClient nextUrl={safeNext(next)} notice={notice} />;
}
