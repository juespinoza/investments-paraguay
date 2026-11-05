// src/app/(virtual-office)/virtual-office/login/LoginClient.tsx
"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AuthCard, authInputClass } from "@/components/virtualoffice/AuthCard";

// Cada error del servidor tiene su mensaje: un problema de configuración no
// debe parecer una contraseña incorrecta.
const LOGIN_ERRORS: Record<string, string> = {
  invalid_credentials: "Email o contraseña incorrectos.",
  invalid_payload: "Ingresá un email válido y tu contraseña.",
  server_error:
    "No pudimos iniciar sesión por un problema del servidor (no es tu contraseña). Probá de nuevo en unos minutos.",
};

export default function LoginClient({
  nextUrl,
  notice,
}: {
  nextUrl: string;
  notice?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setErr(
          LOGIN_ERRORS[data?.error ?? ""] ??
            (res.status >= 500 ? LOGIN_ERRORS.server_error : LOGIN_ERRORS.invalid_credentials),
        );
        return;
      }

      router.push(nextUrl);
      router.refresh();
    } catch {
      setErr("No hay conexión con el servidor. Revisá tu internet y probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Oficina virtual" subtitle="Iniciá sesión">
      {notice ? (
        <p role="status" className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </p>
      ) : null}
      <form onSubmit={onSubmit}>
        <div className="mt-6 space-y-3">
          <input
            className={authInputClass}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            className={authInputClass}
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {err ? (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {err}
          </p>
        ) : null}

        <div className="mt-6">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </div>
        <p className="mt-4 text-center text-sm">
          <NextLink href="/virtual-office/olvide-contrasena" className="text-secondary underline underline-offset-4 hover:text-primary">
            ¿Olvidaste tu contraseña?
          </NextLink>
        </p>
      </form>
    </AuthCard>
  );
}
