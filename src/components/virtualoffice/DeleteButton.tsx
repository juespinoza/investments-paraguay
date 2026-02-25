"use client";

import { useState } from "react";
import { deleteAdvisorAction } from "@/app/api/virtualoffice/advisors/actions";

export default function DeleteButton({ id }: { id: string }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (fd) => {
        setError(null);
        const res = await deleteAdvisorAction(fd.get("id") as string);
        if (!res.ok) setError(res?.error ?? "No se pudo borrar.");
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
        onClick={(e) => {
          // confirm mínimo, sin librerías
          if (!confirm("¿Seguro que querés borrar este asesor?"))
            e.preventDefault();
        }}
      >
        Borrar
      </button>

      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </form>
  );
}
