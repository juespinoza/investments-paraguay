"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function LeadCaptureForm({
  sourcePage,
  advisorSlug,
  propertySlug,
  compact = false,
  labels,
}: {
  sourcePage: string;
  advisorSlug?: string;
  propertySlug?: string;
  compact?: boolean;
  labels?: {
    fullName: string;
    email: string;
    whatsapp: string;
    sending: string;
    send: string;
    receiveGuide: string;
    error: string;
    success: string;
  };
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
        setError(data?.error ?? labels?.error ?? "No se pudo enviar.");
        return;
      }
      setMessage(
        labels?.success ?? "Solicitud enviada. Te contactaremos en breve.",
      );
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
        className="h-12 rounded-full border border-soft bg-white/80 px-4 outline-none"
        placeholder={labels?.fullName ?? "Nombre"}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 rounded-full border border-soft bg-white/80 px-4 outline-none"
        placeholder={labels?.email ?? "Email"}
      />
      <input
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        className="h-12 rounded-full border border-soft bg-white/80 px-4 outline-none"
        placeholder={labels?.whatsapp ?? "WhatsApp"}
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <Button>
        {isLoading
          ? (labels?.sending ?? "Enviando...")
          : compact
            ? (labels?.send ?? "Enviar")
            : (labels?.receiveGuide ?? "Recibir guía")}
      </Button>
    </form>
  );
}
