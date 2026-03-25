import "server-only";

import { Role } from "@/generated/prisma";
import type { SessionPayload } from "@/lib/data/types";
import {
  can as canV2,
  scopeFor as scopeForV2,
  type PermissionActionV2,
  type PermissionResourceV2,
  type PermissionScopeV2,
} from "@/lib/auth/policy-v2";

export type PermissionResource =
  | "users"
  | "inmobiliarias"
  | "inmobiliariaAssignments"
  | "advisors"
  | "properties"
  | "propertyAssignments"
  | "propertyFeatured"
  | "blog"
  | "blogAssignments"
  | "leads"
  | "leadStatus";

export type PermissionAction = "read" | "create" | "update" | "delete" | "manage";

const LEGACY_RESOURCE_TO_V2: Partial<
  Record<PermissionResource, PermissionResourceV2>
> = {
  users: "users",
  inmobiliarias: "inmobiliaria_core",
  advisors: "advisor_core",
  properties: "properties",
  blog: "blogs",
} as const;

const PERMISSION_MATRIX: Record<
  PermissionResource,
  Partial<Record<PermissionAction, readonly Role[]>>
> = {
  users: {},
  inmobiliarias: {},
  inmobiliariaAssignments: {
    manage: [Role.ADMIN],
  },
  advisors: {},
  properties: {},
  propertyAssignments: {
    manage: [Role.ADMIN, Role.INMOBILIARIA],
  },
  propertyFeatured: {
    manage: [Role.ADMIN, Role.INMOBILIARIA],
  },
  blog: {},
  blogAssignments: {
    manage: [Role.ADMIN],
  },
  leads: {
    read: [Role.ADMIN, Role.INMOBILIARIA, Role.ASESOR],
  },
  leadStatus: {
    manage: [Role.ADMIN, Role.INMOBILIARIA],
  },
};

export function hasPermission(
  session: SessionPayload,
  resource: PermissionResource,
  action: PermissionAction,
) {
  const mappedResource = LEGACY_RESOURCE_TO_V2[resource];
  if (mappedResource) {
    const mappedAction =
      action === "delete" ? "delete_soft" : action;

    if (
      mappedAction === "create" ||
      mappedAction === "read" ||
      mappedAction === "update" ||
      mappedAction === "delete_soft"
    ) {
      return canV2(session, mappedResource, mappedAction);
    }
  }

  const allowedRoles = PERMISSION_MATRIX[resource][action];
  return allowedRoles?.includes(session.role as Role) ?? false;
}

export function isAdmin(session: SessionPayload) {
  return session.role === Role.ADMIN;
}

export function isInmobiliaria(session: SessionPayload) {
  return session.role === Role.INMOBILIARIA;
}

export function isAdvisor(session: SessionPayload) {
  return session.role === Role.ASESOR;
}

export function isBloguero(session: SessionPayload) {
  return session.role === Role.BLOGUERO;
}

// v2 policy exports
export type { PermissionActionV2, PermissionResourceV2, PermissionScopeV2 };

export function can(
  session: SessionPayload,
  resource: PermissionResourceV2,
  action: PermissionActionV2,
) {
  return canV2(session, resource, action);
}

export function scopeFor(
  session: SessionPayload,
  resource: PermissionResourceV2,
  action: PermissionActionV2,
) {
  return scopeForV2(session, resource, action);
}

export function canManageUsers(session: SessionPayload) {
  return canV2(session, "users", "read");
}

export function canAccessInmobiliarias(session: SessionPayload) {
  return (
    canV2(session, "inmobiliaria_core", "read") ||
    canV2(session, "inmobiliaria_landing", "read")
  );
}

export function canCreateInmobiliaria(session: SessionPayload) {
  return scopeForV2(session, "inmobiliaria_core", "create") === "all";
}

export function canManageInmobiliariaAssignments(session: SessionPayload) {
  return hasPermission(session, "inmobiliariaAssignments", "manage");
}

export function canAccessAdvisors(session: SessionPayload) {
  return (
    canV2(session, "advisor_core", "read") ||
    canV2(session, "advisor_landing", "read")
  );
}

export function canCreateAdvisor(session: SessionPayload) {
  return canV2(session, "advisor_core", "create");
}

export function canEditAdvisor(session: SessionPayload) {
  return (
    canV2(session, "advisor_core", "update") ||
    canV2(session, "advisor_landing", "update")
  );
}

export function canDeleteAdvisor(session: SessionPayload) {
  return canV2(session, "advisor_core", "delete_soft");
}

export function canAccessProperties(session: SessionPayload) {
  return canV2(session, "properties", "read");
}

export function canCreateProperty(session: SessionPayload) {
  return canV2(session, "properties", "create");
}

export function canEditProperty(session: SessionPayload) {
  return canV2(session, "properties", "update");
}

export function canDeleteProperty(session: SessionPayload) {
  return canV2(session, "properties", "delete_soft");
}

export function canManagePropertyAssignments(session: SessionPayload) {
  return hasPermission(session, "propertyAssignments", "manage");
}

export function canManagePropertyFeatured(session: SessionPayload) {
  return hasPermission(session, "propertyFeatured", "manage");
}

export function canAccessBlog(session: SessionPayload) {
  return canV2(session, "blogs", "read");
}

export function canManageBlogAssignments(session: SessionPayload) {
  return hasPermission(session, "blogAssignments", "manage");
}

export function canAccessLeads(session: SessionPayload) {
  return hasPermission(session, "leads", "read");
}

export function canManageLeadStatus(session: SessionPayload) {
  return hasPermission(session, "leadStatus", "manage");
}
