"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "LOST"] as const;
type LeadStatus = (typeof STATUSES)[number];

export default function LeadStatusSelect({
  id,
  value,
}: {
  id: number;
  value: LeadStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(value);
  const [isLoading, setIsLoading] = useState(false);

  async function onChange(next: LeadStatus) {
    setStatus(next);
    setIsLoading(true);
    try {
      await fetch(`/api/virtualoffice/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <select
      value={status}
      disabled={isLoading}
      onChange={(e) => onChange(e.target.value as LeadStatus)}
      className="h-10 min-w-36 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium tracking-[0.08em] text-zinc-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
