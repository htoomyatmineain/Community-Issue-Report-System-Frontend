/** Role names, matching the `role` string returned by the backend (AuthResponseDTO). */
export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  CITIZEN: "CITIZEN",
};

/** Each role's shell landing route — used for post-login redirects and ProtectedRoute's role-mismatch fallback. */
export const ROLE_HOME_PATH = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.STAFF]: "/staff",
  [ROLES.CITIZEN]: "/",
};
