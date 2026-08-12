import "server-only";

import { Role } from "@/generated/prisma";
import type { SessionPayload } from "@/lib/data/types";

export type PermissionResourceV2 =
  | "users"
  | "inmobiliaria_core"
  | "inmobiliaria_landing"
  | "advisor_core"
  | "advisor_landing"
  | "properties"
  | "blogs";

export type PermissionActionV2 = "create" | "read" | "update" | "delete_soft";

export type PermissionScopeV2 =
  | "all"
  | "own"
  | "tenant"
  | "self"
  | "advisor_users"
  | "advisor_properties"
  | "own_posts"
  | "none";

type ResourceActionMatrix = Record<
  PermissionResourceV2,
  Record<PermissionActionV2, readonly PermissionScopeV2[]>
>;

const NONE = ["none"] as const;

export const PERMISSION_MATRIX_V2: Record<Role, ResourceActionMatrix> = {
  [Role.ADMIN]: {
    users: {
      create: ["all"],
      read: ["all"],
      update: ["all"],
      delete_soft: ["all"],
    },
    inmobiliaria_core: {
      create: ["all"],
      read: ["all"],
      update: ["all"],
      delete_soft: ["all"],
    },
    inmobiliaria_landing: {
      create: ["all"],
      read: ["all"],
      update: ["all"],
      delete_soft: ["all"],
    },
    advisor_core: {
      create: ["all"],
      read: ["all"],
      update: ["all"],
      delete_soft: ["all"],
    },
    advisor_landing: {
      create: ["all"],
      read: ["all"],
      update: ["all"],
      delete_soft: ["all"],
    },
    properties: {
      create: ["all"],
      read: ["all"],
      update: ["all"],
      delete_soft: ["all"],
    },
    blogs: {
      create: ["all"],
      read: ["all"],
      update: ["all"],
      delete_soft: ["all"],
    },
  },
  [Role.INMOBILIARIA]: {
    users: {
      create: ["advisor_users"],
      read: ["advisor_users"],
      update: ["advisor_users"],
      delete_soft: ["advisor_users"],
    },
    inmobiliaria_core: {
      create: ["own"],
      read: ["own"],
      update: ["own"],
      delete_soft: ["own"],
    },
    inmobiliaria_landing: {
      create: ["own"],
      read: ["own"],
      update: ["own"],
      delete_soft: ["own"],
    },
    advisor_core: {
      create: ["tenant"],
      read: ["tenant"],
      update: ["tenant"],
      delete_soft: ["tenant"],
    },
    advisor_landing: {
      create: NONE,
      read: NONE,
      update: NONE,
      delete_soft: NONE,
    },
    properties: {
      create: NONE,
      read: ["advisor_properties"],
      update: ["advisor_properties"],
      delete_soft: ["advisor_properties"],
    },
    blogs: {
      create: ["own_posts"],
      read: ["own_posts"],
      update: ["own_posts"],
      delete_soft: ["own_posts"],
    },
  },
  [Role.ASESOR]: {
    users: {
      create: NONE,
      read: NONE,
      update: NONE,
      delete_soft: NONE,
    },
    inmobiliaria_core: {
      create: NONE,
      read: NONE,
      update: NONE,
      delete_soft: NONE,
    },
    inmobiliaria_landing: {
      create: NONE,
      read: NONE,
      update: NONE,
      delete_soft: NONE,
    },
    advisor_core: {
      create: NONE,
      read: ["own"],
      update: ["own"],
      delete_soft: NONE,
    },
    advisor_landing: {
      create: ["own"],
      read: ["own"],
      update: ["own"],
      delete_soft: ["own"],
    },
    properties: {
      create: ["self"],
      read: ["self"],
      update: ["self"],
      delete_soft: ["self"],
    },
    blogs: {
      create: ["own_posts"],
      read: ["own_posts"],
      update: ["own_posts"],
      delete_soft: ["own_posts"],
    },
  },
  [Role.BLOGUERO]: {
    users: {
      create: NONE,
      read: NONE,
      update: NONE,
      delete_soft: NONE,
    },
    inmobiliaria_core: {
      create: NONE,
      read: NONE,
      update: NONE,
      delete_soft: NONE,
    },
    inmobiliaria_landing: {
      create: NONE,
      read: NONE,
      update: NONE,
      delete_soft: NONE,
    },
    advisor_core: {
      create: NONE,
      read: NONE,
      update: NONE,
      delete_soft: NONE,
    },
    advisor_landing: {
      create: NONE,
      read: NONE,
      update: NONE,
      delete_soft: NONE,
    },
    properties: {
      create: NONE,
      read: NONE,
      update: NONE,
      delete_soft: NONE,
    },
    blogs: {
      create: ["own_posts"],
      read: ["own_posts"],
      update: ["own_posts"],
      delete_soft: ["own_posts"],
    },
  },
};

export function roleOf(session: SessionPayload) {
  return session.role as Role;
}

export function scopesFor(
  session: SessionPayload,
  resource: PermissionResourceV2,
  action: PermissionActionV2,
): readonly PermissionScopeV2[] {
  return PERMISSION_MATRIX_V2[roleOf(session)][resource][action];
}

export function scopeFor(
  session: SessionPayload,
  resource: PermissionResourceV2,
  action: PermissionActionV2,
): PermissionScopeV2 {
  const scopes = scopesFor(session, resource, action);
  return scopes[0] ?? "none";
}

export function can(
  session: SessionPayload,
  resource: PermissionResourceV2,
  action: PermissionActionV2,
) {
  return scopeFor(session, resource, action) !== "none";
}

export function assertCan(
  session: SessionPayload,
  resource: PermissionResourceV2,
  action: PermissionActionV2,
  message = "Forbidden",
) {
  if (!can(session, resource, action)) {
    throw new Error(message);
  }
}

export function isScopeOneOf(
  session: SessionPayload,
  resource: PermissionResourceV2,
  action: PermissionActionV2,
  scopes: readonly PermissionScopeV2[],
) {
  return scopes.includes(scopeFor(session, resource, action));
}
