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
      className="h-8 rounded-sm border bg-white px-2 text-xs"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
