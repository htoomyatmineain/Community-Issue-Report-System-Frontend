# Kinn Htout Dark Theme & Typography Design Specification
*(Supabase Dark Architecture adapted with Kinn Htout Brand Primary #237FEA)*

## Scope of Work
Apply the Supabase dark architecture and typography styling across the Kinn Htout Platform.
- **Allowed Changes:** Tailwind configuration, global CSS tokens, surface backgrounds, borders, typography classes, status badges, buttons, and visual dark-theme styling.
- **Strict Constraint:** DO NOT touch, modify, remove, or break existing business logic, data models, state management, API routes, translation hooks (`t()`), or form event handlers.

---

## 1. Typography Standards

### Font Stacks
- **Sans (UI / Display):** `'Circular', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  *(Fallback cleanly to `-apple-system` or `Geist Sans` if Circular is not hosted locally)*
- **Mono (Code / Badges / IDs):** `'Source Code Pro', Menlo, Monaco, Consolas, monospace`

### Hierarchy & Weight Rules (Weight Restraint)
Achieve hierarchy strictly through size and letter-spacing rather than heavy font weights:
- **Headings & Hero:** `font-normal` (400) or `font-medium` (500). Avoid `font-bold` (700).
- **Body & Content:** `font-normal` (400), 16px (1rem) for general body, 14px (0.875rem) for secondary copy.
- **Buttons, Tab Triggers & Navigation Items:** `font-medium` (500), 14px (0.875rem).
- **Status Pills, Code Tags, Metadata Labels:** Monospace, 12px (0.75rem), `tracking-wider`, uppercase.

---

## 2. Color Tokens & Dark Theme Surfaces

Depth is achieved through thin, subtle borders and layered dark surfaces—not heavy drop shadows.

### Dark Canvas & Neutral Surfaces
- **Page Canvas (`bg-default`):** `#171717` (primary app canvas)
- **Deep / Inset Canvas (`bg-inset`):** `#0f0f0f` (control backdrops, table headers, code blocks, inputs)
- **Panel / Card Surface (`bg-overlay`):** `rgba(41, 41, 41, 0.84)` or `#1c1c1c`
- **Interactive / Hover Surface:** `#242424` to `#262626`

### Neutral Borders & Dividers
- **Default Card/Panel Border:** `#2e2e2e` (e.g., `border border-[#2e2e2e]`)
- **Subtle Row / Header Divider:** `#242424`
- **Interactive / Focus Border:** `#393939`

### Typography Colors
- **Primary Text (`text-foreground`):** `#fafafa`
- **Secondary Text (`text-secondary`):** `#b4b4b4`
- **Muted Text / Placeholder:** `#898989`
- **Faint / Disabled:** `#4d4d4d`

### Brand & Functional Accents (Adapted for #237FEA)
- **Primary Brand Accent (CTAs & Active States):** `#237FEA`
- **Primary Hover Accent:** `#1a6cd1`
- **Primary Alpha Glow / Subtle Pill Background:** `rgba(35, 127, 234, 0.12)`
- **Active Accent Border / Glow:** `rgba(35, 127, 234, 0.35)`
- **Warning / Pending Status:** Radix Amber (`#f5a623`) / BG: `rgba(245, 166, 35, 0.12)`
- **Destructive / High Priority / Alert:** Radix Tomato (`#e5484d`) / BG: `rgba(229, 72, 77, 0.12)`

---

## 3. Implementation Plan for Claude Agent

1. **Configure Tailwind & Global CSS:**
   - Extend `fontFamily` in `tailwind.config.js` with the Circular and Source Code Pro stacks.
   - Inject the semantic color tokens (base neutrals and primary `#237FEA` scales) into Tailwind `theme.extend.colors`.
2. **Refactor UI Components to Dark Theme:**
   - Convert primary layout containers, cards, issue feeds, and navigation sidebars from light backgrounds (`bg-white`, `border-slate-200`) to Supabase dark surfaces (`bg-[#171717]`, `border-[#2e2e2e]`, `bg-[#1c1c1c]`).
   - Replace any default green or generic blue classes with Kinn Htout's brand accent:
     - Primary buttons: `bg-[#237FEA] hover:bg-[#1a6cd1] text-white`
     - Active tab / nav items: `text-[#237FEA] bg-[#237FEA]/10 border-[#237FEA]/30`
   - Apply `#fafafa` for primary text and `#b4b4b4` for secondary descriptions.
3. **Preserve Integrity:**
   - Leave all state variables, data-fetching calls, form bindings, and translation utilities (`t()`) completely intact.