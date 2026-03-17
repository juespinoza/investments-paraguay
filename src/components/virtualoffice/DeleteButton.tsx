"use client";

import { useState } from "react";
import ConfirmActionButton from "@/components/virtualoffice/ConfirmActionButton";
import { deleteAdvisorAction } from "@/app/api/virtualoffice/advisors/actions";

export default function DeleteButton({ id }: { id: string }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      <ConfirmActionButton
        label="Borrar"
        pendingLabel="Borrando..."
        confirmMessage="¿Seguro que querés borrar este asesor?"
        onConfirm={async () => {
          setError(null);
          const res = await deleteAdvisorAction(id);
          if (!res.ok) {
            setError(res?.error ?? "No se pudo borrar.");
          }
        }}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
