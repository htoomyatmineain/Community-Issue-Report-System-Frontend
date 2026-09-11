# Community Issues Reporting System (CIRS)

A role-based civic issue reporting frontend that lets citizens report local infrastructure problems (potholes, streetlight outages, flooding) and tracks them through government staff review to resolution.

## Overview

**Problem:** Myanmar communities lack a structured way to report and track local infrastructure issues — citizens have no visibility into whether their complaints are being addressed.

**Solution:** A full-stack reporting platform with three distinct role interfaces — citizens submit reports via a mobile-first app with map integration and photo evidence; government staff manage, assign, and resolve reports through a desktop console; administrators oversee the entire pipeline with audit logging and account approval.

**Why:** Built as a [TODO: university] CST-4105 J2EE Keystone Project (Section-C, Group-II, 2025–2026), aligned with UN SDG 11 (Sustainable Cities and Communities). Named "Kinn Htout" (meaning "caring for the community").

## Key Features

- **Three-role architecture** — Citizen (mobile-first), Government Staff (desktop console), Admin (full system oversight)
- **Report submission** — Map pin placement, category selection, photo upload, anonymous submission option
- **Interactive maps** — Leaflet with category-colored pins, marker clustering, live GPS tracking, and reverse geocoding (Nominatim)
- **Report lifecycle** — Pending Approval → Assigned → In Progress → Resolved → Closed, with staff assignment and department routing
- **Approval queues** — Admin approves citizen accounts, staff accounts, and reports before they enter the system
- **Dashboard analytics** — Stat cards, bar charts, pie charts (Recharts) showing report volume, department workload, and category distribution
- **Citizen engagement** — Leaderboard, point system, community support mechanism, and news campaigns
- **Notifications** — Polling-based unread count with cross-component sync via custom events
- **Client-side PDF export** — Full report summaries with embedded photos (jsPDF)
- **Bilingual UI** — English and Myanmar (မြန်မာ) via a custom translation system
- **Dark/light theme** — CSS variable-driven with system default preference
- **Audit logging** — Full admin action history with filtering

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Vite 6 |
| UI Components | shadcn/ui (Radix primitives), Tailwind CSS 3, Lucide icons |
| Maps | Leaflet, react-leaflet, react-leaflet-cluster |
| Charts | Recharts |
| PDF | jsPDF |
| HTTP | Axios with JWT interceptors |
| Testing | Vitest, React Testing Library, jsdom |
| Build | Vite with manual chunk splitting |
| Deployment | Vercel (SPA rewrite) |
| Language | JavaScript (ES modules) |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    BrowserRouter                     │
│                         │                            │
│  ┌──────────┬──────────┬┴──────────┬──────────────┐ │
│  │ Public   │ Citizen  │ Staff     │ Admin        │ │
│  │ Routes   │ Routes   │ Routes    │ Routes       │ │
│  │          │          │           │              │ │
│  │ Landing  │ Mobile   │ Console   │ Console      │ │
│  │ Login    │ Bottom   │ Sidebar + │ Sidebar +    │ │
│  │ Signup   │ Tab Nav  │ Topbar    │ Topbar       │ │
│  └──────────┴──────────┴───────────┴──────────────┘ │
│                                                      │
│  Providers: AuthProvider → ThemeProvider → Language   │
│                                                      │
│  Shared: apiClient (Axios) → Backend API             │
│          ProtectedRoute (role guard)                  │
└─────────────────────────────────────────────────────┘
```

**Request flow:**

```
Component → Custom Hook → API Module → apiClient (Axios) → Backend /api/*
                ↓
          useState/useEffect
          (loading, error, data states)
```

**Map flow:**

```
CitizenReportPage → useGeolocation → Browser GPS API
                                    → useReverseGeocode → Nominatim API
                 → LocationPicker → Leaflet Map → OpenStreetMap tiles
                 → reportMapApi → Backend /api/reports/map
```

## Project Structure

```
src/
├── app/
│   ├── App.jsx                    # Root: providers → router → routes
│   ├── routes/                    # Role-based route groups
│   │   ├── ProtectedRoute.jsx     # Auth + role guard
│   │   ├── AdminRoutes.jsx        # /admin/* (lazy map)
│   │   ├── StaffRoutes.jsx        # /staff/* (lazy map + departments)
│   │   └── CitizenRoutes.jsx      # Mobile-first, lazy map
│   └── providers/                 # Auth, Theme, Language contexts
│
├── features/
│   ├── auth/                      # Login, signup, JWT session
│   ├── landing/                   # Public landing page
│   ├── settings/                  # Dark mode + language toggle
│   ├── report-map/                # Shared map API + hook
│   ├── console-reports/           # Reports list, detail, tabs
│   ├── console-map/               # Full-screen admin/staff map
│   ├── console-notifications/     # Shared notifications page
│   ├── admin/                     # 8 sub-features (dashboard, approvals, ...)
│   ├── staff/                     # 4 sub-features (dashboard, departments, ...)
│   └── citizen/                   # 7 sub-features (home, map, report, ...)
│
├── components/
│   ├── ui/                        # shadcn primitives (button, dialog, ...)
│   ├── layout/                    # Sidebar, Topbar, MobileNav, shells
│   ├── common/                    # StatusBadge, DataTable, charts, ...
│   └── map/                       # Leaflet wrappers, custom divIcons
│
├── lib/
│   ├── utils.js                   # cn() helper
│   ├── constants.js               # Status/priority/category definitions
│   ├── rbac.js                    # Role → permission map
│   ├── assetUrl.js                # API-relative → absolute URL resolver
│   ├── categoryIcons.js           # SVG glyph system for categories
│   ├── reportPdf.js               # Client-side PDF generation
│   └── notificationEvents.js      # Cross-hook notification sync
│
├── hooks/                         # useDebounce, useGeolocation, useNotifications, ...
├── services/                      # apiClient (Axios), notificationsApi
├── store/                         # [Reserved for future cross-feature state]
└── test/setup.js                  # Vitest + jest-dom
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A running backend API at `http://localhost:8080/api` (see [TODO: link to backend repo])

### Installation

```bash
git clone [TODO: repo URL]
cd Community-Issue-Report-System-Frontend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:8080/api
```

### Run Locally

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Production build
npm run preview    # Preview production build
npm run test       # Run tests once
npm run test:watch # Run tests in watch mode
npm run lint       # ESLint
```

## API Endpoints

The frontend consumes a REST API. Key endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Authenticate citizen/staff/admin |
| POST | `/api/auth/register` | Citizen self-registration |
| GET | `/api/auth/me` | Rehydrate session from stored token |
| GET | `/api/reports/map/public` | Public map pins (citizen-visible) |
| GET | `/api/reports/map` | All map pins (staff/admin) |
| GET | `/api/categories` | Active report categories |
| GET | `/api/notifications` | Current user's notifications |
| GET | `/api/notifications/unread-count` | Polling badge count |
| PATCH | `/api/notifications/read-all` | Mark all notifications read |

Full API documentation: [TODO: link to backend API docs]

## Testing

```bash
npm run test       # Single run
npm run test:watch # Watch mode
```

Test files are colocated with source using the `*.test.{js,jsx}` convention.

**Coverage:**

| Area | Tests |
|---|---|
| `AuthProvider` | Session rehydration, login/logout, token lifecycle, error handling |
| `ProtectedRoute` | Auth guard, role-based redirect |
| `apiClient` | Token attachment, 401 auto-clear |
| `authApi` | Endpoint contract (URL, method, payload shape) |
| `LoginForm` | Submit flow, error display, signup link |
| `SignupForm` | Registration flow, field validation, redirect |
| `assetUrl` | Relative/absolute URL resolution |
| `citizenReportApi` | API contract |
| `useCityReports` | Data fetching |
| `useCommunitySupport` | Support toggle, daily limit, optimistic updates |

## Engineering Highlights

**1. Feature-Self-Contained Architecture**
Each feature (`admin-dashboard/`, `citizen-report/`, etc.) owns its components, hooks, API module, and barrel export. Cross-feature imports are forbidden — features communicate through shared hooks (`useNotifications`) or the API layer, not component imports.

**2. Role-Based Route Guarding**
`ProtectedRoute` checks authentication + role membership and redirects to the correct role home on mismatch — preventing a staff user from accessing citizen-only routes (and vice versa) without hardcoded fallback paths that could cause redirect loops.

**3. Lazy Loading with Manual Chunk Splitting**
Map components (`Leaflet`, `react-leaflet-cluster`) and chart libraries (`Recharts`) are lazy-loaded and split into dedicated chunks via Vite's `manualChunks`. Pages that don't use maps never download the Leaflet bundle.

**4. Custom SVG Category Icon System**
14 hand-crafted SVG glyphs are matched by category name (exact match → keyword fallback → icon key fallback), cached as stable React components, and rendered both inline and as Leaflet `divIcon` HTML strings — so categories are identifiable by shape, not just color.

**5. Cross-Hook Notification Sync**
A lightweight `CustomEvent` bridge lets the notification list (which owns read-state mutations) and the nav badge (which polls independently at 60s) update each other immediately on mark-read, without shared state.

**6. Asset URL Resolution**
Report photos are stored as server-relative paths (`/uploads/reports/<uuid>.png`). The `assetUrl()` utility detects the backend origin from `VITE_API_BASE_URL` and prepends it, so the Vite dev server (different port) can load files served by the Java backend.

## Challenges & Technical Decisions

**Problem:** Leaflet's default marker icons break under Vite due to how it resolves image asset paths.
**Decision:** All map pins use `L.divIcon` with inline SVG instead of `L.Icon.Default`.
**Why:** Eliminates the classic "marker image 404" bug entirely rather than patching it with path configuration.

**Problem:** Citizens need to report issues even when GPS permission is denied.
**Decision:** A draggable/click-to-place map pin serves as the primary location picker, with GPS as an enhancement.
**Why:** Government phone screens and slow connections make permission prompts unreliable — the fallback must be fully functional.

**Problem:** The notification badge and notification list are rendered in different components with different fetch cycles.
**Decision:** `CustomEvent`-based sync (`NOTIFICATIONS_READ_EVENT`) with a 60s polling fallback.
**Why:** Avoids lifting notification state to a global store when it's only needed in two places, while still providing instant UI feedback.

**Problem:** Category icons from the backend don't always match the icon key names in the frontend.
**Decision:** A 40+ entry alias map normalizes free-text/icon names to known keys, with a name-based glyph system as the primary path.
**Why:** Backend categories are user-created (admin CRUD) with unpredictable naming — the frontend must handle any string gracefully.

## Future Improvements

1. **Server-side notification push** — Replace the 60s polling badge with WebSocket/SSE for real-time updates
2. **Offline support** — Service worker for the citizen app (reports queue locally, sync on reconnect)
3. **Pagination** — Replace the current full-list fetches with cursor-based pagination on report tables
4. **Map clustering tuning** — Optimize `maxClusterRadius` and spiderfy behavior for high-density urban areas
5. **E2E tests** — Add Playwright tests for the critical citizen flow (signup → report → track)

## License

[TODO: Add license]
