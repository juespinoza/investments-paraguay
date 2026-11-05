"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AuthCard, authInputClass } from "@/components/virtualoffice/AuthCard";

// Formulario de contraseña nueva a partir de un link con token. Lo usan
// "restablecer contraseña" y "activar cuenta".
export default function ResetPasswordClient({
  token,
  endpoint = "/api/auth/password-reset/confirm",
  title = "Nueva contraseña",
  subtitle = "Elegí una contraseña de al menos 8 caracteres.",
  successPath = "/virtual-office/login?status=password-reset",
  retryHref = "/virtual-office/olvide-contrasena",
}: {
  token: string;
  endpoint?: string;
  title?: string;
  subtitle?: string;
  successPath?: string;
  retryHref?: string;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (password.length < 8) {
      setErr("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setErr("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => null)) as
        | { error?: string; message?: string }
        | null;

      if (!res.ok) {
        setErr(data?.message ?? "No pudimos cambiar la contraseña. Probá de nuevo.");
        setExpired(["invalid", "expired", "used"].includes(data?.error ?? ""));
        return;
      }

      router.replace(successPath);
    } catch {
      setErr("No hay conexión con el servidor. Revisá tu internet y probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title={title} subtitle={subtitle}>
      <form onSubmit={onSubmit}>
        <div className="mt-6 space-y-3">
          <input
            className={authInputClass}
            placeholder="Nueva contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
          <input
            className={authInputClass}
            placeholder="Repetí la contraseña"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        {err ? (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {err}
          </p>
        ) : null}
        <div className="mt-6">
          <Button className="w-full" type="submit" disabled={loading || expired}>
            {loading ? "Guardando..." : "Guardar contraseña"}
          </Button>
        </div>
        {expired ? (
          <p className="mt-4 text-center text-sm">
            <NextLink href={retryHref} className="text-secondary underline underline-offset-4 hover:text-primary">
              Pedir un link nuevo
            </NextLink>
          </p>
        ) : null}
      </form>
    </AuthCard>
  );
}
