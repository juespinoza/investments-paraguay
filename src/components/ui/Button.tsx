"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

type Common = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = Common &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = Common & {
  href: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", className, children, ...rest } = props;

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition duration-200";
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[linear-gradient(135deg,#b8914c_0%,#d8b26c_100%)] text-white shadow-[0_16px_36px_rgba(185,145,76,0.28)] hover:-translate-y-0.5",
    secondary:
      "border border-[rgba(201,164,92,0.42)] bg-white/70 text-primary hover:-translate-y-0.5 hover:bg-white",
  };

  const cls = cn(base, variants[variant], className);

  // Si tiene href → Link interno (Next)
  if ("href" in props) {
    const { href, target, rel, prefetch } = props as ButtonAsLink;

    // Si es URL externa, usamos <a> (porque next/link para externo no aporta)
    const isExternal =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");
    if (isExternal) {
      return (
        <a href={href} target={target} rel={rel} className={cls}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} prefetch={prefetch} className={cls}>
        {children}
      </Link>
    );
  }

  // Si no tiene href → button normal
  return (
    <button {...(rest as ButtonAsButton)} className={cls}>
      {children}
    </button>
  );
}
