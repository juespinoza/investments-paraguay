import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  description,
  eyebrow,
  meta,
  actions,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
        ) : null}
        {meta ? <div className="mt-3">{meta}</div> : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-[rgba(24,39,63,0.08)] bg-white shadow-[0_18px_60px_rgba(15,23,38,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5 sm:p-6", className)}>{children}</div>;
}

export function CardSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[1.5rem] border border-[rgba(24,39,63,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf6_100%)] p-5",
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-[rgba(24,39,63,0.08)] bg-white/90 p-5 shadow-sm",
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardBody className="p-4 sm:p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {label}
        </div>
        <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          {value}
        </div>
        {hint ? (
          <div className="mt-2 text-sm leading-6 text-zinc-600">{hint}</div>
        ) : null}
      </CardBody>
    </Card>
  );
}

export function FilterBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-3 rounded-[1.5rem] border border-[rgba(24,39,63,0.08)] bg-white/90 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardBody className="py-10 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
          {action ? <div className="mt-5">{action}</div> : null}
        </div>
      </CardBody>
    </Card>
  );
}

export function InlineAlert({
  type,
  message,
}: {
  type: "success" | "error" | "info" | "warning";
  message: string;
}) {
  const styles = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-sky-200 bg-sky-50 text-sky-800",
    warning:
      "border-amber-200 bg-amber-50 text-amber-800",
  } satisfies Record<string, string>;

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm leading-6",
        styles[type],
      )}
    >
      {message}
    </div>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "info";
}) {
  const tones = {
    default: "border-zinc-200 bg-zinc-50 text-zinc-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    info: "border-sky-200 bg-sky-50 text-sky-700",
  } satisfies Record<string, string>;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
