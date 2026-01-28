// src/app/(virtual-office)/virtual-office/login/LoginClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LoginClient({ nextUrl }: { nextUrl: string }) {
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
        setErr("Email o contraseña incorrectos.");
        return;
      }

      router.push(nextUrl);
      router.refresh();
    } catch {
      setErr("Ocurrió un error. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm border"
      >
        <h1 className="text-2xl font-semibold text-primary">Virtual Office</h1>
        <p className="mt-1 text-sm text-secondary">Iniciá sesión</p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}

        <div className="mt-6">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
