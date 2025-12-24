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
    "inline-flex items-center justify-center px-4 py-2 text-sm text-accent2 font-medium transition";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-accent1 text-primary hover:opacity-90",
    secondary:
      "border border-accent1 text-accent1 hover:bg-accent1 hover:text-primary",
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
