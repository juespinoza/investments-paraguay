"use client";

import { cn } from "@/lib/cn";
import { Link } from "@/i18n/navigation";

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
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", className, children, ...rest } = props;

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition duration-200";
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--carbon)] text-[var(--ivory)] shadow-[0_16px_36px_rgba(10,10,10,0.18)] hover:-translate-y-0.5 hover:bg-[var(--gold)] hover:text-[var(--carbon)]",
    secondary:
      "border border-[var(--line)] bg-[rgba(250,250,248,0.72)] text-primary hover:-translate-y-0.5 hover:border-[var(--gold)] hover:bg-[var(--stone)]",
  };

  const cls = cn(base, variants[variant], className);

  // Si tiene href → Link interno (Next)
  if ("href" in rest) {
    const { href, target, rel, prefetch, ...linkProps } =
      rest as Omit<ButtonAsLink, keyof Common>;

    // Si es URL externa, usamos <a> (porque next/link para externo no aporta)
    const isExternal =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    const safeRel = target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

    if (isExternal) {
      return (
        <a
          {...linkProps}
          href={href}
          target={target}
          rel={safeRel}
          className={cls}
        >
          {children}
        </a>
      );
    }

    return (
      <Link {...linkProps} href={href} prefetch={prefetch} className={cls}>
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
