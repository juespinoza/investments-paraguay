"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function LeadCaptureForm({
  sourcePage,
  advisorSlug,
  propertySlug,
  compact = false,
}: {
  sourcePage: string;
  advisorSlug?: string;
  propertySlug?: string;
  compact?: boolean;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          whatsapp,
          sourcePage,
          advisorSlug,
          propertySlug,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "No se pudo enviar.");
        return;
      }
      setMessage("Solicitud enviada. Te contactaremos en breve.");
      setFullName("");
      setEmail("");
      setWhatsapp("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="h-11 rounded-sm border px-3"
        placeholder="Nombre"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 rounded-sm border px-3"
        placeholder="Email"
      />
      <input
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        className="h-11 rounded-sm border px-3"
        placeholder="WhatsApp"
      />

      {error ? (
        <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <Button>{isLoading ? "Enviando..." : compact ? "Enviar" : "Recibir guía"}</Button>
    </form>
  );
}
