"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmActionButton from "@/components/virtualoffice/ConfirmActionButton";

export default function DeletePropertyButton({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    setError(null);
    const res = await fetch(`/api/virtualoffice/properties/${id}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "No se pudo borrar.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <ConfirmActionButton
        label="Borrar"
        pendingLabel="Borrando..."
        confirmMessage="¿Seguro que querés borrar esta propiedad?"
        onConfirm={onDelete}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
