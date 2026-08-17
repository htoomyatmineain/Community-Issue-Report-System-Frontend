/**
 * DEV-ONLY demo session for the Citizen role.
 *
 * There is no seeded backend account to log in with yet (the backend only
 * has /api/auth/register + /api/auth/login wired, no demo data), so the
 * "Continue as Citizen (Demo)" button on the login page uses this to fill
 * AuthProvider's session directly and skip the real network call.
 *
 * This never reaches production: LoginForm only renders the button when
 * `import.meta.env.DEV` is true, which Vite strips out of production builds.
 *
 * To remove once real citizen login is connected end-to-end: delete this
 * file and the "DEMO_LOGIN" block in LoginForm.jsx.
 */
export const DEMO_CITIZEN_USER = {
  userId: 0,
  fullName: "Ei Aint",
  email: "demo.citizen@example.com",
  role: "CITIZEN",
  departmentId: null,
  accountStatus: "APPROVED",
};
