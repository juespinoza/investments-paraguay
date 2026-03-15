import "server-only";

import { requireSession } from "@/lib/auth/require-session";
import type { SessionPayload } from "@/lib/data/types";
import type { Role } from "@/lib/virtualoffice/menu";

export function hasAnyRole(
  role: SessionPayload["role"],
  allowedRoles: readonly Role[],
) {
  return allowedRoles.includes(role);
}

export async function requireVirtualOfficeRoles(allowedRoles: readonly Role[]) {
  const session = await requireSession();

  if (!hasAnyRole(session.role, allowedRoles)) {
    return { session, allowed: false as const };
  }

  return { session, allowed: true as const };
}
