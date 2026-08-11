# Community Issues Reporting System

React + Vite + Tailwind + shadcn/ui. Feature-based folder structure.

## Roles
- Admin (seeded in DB, no signup)
- Government Staff (created by Admin, no public signup)
- Citizen (public signup/login)

## Folder conventions
- src/features/{role}/{role}-{feature}/ — each feature has components/, hooks/, api/, index.js, grouped under a wrapper folder per role (admin/, citizen/, staff/); auth/ stays at the top level since it's shared across roles
- src/components/ui — shadcn primitives only, role-agnostic
- src/components/layout, src/components/common — shared, non-shadcn
- src/lib/rbac.js — role → permission map
- ref-img/ — UI references, lives outside src, never imported into code

## Naming
- Feature folders prefixed by role: admin-*, citizen-*, staff-*
- Components PascalCase, hooks useX.js, api files xApi.js

## Notes
- Keep each feature's logic self-contained; avoid cross-feature imports
- Mobile-first for citizen-* features, desktop-first for staff-* and admin-*

## Folder Structure
community-issues-reporting/
├── ref-img/                          # kept OUTSIDE src, never bundled
│   ├── admin/
│   ├── citizen/
│   └── gov-staff/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   ├── routes/
│   │   │   ├── AdminRoutes.jsx
│   │   │   ├── CitizenRoutes.jsx
│   │   │   ├── StaffRoutes.jsx
│   │   │   ├── PublicRoutes.jsx        (login/signup)
│   │   │   └── ProtectedRoute.jsx      (role guard)
│   │   └── providers/
│   │       ├── AuthProvider.jsx
│   │       └── ThemeProvider.jsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/ (LoginForm.jsx, SignupForm.jsx)
│   │   │   ├── hooks/ (useLogin.js, useSignup.js)
│   │   │   ├── api/ (authApi.js)
│   │   │   └── index.js
│   │   │
│   │   ├── admin/
│   │   │   ├── admin-dashboard/
│   │   │   ├── admin-citizens/        (citizen accounts table)
│   │   │   ├── admin-staff/           (staff accounts table + create staff)
│   │   │   └── admin-approvals/       (account + report approval queues)
│   │   │
│   │   ├── citizen/
│   │   │   ├── citizen-home/
│   │   │   ├── citizen-map/
│   │   │   ├── citizen-leaderboard/
│   │   │   ├── citizen-report/        (new report + history)
│   │   │   └── citizen-profile/
│   │   │
│   │   └── staff/
│   │       ├── staff-dashboard/
│   │       ├── staff-reports/         (table, filters, assign, status)
│   │       ├── staff-map/
│   │       ├── staff-departments/     (workload, performance charts)
│   │       ├── staff-settings/        (users/roles/categories/departments)
│   │       └── staff-notifications/
│   │
│   ├── components/
│   │   ├── ui/                        # shadcn-generated primitives
│   │   ├── layout/                    # Sidebar, Topbar, MobileNav, PageShell
│   │   └── common/                    # StatusBadge, EmptyState, DataTable
│   │
│   ├── lib/
│   │   ├── utils.js                   # cn() etc.
│   │   ├── constants.js               # categories, statuses, departments
│   │   └── rbac.js                    # role → permission map
│   │
│   ├── hooks/                         # useDebounce, useGeolocation, etc.
│   ├── store/                         # zustand/redux slices (auth, ui)
│   ├── services/                      # axios instance, api wrappers
│   ├── assets/
│   ├── styles/globals.css
│   ├── main.jsx
│   └── index.css
│
├── components.json                    # shadcn config
├── tailwind.config.js
├── vite.config.js
└── package.json