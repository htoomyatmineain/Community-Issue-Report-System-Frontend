/**
 * Role -> permission map.
 * Roles: admin (seeded, no signup), staff (created by admin, no public
 * signup), citizen (public signup/login).
 */
export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  CITIZEN: "citizen",
};

export const PERMISSIONS = {
  MANAGE_STAFF: "manage_staff",
  MANAGE_CITIZENS: "manage_citizens",
  APPROVE_ACCOUNTS: "approve_accounts",
  APPROVE_REPORTS: "approve_reports",
  MANAGE_REPORTS: "manage_reports",
  ASSIGN_REPORTS: "assign_reports",
  CREATE_REPORT: "create_report",
  VIEW_LEADERBOARD: "view_leaderboard",
  MANAGE_SETTINGS: "manage_settings",
};

const rolePermissions = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_STAFF,
    PERMISSIONS.MANAGE_CITIZENS,
    PERMISSIONS.APPROVE_ACCOUNTS,
    PERMISSIONS.APPROVE_REPORTS,
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.MANAGE_REPORTS,
    PERMISSIONS.ASSIGN_REPORTS,
    PERMISSIONS.MANAGE_SETTINGS,
  ],
  [ROLES.CITIZEN]: [PERMISSIONS.CREATE_REPORT, PERMISSIONS.VIEW_LEADERBOARD],
};

/** Does `role` have `permission`? */
export function can(role, permission) {
  return Boolean(rolePermissions[role]?.includes(permission));
}
