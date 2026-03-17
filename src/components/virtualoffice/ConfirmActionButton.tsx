"use client";

import { useTransition } from "react";

export default function ConfirmActionButton({
  label,
  pendingLabel,
  confirmMessage,
  onConfirm,
  variant = "danger",
}: {
  label: string;
  pendingLabel?: string;
  confirmMessage: string;
  onConfirm: () => Promise<void> | void;
  variant?: "danger" | "neutral";
}) {
  const [isPending, startTransition] = useTransition();

  const classes =
    variant === "danger"
      ? "border-red-200 text-red-700 hover:bg-red-50"
      : "border-zinc-200 text-zinc-700 hover:bg-zinc-50";

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(confirmMessage)) return;
        startTransition(async () => {
          await onConfirm();
        });
      }}
      className={`rounded-lg border bg-white px-3 py-1.5 text-xs font-medium disabled:opacity-60 ${classes}`}
    >
      {isPending ? pendingLabel ?? "Procesando..." : label}
    </button>
  );
}
