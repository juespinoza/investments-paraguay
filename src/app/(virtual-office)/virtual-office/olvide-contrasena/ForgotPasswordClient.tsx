"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Button } from "@/components/ui/Button";
import { AuthCard, authInputClass } from "@/components/virtualoffice/AuthCard";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => null)) as { message?: string } | null;

      if (!res.ok) {
        setErr(data?.message ?? "No pudimos procesar el pedido. Probá de nuevo.");
        return;
      }
      setDone(data?.message ?? "Revisá tu email.");
    } catch {
      setErr("No hay conexión con el servidor. Revisá tu internet y probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Olvidé mi contraseña"
      subtitle="Te enviamos un link a tu email para elegir una nueva."
    >
      {done ? (
        <div className="mt-6 space-y-3 text-sm text-secondary">
          <p role="status" className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">
            {done}
          </p>
          <p>El link vence en 30 minutos. Si no llega, revisá la carpeta de spam.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <div className="mt-6">
            <input
              className={authInputClass}
              placeholder="Email de tu cuenta"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
              {loading ? "Enviando..." : "Enviar link"}
            </Button>
          </div>
        </form>
      )}
      <p className="mt-4 text-center text-sm">
        <NextLink href="/virtual-office/login" className="text-secondary underline underline-offset-4 hover:text-primary">
          Volver al inicio de sesión
        </NextLink>
      </p>
    </AuthCard>
  );
}
