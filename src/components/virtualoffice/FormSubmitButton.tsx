"use client";

import { useFormStatus } from "react-dom";

export default function FormSubmitButton({
  idleLabel,
  pendingLabel,
  className,
}: {
  idleLabel: string;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? pendingLabel ?? "Guardando..." : idleLabel}
    </button>
  );
}
