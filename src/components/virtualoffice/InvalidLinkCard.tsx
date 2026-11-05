import NextLink from "next/link";
import { AuthCard } from "@/components/virtualoffice/AuthCard";

const STATE_MESSAGES = {
  invalid: "El link no es válido.",
  expired: "El link venció.",
  used: "Este link ya se usó.",
} as const;

export function InvalidLinkCard({
  title,
  state,
  hint,
  action,
}: {
  title: string;
  state: "invalid" | "expired" | "used" | "valid";
  hint: string;
  action?: { href: string; label: string };
}) {
  return (
    <AuthCard title={title}>
      <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
        {STATE_MESSAGES[state === "valid" ? "invalid" : state]} {hint}
      </p>
      {action ? (
        <p className="mt-6 text-center text-sm">
          <NextLink href={action.href} className="text-secondary underline underline-offset-4 hover:text-primary">
            {action.label}
          </NextLink>
        </p>
      ) : null}
    </AuthCard>
  );
}
