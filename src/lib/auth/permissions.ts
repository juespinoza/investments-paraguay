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

const PERMISSION_MATRIX: Record<
  PermissionResource,
  Partial<Record<PermissionAction, readonly Role[]>>
> = {
  users: {
    read: [Role.ADMIN],
    create: [Role.ADMIN],
    update: [Role.ADMIN],
    delete: [Role.ADMIN],
  },
  inmobiliarias: {
    read: [Role.ADMIN, Role.INMOBILIARIA],
    create: [Role.ADMIN],
    update: [Role.ADMIN, Role.INMOBILIARIA],
    delete: [Role.ADMIN],
  },
  inmobiliariaAssignments: {
    manage: [Role.ADMIN],
  },
  advisors: {
    read: [Role.ADMIN, Role.INMOBILIARIA, Role.ASESOR],
    create: [Role.ADMIN, Role.INMOBILIARIA],
    update: [Role.ADMIN, Role.INMOBILIARIA, Role.ASESOR],
    delete: [Role.ADMIN, Role.INMOBILIARIA],
  },
  properties: {
    read: [Role.ADMIN, Role.INMOBILIARIA, Role.ASESOR],
    create: [Role.ADMIN, Role.INMOBILIARIA, Role.ASESOR],
    update: [Role.ADMIN, Role.INMOBILIARIA, Role.ASESOR],
    delete: [Role.ADMIN, Role.INMOBILIARIA, Role.ASESOR],
  },
  propertyAssignments: {
    manage: [Role.ADMIN, Role.INMOBILIARIA],
  },
  propertyFeatured: {
    manage: [Role.ADMIN, Role.INMOBILIARIA],
  },
  blog: {
    read: [Role.ADMIN, Role.BLOGUERO, Role.INMOBILIARIA, Role.ASESOR],
    create: [Role.ADMIN, Role.BLOGUERO, Role.INMOBILIARIA, Role.ASESOR],
    update: [Role.ADMIN, Role.BLOGUERO, Role.INMOBILIARIA, Role.ASESOR],
    delete: [Role.ADMIN, Role.BLOGUERO, Role.INMOBILIARIA, Role.ASESOR],
  },
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
  // Legacy behavior preserved until phase 3 migration of users.
  return hasPermission(session, "users", "read");
}

export function canAccessInmobiliarias(session: SessionPayload) {
  // Legacy facade preserved until inmobiliaria_core / inmobiliaria_landing split.
  return hasPermission(session, "inmobiliarias", "read");
}

export function canCreateInmobiliaria(session: SessionPayload) {
  // Legacy behavior preserved for existing Super Admin workflow.
  return hasPermission(session, "inmobiliarias", "create");
}

export function canManageInmobiliariaAssignments(session: SessionPayload) {
  return hasPermission(session, "inmobiliariaAssignments", "manage");
}

export function canAccessAdvisors(session: SessionPayload) {
  // Legacy advisor access remains on advisor core + landing combined resource for now.
  return hasPermission(session, "advisors", "read");
}

export function canCreateAdvisor(session: SessionPayload) {
  // Legacy behavior preserved until advisor_core / advisor_landing split.
  return hasPermission(session, "advisors", "create");
}

export function canEditAdvisor(session: SessionPayload) {
  // Legacy behavior preserved until advisor_core / advisor_landing split.
  return hasPermission(session, "advisors", "update");
}

export function canDeleteAdvisor(session: SessionPayload) {
  // Legacy behavior preserved until advisor_core / advisor_landing split.
  return hasPermission(session, "advisors", "delete");
}

export function canAccessProperties(session: SessionPayload) {
  // Legacy behavior preserved until properties module is migrated to v2 scopes.
  return hasPermission(session, "properties", "read");
}

export function canCreateProperty(session: SessionPayload) {
  // Legacy behavior preserved for P1 workflow; v2 matrix is not active here yet.
  return hasPermission(session, "properties", "create");
}

export function canEditProperty(session: SessionPayload) {
  // Legacy behavior preserved until properties module migration.
  return hasPermission(session, "properties", "update");
}

export function canDeleteProperty(session: SessionPayload) {
  // Legacy behavior preserved until properties module migration.
  return hasPermission(session, "properties", "delete");
}

export function canManagePropertyAssignments(session: SessionPayload) {
  return hasPermission(session, "propertyAssignments", "manage");
}

export function canManagePropertyFeatured(session: SessionPayload) {
  return hasPermission(session, "propertyFeatured", "manage");
}

export function canAccessBlog(session: SessionPayload) {
  // Legacy behavior preserved until blogs migrate to owner_type / owner_id.
  return hasPermission(session, "blog", "read");
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
