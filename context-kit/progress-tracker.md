# 10. SCIRS — Progress Tracker

**Current Phase:** Phase 5 — Approval, Routing & Workflow (frontend complete, built against the documented API contract ahead of the backend at the user's explicit request; backend endpoints still unbuilt)
**Last Updated:** 2026-08-22

> Agents: read this file **before** starting work and update it **after** finishing work. Mark `[x]` only when the item is actually working, not merely written.

---

## Status Legend

`[ ]` Not started `[~]` In progress `[x]` Done and verified `[!]` Blocked (add a note)

---
## Phase 0 — Analysis & Design

- [ ] Project proposal finalised and submitted
- [ ] Use case diagram
- [ ] System architecture diagram
- [ ] ER diagram matching `database-schema.md`
- [ ] Report status state-machine diagram
- [ ] UI wireframes — citizen shell
- [ ] UI wireframes — console shell
- [ ] Git repository + branch strategy
- [ ] PostgreSQL database created and reachable
- [x] Spring Boot project scaffolded with dependencies
- [ ] React + TypeScript + Tailwind + shadcn/ui scaffolded

## Phase 1 — Foundation & Authentication

### Backend
- [x] `common/exception/` — ErrorResponse, custom exceptions, GlobalExceptionHandler
- [x] `common/config/` — CORS, async, property beans
- [x] `User`, `Role` entities + `RoleName`, `AccountStatus` enums
- [x] `UserRepository`, `RoleRepository`
- [x] Auth DTOs (login, register, response, UserDTO)
- [x] `AuthService` — login
- [x] `AuthService` — citizen registration (forced role + PENDING status)
- [x] `JwtUtil` (generate, validate, extract claims)
- [x] `CurrentUser` principal
- [x] `JwtAuthenticationFilter`
- [x] `SecurityConfig` with public/protected rules
- [x] `AuthController` — login, register, me
- [x] `DataSeeder` — roles + admin account (idempotent)
- [x] Tests: login success/failure, pending block, 401 without token, 403 wrong role

### Frontend
- [x] API client with JWT injection + 401 handling
- [x] `AuthContext` + token storage
- [x] Login page
- [x] Citizen registration page
- [x] `ProtectedRoute` + role-based shell routing
- [x] `CitizenShell` skeleton (bottom tabs)
- [x] `ConsoleShell` skeleton (navbar + sidebar)

## Phase 2 — Departments & Categories

### Backend
- [x] `Department` entity, repository, DTOs, mapper
- [x] `DepartmentService` + `DepartmentController` (CRUD, soft delete)
- [x] `Category` entity, repository, DTOs, mapper
- [x] `CategoryService` + `CategoryController` (CRUD, soft delete)
- [x] Seed 6 departments
- [x] Seed default categories with department mapping
- [x] Tests: category requires active department, soft delete behaviour

### Frontend
- [x] Departments list page
- [x] Department create/edit form
- [x] Categories list page
- [x] Category create/edit form (department, colour, icon)

## Phase 3 — User Management & Approval Queues

### Backend
- [ ] `UserService` — list/filter users
- [ ] `UserService` — create staff account
- [ ] `UserService` — approve / reject / suspend citizen
- [ ] `UserService` — soft delete
- [ ] `UserController` — all user endpoints
- [ ] Tests: staff requires department, approval flow, role gates

### Frontend
- [x] Citizen accounts table
- [x] Staff accounts table
- [x] Create new staff form
- [x] Account approval queue (approve / deny)
- [x] Citizen profile page (view + edit)

## Phase 4 — Report Submission

### Backend
- [ ] `Report`, `ReportImage` entities + enums
- [ ] `ReportRepository`, `ReportImageRepository`
- [ ] `FileStorageService` interface
- [ ] `LocalStorageService` implementation
- [ ] `SupabaseStorageService` implementation
- [ ] Image validation (type, size, magic bytes, renamed file)
- [ ] `ReportCodeGenerator`
- [ ] `ReportService.createReport()` (multipart)
- [ ] `GET /api/reports/my`
- [ ] `GET /api/reports/{id}` with ownership check
- [ ] Tests: pending citizen blocked, validation, code uniqueness, ownership

### Frontend
- [x] Geolocation hook + permission-denied fallback
- [x] Report submission form (location, category, chips, description, photo)
- [x] Image preview + remove
- [x] Citizen home page with recent reports
- [x] Citizen report detail page

## Phase 5 — Approval, Routing & Workflow

### Backend
- [ ] `ReportStatusHistory` entity + repository
- [ ] `ReportComment` entity + repository
- [ ] `StatusHistoryService`
- [ ] `ReportWorkflowService` — transition matrix
- [ ] Approve endpoint (auto-route + history + notification stub)
- [ ] Reject endpoint (reason required)
- [ ] Status change endpoint (remarks)
- [ ] Resolution-photo requirement before RESOLVED
- [ ] `ReportAssignmentService` — reassign department / assign staff
- [ ] Priority endpoint
- [ ] History endpoint
- [ ] Comments endpoints (+ department mention)
- [ ] Department scoping for staff queries
- [ ] Tests: full transition matrix, history per change, department scoping

### Frontend
- [x] Console reports list (search, filters, pagination)
- [x] Report detail — Overview tab
- [x] Report detail — Timeline tab
- [x] Report detail — Comments tab
- [x] Report detail — Resolution tab + photo upload
- [x] Status change dialog
- [x] Assign / reassign dialog
- [x] Admin report approval queue
- [x] Citizen status timeline (shipped in Phase 4)

## Phase 6 — Map & Filtering

### Backend
- [ ] `ReportMapDTO` slim projection
- [ ] `GET /api/reports/map` with filters + bounding box
- [ ] Citizen visibility rule (no pending/rejected pins)
- [ ] Indexes on coordinates and status

### Frontend
- [ ] Shared `ReportMap` component (Leaflet)
- [ ] Marker clustering
- [ ] Category-coloured pins + status popups
- [ ] Citizen map tab with filter chips
- [ ] Pin bottom sheet (citizen)
- [ ] Console full-screen map view + filter rail
- [ ] Slide-over report panel (console)
- [ ] Debounced refetch on filter / bounds change

## Phase 7 — Notifications, Feedback & Gamification

### Backend
- [ ] `Notification` entity, repository, DTOs, mapper
- [ ] `NotificationService` + triggers for every event type
- [ ] Notification endpoints (list, unread count, mark read, mark all)
- [ ] `@Scheduled` "waiting too long" sweeper
- [ ] `EmailService` (`@Async`, failure-tolerant)
- [ ] `Feedback` entity, repository, DTOs, mapper, service, controller
- [ ] `PointTransaction` entity + repository
- [ ] `ScoreService` — idempotent awards + cached total
- [ ] Leaderboard query + controller
- [ ] Score awards wired into approve / reject / resolve / feedback
- [ ] Tests: duplicate-award prevention, feedback constraints, leaderboard order

### Frontend
- [ ] Notification bell + unread badge
- [ ] Notification list page (mark read)
- [ ] Feedback form on resolved reports
- [ ] Leaderboard page (own row pinned)
- [ ] Score page + point history

## Phase 8 — Dashboards & Analytics

### Backend
- [ ] Aggregate projections in `ReportRepository`
- [ ] `DashboardService`
- [ ] `/api/dashboard/admin`
- [ ] `/api/dashboard/staff`
- [ ] `/api/dashboard/departments`
- [ ] `/api/dashboard/categories`
- [ ] Optional: CSV summary export

### Frontend
- [ ] Admin dashboard (stat cards, recent registrations, pending reports)
- [ ] Staff dashboard (stat cards, compact map, monthly chart, recent table)
- [ ] Departments page (pie chart, bar chart, performance table)
- [ ] Chart empty states

## Phase 9 — Testing, Polish, Deployment & Presentation

- [ ] All priority test cases from `testing-standards.md` written and passing
- [ ] `docs/test-cases.md` completed
- [ ] `docs/bug-log.md` completed
- [ ] Postman collection exported
- [ ] Responsive pass (360 px citizen, 1280 px console, tablet)
- [ ] Accessibility pass (focus, labels, non-colour status, reduced motion)
- [ ] Loading / empty / error states verified on every page
- [ ] Demo seed dataset
- [ ] `README.md` with setup and credentials
- [ ] Diagrams updated to match shipped code
- [ ] Backend + database deployed
- [ ] Frontend deployed + smoke tested
- [ ] Presentation deck
- [ ] Demo script rehearsed (sign-up → approve → report → approve → resolve → rate → dashboard)

---

## Architectural Decisions Made During Development

Append here as work proceeds, then mirror anything significant into `project-overview.md` § Decisions Log.

| Date | Decision | Reason |
|------|----------|--------|
| 2026-08-13 | `User.departmentId` is a plain `Long` FK column, not a `@ManyToOne` to `Department`, until Phase 2 | The `Department` entity doesn't exist yet; a relation can't compile against a nonexistent type. Convert to `@ManyToOne(fetch = LAZY)` once `department/entity/Department.java` is built. |
| 2026-08-13 | `AccountNotApprovedException` maps to 403, not the 400 shown in `code-standards.md`'s generic exception-handler example | `api-standards.md` explicitly documents 403 for `PENDING`/`REJECTED`/`SUSPENDED` accounts on login. `AuthService.login`/`.me` are `@Transactional(readOnly = true)` — `User.role` is lazy and `open-in-view=false`, so the mapper needs the Hibernate session still open when it reads `user.getRole()` (see BUG-01 in `docs/bug-log.md`). |
| 2026-08-14 | `DepartmentRepository`/`CategoryRepository` expose `findByActiveTrue()`, not the `findByIsActiveTrue()` name written in `database-schema.md`'s original draft | Both entities store the flag as a field named `active` with a Java-Bean-compliant `isActive()` getter (matching `User.active`/`isActive()`). Spring Data's derived-query parser resolves the property name from the JavaBean spec (`active`), so `findByIsActiveTrue()` fails at startup with `PropertyReferenceException: No property 'isActive' found`. `database-schema.md` has been corrected to match the working method name (see BUG-02 in `docs/bug-log.md`). |
| 2026-08-14 | `User.departmentId` stays a plain `Long` FK, not converted to `@ManyToOne(fetch = LAZY) Department`, even though `Department` now exists | The field is only populated for staff accounts, and staff creation is Phase 3 work. Converting now would touch `AuthMapper`, `DataSeeder`, and every Phase 1 test for no behavioural gain this phase. Revisit when `UserService.createStaff()` is built. |
| 2026-08-17 | `ProtectedRoute`'s role-mismatch fallback defaults to the current user's own `ROLE_HOME_PATH`, not a hardcoded `"/"` | A STAFF/ADMIN user landing on the CITIZEN-only `"/"` would otherwise be redirected to `fallback="/"` — the same path — looping forever. Defaulting to the caller's own role home (still overridable via an explicit `fallback` prop) always lands somewhere that role can actually render. Covered by `ProtectedRoute.test.jsx`. |
| 2026-08-17 | `AuthProvider` rehydrates the session via `GET /api/auth/me` on mount when a token is in `localStorage`, exposing `isInitializing` so `ProtectedRoute` renders nothing (not a flash-redirect to `/login`) until it resolves | `api-standards.md` documents `me` as existing specifically for this; without it, refreshing any page while logged in would drop the session even with a valid token still stored. An invalid/expired token clears itself on a rejected `me()` call. |
| 2026-08-17 | Added `demoStaffSession.js` / `demoAdminSession.js`, mirroring the existing `demoCitizenSession.js` dev-only bypass pattern | There's still no seeded backend to log in against for any role. The existing citizen-only demo button couldn't exercise `ConsoleShell`/`StaffLayout`/`AdminLayout` at all. Same guarantees as the original: gated by `import.meta.env.DEV`, stripped from production builds. |
| 2026-08-17 | Extracted a shared `ConsoleShell` (`components/layout/`) composing `PageShell` + `Sidebar` + `Topbar`, used by both new `StaffLayout` and `AdminLayout` route wrappers | `ui-rules.md` specs one console shell for Admin and Staff; building two separate copies would duplicate the nav/topbar composition for no reason. Role-specific nav items and the real `useAuth()` user stay in each thin `*Layout.jsx`. |
| 2026-08-21 | Departments/Categories create-edit forms are shadcn `Dialog`s opened from the list page, not separate routed pages | Keeps the list page as the single source of truth with no route-state sync needed; matches `ui-rules.md`'s existing Dialog pattern for confirmations. Generated the missing shadcn primitives this required — `table`, `dialog`, `select`, `label`, `textarea`, `badge`, `switch`, `alert-dialog`, `sonner` — via `npx shadcn add`, and rewrote the generated `sonner.jsx` to read the project's own `ThemeProvider`/`useTheme` instead of the `next-themes` package the CLI assumes (removed that dependency). Added `PageHeader` and `ConfirmDialog` to `components/common/`, both named but previously unbuilt in `ui-rules.md`. |
| 2026-08-21 | The department/category edit dialog includes an `active` `Switch` sent in the `Update*DTO` payload, giving admins a way to reactivate a soft-deleted record | `api-standards.md` documents soft-delete via `DELETE` but no reactivate endpoint; reusing the standard `PUT` (full resource update) to flip `active` back on is the only documented path back from an accidental delete, since data-integrity note #2 implies reactivation is possible without saying how. Judgment call — revisit if the backend's `Update*DTO` turns out not to accept `active`. |
| 2026-08-21 | `staff-departments` is now a real read-only list (staff can view but not mutate departments), independent of the admin feature's `departmentsApi.js` | `api-standards.md`'s role matrix gives staff read-only access to `/api/departments`. Per this repo's "avoid cross-feature imports" rule, `staff-departments` has its own tiny api file rather than importing the admin feature's — small duplication, but keeps the two features self-contained. |
| 2026-08-21 | Phase 3 frontend was built against `api-standards.md`'s documented `/api/users/*` contract even though Phase 3 backend is entirely unbuilt (`UserService`/`UserController` don't exist yet) | Explicit user request, same out-of-sequence pattern as the Phase 1 frontend. Verified with Playwright against a route-mocked backend (real dev server has nothing to hit yet) — all four flows (citizens table, staff creation, approve/deny, profile edit) render and submit correctly with zero console errors. Revisit field names (`CreateStaffDTO`, account-reject payload) once the real backend DTOs land — they were inferred from `database-schema.md` and the report-reject pattern, not confirmed against real code. |
| 2026-08-21 | Citizens can only edit `fullName` and `phone` on their own profile; `email`, `dateOfBirth`, and `nrcNumber` render read-only even though `PUT /api/users/{id}` is documented as a general profile update | Those three fields are identity-verification data captured at registration (`CitizenRegisterDTO`); letting a citizen silently change NRC/DOB post-approval would undermine the approval step without any documented re-verification flow. Judgment call, not spec'd either way — revisit if the backend's `UpdateUserDTO` turns out to reject partial payloads (i.e. requires all fields), which would force sending the unchanged read-only fields through too. |
| 2026-08-21 | Account reject/deny sends `{ reason }` as the PATCH body, not `{ rejectionReason }` (the field name used for report rejection) | `api-standards.md`'s User Management table only says "`reject` — accountStatus → REJECTED + reason" (lowercase, generic) versus the Report endpoints' explicit `rejectionReason` in the request body example. Went with the literal wording since no example body is given for the account-reject endpoint. Low-confidence guess — flag for correction once the backend DTO is confirmed. |
| 2026-08-22 | `citizen-report`'s and `citizen-home`'s mock data (`citizenReport.mock.js`, `citizenHome.mock.js`) was already fully replaced with real calls against `GET/POST /api/reports`, `GET /api/reports/{id}`, `GET /api/reports/{id}/history`, and `POST /api/feedback` — not just the Phase 4 subset (create/my/detail) | `ui-rules.md`'s citizen Report Detail route bundles status timeline and the resolved-report feedback form into one page spec, and both endpoints are fully documented in `api-standards.md`, even though `build-plan.md` files them under Phase 5/7 backend work. Same precedent as wiring all of `/api/users/*` during Phase 3. `getReportById` now does `Promise.all([GET report, GET history])` and folds history rows into `{label, at}` steps client-side (first row's `oldStatus === null` renders as "Report submitted", others use `REPORT_STATUS` labels plus any `remarks`). |
| 2026-08-22 | `citizenHomeApi.getHomeSummary()` now returns real `recentReports` from `GET /api/reports/my` but keeps `score.points`, `score.leaderboardRank`, and `unreadNotifications` as static placeholders (`0`, `null`, `0`), not mocked numbers | Score/leaderboard (`/api/score/me`) and notifications (`/api/notifications/unread-count`) are genuinely Phase 7/8 — no documented endpoint exists yet to wire them against, unlike the report-history precedent above. Showing `0 pts` is honest; showing a fabricated `1,240 pts` would not be. Revisit once those endpoints ship. |
| 2026-08-22 | The report submission form now requires a captured GPS position before allowing submit (was previously optional, sending `null` lat/lng) | `database-schema.md`: `reports.latitude`/`longitude` are `NOT NULL`. The old mock-backed code let the citizen submit with no location at all, which would 400 against a real backend. `useGeolocation.locate()` now also auto-fires on mount (`ui-rules.md`: "GPS is captured automatically on open"), so most citizens never see the extra prompt — it only surfaces if they deny permission. |
| 2026-08-22 | Report category options in `NewReportForm` now come from `GET /api/categories` (real numeric `categoryId`), not the hardcoded `ISSUE_CATEGORIES` string-id list still used by `citizen-map` (untouched, Phase 6 scope) | The mock had been submitting `categoryId: "roads"` — a string that would fail `@NotNull Long categoryId` validation against a real backend. Also added `CATEGORY_PROBLEM_PRESETS` (keyed by the category's `icon`) to `lib/constants.js` so the "what's wrong" chips are per-category as `ui-rules.md` specifies, instead of one fixed set for every category. |
| 2026-08-22 | Created a single top-level shared feature, `src/features/console-reports/`, for the Reports list + 4-tab detail page — used by both `AdminRoutes.jsx` (`/admin/reports`) and `StaffRoutes.jsx` (`/staff/reports`), not two role-prefixed copies | `ui-rules.md` specs one Reports list/detail page for both Admin and Staff ("Reports \| /console/reports \| Admin, Staff"), differing only in a few gated details (Department column/filter, the Assign-department action — both `isAdmin`-gated inline via `useAuth().role`). Duplicating a ~10-component page across `admin-reports`/`staff-reports` for that little variance would violate "avoid cross-feature imports" in spirit — this instead follows the same carve-out `CLAUDE.md` already grants `auth/`: "shared across roles" features live outside the per-role wrapper folders. Deleted the `staff-reports` stub entirely rather than keep it as a redundant pass-through. |
| 2026-08-22 | Moved `StatusTimeline.jsx` from `citizen-report/components/` to `components/common/` and reused it (unchanged) in `console-reports`' Timeline tab | It's a pure presentational component (`steps: [{label, at}]`, styled with the shared shadcn tokens both shells already use) with zero citizen-specific logic — the console history mapping (`ReportStatusHistory` rows → `{label, at}`, first row's `oldStatus === null` → "Report submitted", later rows include `remarks`) lives in each consumer (`citizenReportApi.js`, `TimelineTab.jsx`), not the component itself. |
| 2026-08-22 | The generic "Change status" dialog only offers `ASSIGNED→IN_PROGRESS`, `ASSIGNED→RESOLVED`, `IN_PROGRESS→RESOLVED`, `RESOLVED→CLOSED`, `RESOLVED→IN_PROGRESS` — never `PENDING_APPROVAL→ASSIGNED`/`REJECTED` | Those two transitions are `database-schema.md`'s matrix, but they only ever happen through the dedicated `PATCH /reports/{id}/approve` and `.../reject` endpoints (auto-routing, rejection reason) — i.e. the separate Report Approvals queue, not the generic status-remarks dialog. `StatusChangeDialog` hides/disables itself (no options) when a report is still `PENDING_APPROVAL` or in a terminal state. |
| 2026-08-22 | Moving a report to `RESOLVED` via `StatusChangeDialog` requires attaching a photo in the same dialog — it calls `POST /reports/{id}/images` (upload) then `PATCH /reports/{id}/status`, sequentially, and blocks submit with an inline error if neither an existing resolution photo nor a newly-picked file is present | `database-schema.md` / `ui-rules.md`: "moving to RESOLVED requires at least one completion photo and blocks submit until one is attached." Verified with Playwright: submitting with no photo shows "Attach a completion photo before resolving." and makes no network call; attaching one succeeds and the badge updates to Resolved. |
| 2026-08-22 | `ReportDTO` is assumed to carry `categoryName`, `departmentName`, `reporterName`, `assignedStaffName`, and an embedded `images: [{id, imageUrl, imageType}]` array (not just the raw FK ids `database-schema.md` lists), and `GET /api/reports/{id}` is assumed to embed `feedback: {rating, comment} \| null` | Consistent with every other enrichment this codebase has already assumed and gotten right for Department/Category DTOs (`departmentName` on `CategoryDTO`, etc.) — a console table full of bare numeric ids would be unusable. The `feedback` embed specifically is a low-confidence guess (no dedicated fetch-by-report endpoint is documented for Feedback); flag for correction once the real DTO ships, same caveat logged in the Phase 4 entry above for the citizen-side equivalent. |

---

## Known Issues / Blockers

| ID | Description | Impact | Owner | Status |
|----|-------------|--------|-------|--------|
| | | | | |
