"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmActionButton from "@/components/virtualoffice/ConfirmActionButton";

export default function DeleteBlogPostButton({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onDelete() {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/virtualoffice/blog/${id}`, {
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
      <ConfirmActionButton
        label={isLoading ? "Borrando..." : "Borrar"}
        pendingLabel="Borrando..."
        confirmMessage="¿Seguro que querés borrar este post?"
        onConfirm={onDelete}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
