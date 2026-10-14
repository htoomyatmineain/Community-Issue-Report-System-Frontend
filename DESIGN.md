# Kinn Htout Design System Specification (`DESIGN.md`)
*Community Issues Reporting System (CIRS) — Official Design System & UI Architecture Contract*

---

## 1. System Philosophy & Brand Identity

Kinn Htout is a civic platform connecting citizens, municipal dispatchers, and administrative authorities to report, track, and resolve urban infrastructure issues.

The design identity balances **civic credibility, high legibility, and modern tactile precision**:
- **Utilitarian & Plain:** High clarity over decorative noise. The interface never competes with map data or photographic evidence.
- **Supabase-Style Dark Architecture:** Depth is achieved through layered near-black surfaces, subtle tone shifts, and hairline borders—never muddy, heavy drop shadows.
- **Brand Primary `#237FEA`:** A vibrant, dependable municipal cobalt blue representing civic action and trust.
- **System Accent `#FF7E54`:** A high-emphasis amber-coral reserved exclusively for high-priority alerts and critical signals.

---

## 2. Dual-Shell Architecture

The platform has **two distinct shells** residing in the same codebase. Components, layouts, and navigation paradigms must never be mixed between shells:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KINN HTOUT PLATFORM                             │
├───────────────────────────────────┬────────────────────────────────────┤
│         CITIZEN SHELL             │           CONSOLE SHELL            │
│         (Role: Citizen)           │      (Roles: Staff & Admin)        │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Mobile-first (360px–430px)      │ • Desktop-first (1280px+)          │
│ • Centered column (max-w-md)      │ • Full viewport workbench          │
│ • Floating squircle bottom nav    │ • Fixed left sidebar (w-[250px])   │
│ • Floating squircle action button │ • Topbar header + breadcrumbs      │
│ • Fast, photo-centric reporting   │ • High-density data tables/metrics │
└───────────────────────────────────┴────────────────────────────────────┘
```

### 2.1 Citizen Shell (Mobile-First / iOS Tactile Minimalism)
The Citizen experience is engineered around **Apple iOS / HIG mobile ergonomics, one-handed thumb navigation, and tactile touch feedback**.

#### 2.1.1 Viewport & Thumb-Zone Ergonomics
- **Canvas:** Centered mobile column (`max-w-md mx-auto min-h-screen bg-background pb-24 pt-14 md:border-x md:border-border/80 md:shadow-2xl`). Outside container renders calm muted canvas (`bg-surface-muted`).
- **Thumb-Zone Hierarchy:**
  - **Lower 40% (Primary Action Zone):** Reserved for high-frequency interactive controls: Bottom Navigation tabs, Report FAB button, quick filter chips, and primary submission buttons.
  - **Middle 40% (Interactive Reading Zone):** Issue cards, map pins, category grids, and comment inputs.
  - **Upper 20% (Orientation Zone):** Brand logo, notification bell, user avatar, and page titles.
- **Clearance Spacing:**
  - Top padding: `pt-16` (64px) for fixed TopBar.
  - Bottom padding: `pb-24` (96px) clearance so floating navigation bars never obscure content or buttons.
- **Touch Target Rule:** Universal minimum tap target of **44×44px** for all buttons, icons, and interactive rows, with $\ge$ 8px gap between targets.

#### 2.1.2 TopBar Chrome (`CitizenTopBar.jsx`)
- **Structure:** 64px (`h-16`) fixed solid container (`border-b border-border bg-background`).
- **Home State:** Prominent Kinn Htout brand logo on left (`h-12 w-auto`), right-aligned notification bell with unread indicator pip (`rounded-full size-2 bg-destructive`), and deterministic avatar (`size-8 rounded-full`).
- **Inner Page State:** Squirclic back button (`size-9 rounded-xl hover:bg-muted active:scale-95`), centered or left-aligned page title (`text-base font-semibold tracking-tight text-foreground`), optional right action.

#### 2.1.3 Floating Squircle Bottom Navigation (`MobileNav.jsx`)
- **Container:** Suspended floating pill (`bottom-4 h-14 rounded-2xl border border-border bg-card shadow-lg`).
- **Inactive Tab:** Minimalist icon-only (`size-5 text-muted-foreground hover:text-foreground active:scale-90 transition-transform`).
- **Active Tab:** Smooth morphing pill expansion (`flex-[1.4] bg-nav-active text-brand font-semibold rounded-xl text-xs`) revealing icon + text label.

#### 2.1.4 Primary Action Report FAB
- **Geometry:** 56×56px (`h-14 w-14`) squircle (`rounded-2xl`).
- **Styling:** Municipal cobalt blue (`bg-brand text-white shadow-lg shadow-brand/30 hover:shadow-brand/45 active:scale-95`).
- **Icon:** Universal `Plus` action icon (`size-[26px] stroke-[2.4]`).

#### 2.1.5 Mobile Component Kit (iOS Inset Grouped Standard)
- **City Feed Cards (`CityReportsSection.jsx`):** Standalone Inset Card (`rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden active:scale-[0.99]`), 16:10 aspect ratio image, floating category icon tag (`backdrop-blur-md bg-black/60 text-white rounded-md text-xs`), location pill with map pin, community support upvote heart button with spring bounce (`active:scale-90`), and official civic status badge.
- **Editorial Banners (`NewsCampaignsCarousel.jsx`):** Full-bleed negative margin swipe container (`-mx-5 px-5 scrollbar-none snap-x`), 208px height (`h-52 rounded-2xl border border-border/60 shadow-sm`), dark gradient scrim overlay with legible white text and glass pill CTA.
- **Inset Grouped Lists & History (`Leaderboard`, `Score`, `Report Status`):**
  - Wrapper: `rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs divide-y divide-border/60`.
  - Row: `p-4 flex items-center justify-between hover:bg-muted/40 active:bg-muted/70 transition-colors`.
  - Monospace tabular metrics (`tabular-nums font-mono text-sm font-semibold text-foreground`).
- **Hero Podium & Score Widget (`CitizenScorePage`, `CitizenLeaderboardPage`):**
  - Gradient squircle card (`rounded-2xl bg-gradient-to-br from-brand to-brand-hover p-6 text-white shadow-md shadow-brand/20`).
  - Top 3 podium rankings with gold (`#F59E0B`), silver (`#94A3B8`), and bronze (`#D97706`) squircle badges.
- **Mobile Form Fields (`NewReportForm.jsx`):**
  - Inputs: `h-12` (48px) touch-optimized height with `rounded-xl border-input bg-surface-muted/60 focus:bg-background`.
  - Inset Map Picker: `h-64 rounded-2xl border border-border/80 overflow-hidden shadow-xs` with GPS action squircle.
  - Photo Uploader: `rounded-2xl border-2 border-dashed border-border p-4` with thumbnail grid and remove badges.

#### 2.1.6 Tactile Feedback & Micro-Interactions
- **Active Press Scales:** `active:scale-[0.98]` on cards/banners, `active:scale-95` on buttons/FAB, `active:scale-90` on icon triggers.
- **Transition Durations:** Snappy 150ms–200ms ease-out transitions (`duration-150 ease-out`).
- **Toast Notifications:** Suspended with bottom-20 clearance so toasts float cleanly above the bottom navigation.

### 2.2 Console Shell (Desktop-First / macOS Workbench Minimalism)
The Government Staff and Admin side adopts **Apple macOS / iPadOS workbench minimalism**: high information density paired with calm optical hierarchy, restrained font weights, hairline dividers, and Inset Grouped card structures.
- **Sidebar (`Sidebar.jsx`):** Fixed left navigation (`w-[256px] sticky top-0 h-screen border-r border-console-border/70 bg-surface select-none`).
  - Section headers: micro uppercase tracking (`text-[11px] font-semibold uppercase tracking-wider text-ink-muted/70 px-3 pb-1`).
  - Navigation items: macOS sidebar capsules (`rounded-lg px-3 py-2 text-[13px] font-medium tracking-tight transition-all active:scale-[0.99]`). Inactive items remain quiet (`text-ink/75 hover:bg-surface-muted/80 hover:text-ink`); active items adopt an illuminated tint (`bg-nav-active text-brand font-semibold shadow-xs`).
  - User trigger: macOS Inset pill card at the bottom (`rounded-xl p-2 border border-transparent hover:border-console-border/60 hover:bg-surface-muted/70 active:scale-[0.99]`).
- **Topbar (`Topbar.jsx`):** 56px (`h-14`) solid header (`sticky top-0 z-20 border-b border-console-border bg-surface px-6`).
  - Breadcrumb / department badge: subtle inset pill (`rounded-md border border-console-border/70 bg-surface-muted/60 px-2.5 py-1 text-xs font-semibold tracking-tight text-ink`).
  - Controls: squircle action buttons (`size-9 rounded-xl hover:bg-surface-muted active:scale-95 text-ink-muted/80 hover:text-ink`).
- **Page Shell (`PageShell.jsx`):** Calm inset canvas (`bg-surface-muted/60`) with centered responsive frame (`max-w-[1440px] mx-auto p-6 lg:p-8`).
- **Data Workflows & Inset Grouped Tables:**
  - Table containers use Inset Grouped wrappers (`rounded-xl border border-console-border/70 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden`).
  - Column headers: muted background (`bg-surface-muted/40 border-b border-console-border/70 text-[11px] font-semibold uppercase tracking-wider text-ink-muted/80`).
  - Table rows: hairline dividers (`border-b border-console-border/60 hover:bg-surface-muted/40 transition-colors last:border-b-0`).
  - Row action buttons: subdued outline/ghost squircles (`size-7` or `size-8 rounded-lg active:scale-95`) rather than heavy blue buttons, preventing repetitive visual noise.
- **Metric Cards (`StatCard.jsx`):** Apple widget minimalism (`rounded-xl border border-console-border/70 bg-surface p-5 shadow-xs`). Numeric values rendered in `font-display text-3xl font-semibold tracking-tight tabular-nums`.

---

## 3. Typography Specification

### 3.1 Font Stacks
| Category | Font Family | Fallback Stack | Purpose |
| :--- | :--- | :--- | :--- |
| **Sans / UI / Display** | `Stack Sans Text` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif` | All general UI, headings, buttons, body copy |
| **Monospace** | `Source Code Pro` | `Menlo, Monaco, Consolas, "Liberation Mono", monospace` | Report IDs, timestamps, numeric stats, badges |
| **Bilingual Localized** | `Noto Sans Myanmar` | `var(--font-sans)` | Burmese language mode (`html[data-language="my"]`) |

### 3.2 Weight Restraint & Hierarchy (Apple HIG Inspired)
Hierarchy is achieved through **scale, optical letter-spacing, and subtle ink contrast**, avoiding overly aggressive font weights:
- **Hero & Page Titles:** `text-lg` or `text-2xl`, `font-semibold` (600), `letter-spacing: -0.02em` (`tracking-tight`)
- **Section Headings:** `text-lg` (18px) for primary mobile landmark sections (e.g. Home Feed, News), `text-base` or `text-sm` (500/600) for compact console panels, `letter-spacing: -0.02em` (`tracking-tight`)
- **Body Copy:** `text-sm` (14px) or `text-base` (16px), `font-normal` (400), `leading-relaxed`
- **Buttons & Nav Tabs:** `text-sm` (14px) or `text-xs` (12px for active nav labels), `font-medium` (500)
- **Code / Status Badges:** `text-xs` (12px), `font-mono`, `font-semibold`, uppercase, `tracking-wider`

### 3.3 Anti-Halation Typography Palette (Option C: Deep Municipal Slate)
Pure black (`#000000` or `#020617`) against a white canvas creates extreme ~21:1 luminance contrast, leading to **optical halation, visual vibration, and rapid eye fatigue** during civic data entry and dispatch monitoring. Kinn Htout uses the **Deep Municipal Slate** (Stripe/Civic style) typography architecture, infusing a micro-hint of the civic blue into the text tone:

| Layer | Light Mode Token | Hex Code | Dark Mode Token | Hex Code | Contrast Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Text (Headings / Body)** | `--foreground` / `--ink` | `#0F172A` (`slate-900`) | `--foreground` / `--ink` | `#F1F5F9` (`slate-100`) | ~16.8:1 (AAA) |
| **Secondary Text (Captions / Meta)** | `--muted-foreground` / `--ink-muted` | `#64748B` (`slate-500`) | `--muted-foreground` / `--ink-muted` | `#94A3B8` (`slate-400`) | ~4.7:1 (AA) |
| **Brand Ink (On Primary)** | `--ink-on-brand` | `#FFFFFF` | `--ink-on-brand` | `#FFFFFF` | ~4.5:1 (AA) |

---

## 4. Design Tokens & Color Architecture

### 4.1 Theme Architecture
The application defaults to Dark Mode via `<ThemeProvider defaultTheme="dark">`. Tokens adapt via CSS custom properties between `:root` (Light) and `.dark` (Dark).

```
Layered Dark Depths:
  #0f0f0f  ───  Inset / Control Canvas  (--surface-muted: inputs, table headers, deep canvas)
  #171717  ───  Page Canvas             (--background: main app body)
  #1c1c1c  ───  Panel / Card Surface    (--card, --popover, --surface: elevated cards)
  #242424  ───  Interactive Surface     (hover states, active item backdrop)
  #2e2e2e  ───  Default Border          (--border, --console-border: hairlines)
  #393939  ───  Interactive Border      (--input: focus rings, input outlines)
```

### 4.2 Semantic Palette Reference
| Token | Light Theme | Dark Theme | Purpose |
| :--- | :--- | :--- | :--- |
| `--foreground` / `--ink` | `#0F172A` (Municipal Slate) | `#F1F5F9` (Slate Off-white) | Primary text, headings, prominent numbers |
| `--muted-foreground` / `--ink-muted` | `#64748B` (Slate Muted) | `#94A3B8` (Slate Light) | Secondary descriptions, timestamps, metadata |
| `--primary` / `brand` | `#237FEA` | `#237FEA` | Primary CTAs, active highlights, key links |
| `--brand-hover` | `#1367C8` | `#1A6CD1` | Button hover and pressed states |
| `--highlight` | `#FF7E54` | `#FF7E54` | System alert accent, high-priority flags |
| `--background` | `#FFFFFF` | `#171717` | Canvas background |
| `--card` / `--surface` | `#FFFFFF` | `#1C1C1C` | Card and sheet surfaces |
| `--surface-muted` | `#F4F5F7` | `#0F0F0F` | Inset backgrounds, table headers, text inputs |
| `--border` | `#E2E4EA` | `#2E2E2E` | Container borders and dividers |
| `--input` | `#E2E4EA` | `#393939` | Form input borders |
| `--nav-active-bg` | `#DEECFC` | `rgba(35, 127, 234, 0.12)` | Active tab/nav capsule fill |

### 4.3 Civic Status Tokens
Status tokens provide semantic consistency across tickets, feeds, and tables. Every status renders an **icon + label** so color is never the single differentiator:

| Status Key | Status Label | Accent Color | Wash Background (Dark) | Wash Background (Light) | Icon |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PENDING_APPROVAL` | Pending Approval | `#F5A623` (Amber) | `rgba(245, 166, 35, 0.12)` | `#FEF3C7` | `Clock` |
| `ASSIGNED` | Assigned | `#7CB0F5` (Blue) | `rgba(35, 127, 234, 0.12)` | `#DBEAFE` | `UserCheck` |
| `IN_PROGRESS` | In Progress | `#A5B4FC` (Indigo) | `rgba(99, 102, 241, 0.14)` | `#E0E7FF` | `Wrench` |
| `RESOLVED` | Resolved | `#6EE7B7` (Green) | `rgba(16, 185, 129, 0.13)` | `#DCFCE7` | `CheckCircle2` |
| `CLOSED` | Closed | `#B4B4B4` (Slate) | `rgba(255, 255, 255, 0.06)` | `#F1F5F9` | `Archive` |
| `REJECTED` | Denied | `#F2686B` (Red) | `rgba(229, 72, 77, 0.12)` | `#FEE2E2` | `XCircle` |

---

## 5. System Border-Radius Scale

The system border radius is derived mathematically from the root `--radius: 0.625rem` (10px). All components must adhere strictly to this scale:

| Token / Class | Expression | Computed Size | Application |
| :--- | :--- | :--- | :--- |
| `rounded-2xl` | `calc(var(--radius) + 8px)` | **18px** | Floating Mobile Nav bar, Report FAB button, Dialog modals |
| `rounded-xl` / `rounded-console` | `calc(var(--radius) + 4px)` | **14px** | Inset Grouped cards & tables, Stat widgets, Segmented controls, city feed cards |
| `rounded-lg` | `var(--radius)` | **10px** | Sidebar navigation capsules, table action buttons, search inputs |
| `rounded-md` | `calc(var(--radius) - 2px)` | **8px** | Standard Buttons (`<Button>`), Form inputs (`<Input>`), Selects, Squircle Badges |
| `rounded-sm` | `calc(var(--radius) - 4px)` | **6px** | Mini category tags, color swatches |
| `rounded-full` | `9999px` | **Full** | User Avatars, notification count pips, circular toggles only |

---

## 6. Iconography Standards

Kinn Htout utilizes **Lucide React** (`lucide-react`) exclusively.

### 6.1 Sizing Rules
- **Micro / Inline:** `size-3.5` (14px) – Form hints, chevrons, mini pills.
- **Standard UI:** `size-4` (16px) – Button leading icons, table action buttons, input adornments.
- **Navigation:** `size-5` (20px) – Bottom mobile tabs, desktop sidebar links, top bar bells.
- **Hero / Action FAB:** `size-[26px]` (stroke width `2.4`) – Floating report action button.
- **Empty States / Banners:** `size-9` to `size-12` (36px–48px) – Empty state placeholders, score trophies.

### 6.2 Key Icon Assignments
- **Leaderboard / Civic Rank:** `Medal` (signifying verified civic points and podium placement).
- **Report Submission FAB:** `Plus` (clean, inviting universal action for creating a report).
- **Citizen Navigation:**
  - Home: `House`
  - Map: `Map`
  - Report: `Plus` (Raised FAB)
  - Leaderboard: `Medal`
  - Settings: `Settings`

---

## 7. Component Library Guidelines

### 7.1 Primitives (`src/components/ui/`)
Built with Radix UI + Tailwind CSS (`shadcn/ui` foundation):
- `Button`: Variants `default` (`bg-primary`), `outline`, `secondary`, `ghost`, `destructive`, `highlight`. Standard height `h-10 px-4` (`rounded-md`).
- `Input` / `Textarea`: Border `border-input bg-surface-muted`, focus ring `focus-visible:ring-ring`.
- `Card`: Surface `bg-card border-border shadow-sm rounded-lg`.
- `Dialog` / `AlertDialog`: Backdrop blur overlay with `bg-card rounded-lg border-border`.

### 7.2 Shared Civic Components (`src/components/common/`)
- `StatusBadge`: The **only** component authorized to render a report status. Always includes icon and label.
- `PriorityBadge`: Visual indicator for `LOW`, `NORMAL`, `HIGH`, `URGENT` triage levels.
- `EmptyState`: Clean container with subtle icon, title, and descriptive message.
- `Avatar`: Deterministic color-seeded initials avatar for users and staff.
- `LanguageSwitcher`: Bilingual dropdown toggle with English globe and Myanmar flag.

---

## 8. Development & Implementation Rules

### ❌ Strict Prohibitions
1. **Never hardcode hex colors** (e.g. `bg-[#237fea]`, `text-[#ffffff]`) directly in JSX components unless defining a custom CSS variable. Always use semantic Tailwind tokens (`bg-primary`, `text-foreground`, `border-border`, `bg-brand`).
2. **Never break bilingual localization:** All user-facing strings must pass through `t("Key")` via `useLanguage()`.
3. **Never mix shell navigation:** Citizens must never see the desktop Sidebar; Admin/Staff must never see the mobile tab bar.
4. **Never alter business logic for visual updates:** State machines, API contracts, mutations, and permissions in `rbac.js` must remain untouched during UI refactors.

### ✅ Mandatory Practices
1. **Always test both themes:** Every component must be visually verified in both light and dark mode.
2. **Concentric border radiuses:** When nesting rounded elements, ensure the child radius equals the parent radius minus the padding ($R_{child} \approx R_{parent} - p$).
3. **Respect accessibility:** Ensure minimum 44×44px tap targets on mobile and preserve keyboard focus rings on inputs and buttons.
