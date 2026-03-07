"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePropertyButton({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onDelete() {
    if (!confirm("¿Seguro que querés borrar esta propiedad?")) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/virtualoffice/properties/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "No se pudo borrar.");
        return;
      }
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isLoading}
        onClick={onDelete}
        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        Borrar
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
