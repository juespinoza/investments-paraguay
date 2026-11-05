"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AuthCard } from "@/components/virtualoffice/AuthCard";

export default function ConfirmEmailClient({ token, email }: { token: string; email: string }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onConfirm() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/email-change/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        setErr(data?.message ?? "No pudimos confirmar el email. Probá de nuevo.");
        return;
      }
      router.replace("/virtual-office/login?status=email-confirmed");
    } catch {
      setErr("No hay conexión con el servidor. Revisá tu internet y probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Confirmar email" subtitle="Tu cuenta va a pasar a usar este email para iniciar sesión.">
      <p className="mt-6 rounded-md border px-3 py-2 text-sm font-medium text-primary break-all">{email}</p>
      {err ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {err}
        </p>
      ) : null}
      <div className="mt-6">
        <Button className="w-full" type="button" onClick={onConfirm} disabled={loading}>
          {loading ? "Confirmando..." : "Confirmar este email"}
        </Button>
      </div>
    </AuthCard>
  );
}
