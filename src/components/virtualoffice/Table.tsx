import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function TableShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.75rem] border border-[rgba(24,39,63,0.08)] bg-white shadow-[0_18px_60px_rgba(15,23,38,0.06)]",
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return <table className="min-w-full text-sm">{children}</table>;
}

export function Th({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "whitespace-nowrap border-b border-[rgba(24,39,63,0.08)] bg-[linear-gradient(180deg,#fcfaf6_0%,#f7f3ed_100%)] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-b border-zinc-100 px-4 py-4 align-top text-zinc-800",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="transition hover:bg-[#fcfaf6]">{children}</tr>;
}
