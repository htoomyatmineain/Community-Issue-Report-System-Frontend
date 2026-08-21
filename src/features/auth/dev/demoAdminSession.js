/**
 * DEV-ONLY demo session for the Admin role. See demoCitizenSession.js for
 * why this exists and how it's gated out of production builds.
 */
export const DEMO_ADMIN_USER = {
  userId: 0,
  fullName: "System Administrator",
  email: "demo.admin@example.com",
  role: "ADMIN",
  departmentId: null,
  accountStatus: "APPROVED",
};
