<div align="center">

# Atlas Global Core

**The Context-Aware Orchestration Layer for the Global Agentic Economy**

<p>
  <img src="public/logo-atlas-core.png" alt="Atlas Global Core" width="280" />
</p>

AI-driven liquidity routing · Real-time dynamic compliance · Seamless B2B settlement across Fiat & Crypto

</div>

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Design System](#design-system)
- [The Golden Rule: Dumb Frontend, Smart Backend](#the-golden-rule-dumb-frontend-smart-backend)
- [Authentication Flow](#authentication-flow-supabase-auth)
- [API Response Format](#api-response-format)
- [Project Structure](#project-structure)
- [Landing Page](#landing-page)
- [Exchange Page](#exchange-page)
- [AtlasWallet Dashboard](#atlaswallet-dashboard)
- [NeXFlowX Routing Engine](#nexflowx-routing-engine-v30)
- [State Management](#state-management)
- [API Client & Contracts](#api-client--contracts)
- [React Query Hooks](#react-query-hooks)
- [Deprecated Local API Routes](#deprecated-local-api-routes)
- [Database Schema (Local Dev Only)](#database-schema-local-dev-only--prisma--sqlite)
- [Environment Variables](#environment-variables)
- [CORS Configuration](#cors-configuration)
- [Admin Access Control](#admin-access-control)
- [Internationalization](#internationalization)
- [Deployment](#deployment)
- [Development](#development)
- [Compliance & Legal](#compliance--legal)
- [License](#license)

---

## Overview

Atlas Global Core is the **B2B infrastructure platform** that fuses AI, Financial Orchestration (Fiat & Crypto via Stripe, Onramp.money, Viva.com), and Intelligent Routing into a single context-aware orchestration layer.

The platform enables merchants and enterprises to:

- **Route liquidity intelligently** — AI-driven decision engine selects optimal payment rails (Viva.com / Onramp.money / Stripe) in real time
- **Maintain dynamic compliance** — Automated KYC/KYB, jurisdiction-aware rules, and regulatory guardrails across 47 countries
- **Settle seamlessly** — Unified fiat-to-crypto and crypto-to-fiat B2B settlement with a 3-stage treasury model
- **Operate globally** — Multi-currency, multi-tenant, multi-jurisdiction from a single dashboard

| Property | Value |
|----------|-------|
| **Domain** | `atlasglobal.digital` |
| **API Backend** | `https://api.atlasglobal.digital/api/v1` |
| **Operator** | Sergio Monteiro (EI) — SIREN 790 155 006 |
| **Holding** | IAHUB360 LTD — UK Reg. #16568194 |
| **Version** | 2.1.0 |
| **Runtime** | Bun |

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Bun + Next.js 16)                     │
│                                                                      │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────────────┐   │
│  │  Zustand    │  │  TanStack    │  │  Supabase Auth              │   │
│  │  (3 stores) │  │  React Query │  │  (signUp / signIn)          │   │
│  │  - store    │  │  (14 hooks)  │  │  → getSession() → JWT       │   │
│  │  - auth     │  │              │  └──────────┬─────────────────┘   │
│  │  - dashboard│  └──────┬───────┘             │                      │
│  └────────────┘         │             ┌───────┴───────────────┐      │
│                       query key      │  Supabase Session     │      │
│                           │          │  Interceptor          │      │
│                           │          │  (auto-refreshes JWT) │      │
│  ┌────────────────────────▼──────────▼───────────────────────┐      │
│  │              API Client V2.10                             │      │
│  │              api.atlasglobal.digital/api/v1                │      │
│  │              (CORS-enabled, typed, error-boundary)         │      │
│  │                                                             │      │
│  │  getAuthToken() → supabase.getSession() → Bearer token    │      │
│  └────────────────────────┬──────────────────────────────────┘      │
└───────────────────────────┼──────────────────────────────────────────┘
                            │ HTTPS / REST / JSON
┌───────────────────────────▼──────────────────────────────────────────┐
│                    BACKEND (Express.js — Hosted Separately)          │
│                                                                      │
│  ┌─────────────┐   ┌──────────────┐   ┌────────────────────┐       │
│  │  JWKS Auth  │→ │  Business     │→ │  PostgreSQL         │       │
│  │  Middleware  │   │  Logic       │   │  (Production DB)   │       │
│  │  (Supabase  │   │  (Wallets,   │   │                    │       │
│  │   JWT       │   │   Routing,   │   │                    │       │
│  │   verify)   │   │   Settlement)│   │                    │       │
│  └─────────────┘   └──────────────┘   └────────────────────┘       │
└──────────────────────────────────────────────────────────────────────┘

              DEPRECATED LOCAL ROUTES (kept as stubs, NOT used):
┌──────────────────────────────────────────────────────────────────────┐
│  /api/v2/payments/process  ← STUB (returns { deprecated: true })  │
│  /api/v2/merchants         ← STUB                                  │
│  /api/v2/customers         ← STUB                                  │
│  /api/v2/analytics         ← STUB                                  │
│  /api/kyb                  ← STUB                                  │
│  /api/transactions         ← STUB                                  │
│  /api/storefronts          ← STUB                                  │
│                                                                     │
│  ONLY REMAINING: /api (health check)                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | Next.js | 16.1+ | App Router, SPA-style, `standalone` output |
| **UI Library** | React | 19.0 | Concurrent rendering |
| **Language** | TypeScript | 5.x | Strict mode, bundler resolution |
| **Styling** | Tailwind CSS | 4.x | `@theme inline` tokens, dark theme |
| **Animation** | Framer Motion | 12.x | Spring transitions, `AnimatePresence` |
| **Client State** | Zustand | 5.x | 3 stores (auth, navigation, dashboard) |
| **Server State** | TanStack React Query | 5.x | 14 hooks, 30s staleTime |
| **Data Tables** | TanStack React Table | 8.x | Sortable, filterable, paginated |
| **Authentication** | Supabase Auth | 2.x | Real auth: `signUp` / `signInWithPassword` |
| **Charts** | Recharts | 2.x | Financial charts, exchange trading charts, sparklines, KPIs |
| **Market Data** | CoinGecko API | Free | Real-time crypto prices (8 coins, 30s refetch) |
| **Maps** | react-simple-maps | 3.x | Network topology visualization |
| **UI Components** | shadcn/ui | New York | 44 pre-built components |
| **Icons** | Lucide React | 0.525+ | Consistent icon system |
| **Forms** | React Hook Form + Zod | 7.x / 4.x | Type-safe form validation |
| **i18n** | next-intl | 4.9+ | 4 locales (EN, FR, PT-PT, BR) |
| **Markdown** | react-markdown | 10.x | Rich content rendering |
| **Rich Text** | @mdxeditor/editor | 3.x | MDX content editing |
| **Drag & Drop** | @dnd-kit | 6.x | Drag-and-drop interfaces |
| **Toasts** | Sonner | 2.x | Toast notification system |
| **Image Processing** | Sharp | 0.34+ | Server-side image optimization |
| **Runtime** | Bun | Latest | Package manager + runtime |
| **Database (local)** | SQLite via Prisma | 6.11+ | Local dev only — NOT used in production |

---

## Design System

### Color Palette — "Hacker-Luxe"

| Token | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| **Matrix Green** | `#39FF14` | `--matrix-green` | Primary accent, CTAs, active states, glow effects |
| **Cyber Blue** | `#00F0FF` | `--cyber-blue` | Secondary accent, links, highlights, data viz |
| **Neon Teal** | `#00D4AA` | `--neon-teal` | Dashboard primary, success states, borders |
| **Obsidian** | `#050505` | `--obsidian` | Deepest background |
| **Charcoal** | `#111111` | `--charcoal` | Surface panels, cards |
| **Steel Silver** | `#C0C0C0` | `--steel-silver` | Primary text |
| **Muted Gray** | `#606060` | `--muted` | Secondary text, labels |
| **Danger Red** | `#FF0040` | `--danger` | Error states, destructive actions |
| **Warning Amber** | `#FFB800` | `--warning` | Warning badges, admin role |
| **Royal Purple** | `#A855F7` | `--purple` | Customer role badge |

### Typography

| Font | Source | Usage |
|------|--------|-------|
| **Inter** | Google Fonts | Body text, UI labels, headings |
| **JetBrains Mono** | Google Fonts | Code, terminal text, monospace data (`nex-mono`, `font-mono-data`) |

### Custom CSS Utilities

| Utility | Description |
|---------|-------------|
| `glass-panel` | Glass-morphism card with backdrop-blur |
| `neon-glow` | Green neon text-shadow glow |
| `neon-btn-primary` | Primary CTA button with green glow |
| `neon-input` | Styled form input with dark surface |
| `neon-sidebar` | Dashboard sidebar styling |
| `neon-badge-*` | Colored status badges (teal, cyan, amber, red, purple) |
| `glow-green` / `glow-blue` | Text glow effects |
| `panel` / `panel-light` | Surface panel backgrounds |
| `grid-bg` / `grid-bg-animated` | Subtle animated grid backgrounds |
| `cyber-scrollbar` | Custom scrollbar styling |
| `animate-fade-up` | Entry animation (used with delays `animate-fade-up-1/2/3`) |

### Component Library (shadcn/ui)

44 pre-built components in `src/components/ui/`:
`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `input-otp`, `label`, `logo-3d`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`

---

## The Golden Rule: Dumb Frontend, Smart Backend

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│              │  REST  │              │  SQL   │              │
│   Next.js    │───────▶│  Backend API │───────▶│  PostgreSQL  │
│  (Frontend)  │  JSON  │  (Express)   │        │  (Database)  │
│              │◀───────│              │◀───────│              │
└──────────────┘        └──────────────┘        └──────────────┘

  ❌ Frontend → Database    (NEVER in production)
  ✅ Frontend → Backend API  (ALWAYS)
```

> **The frontend NEVER connects directly to the production database.**

- All business logic, data creation, and transactions are handled exclusively by the backend API at `https://api.atlasglobal.digital/api/v1`
- Next.js is responsible for **three things only**:
  1. **UI rendering** — Components, layouts, animations
  2. **State management** — Zustand stores for auth, dashboard, navigation
  3. **Data fetching** — React Query hooks that call the backend API
- The 7 local API routes that previously existed have been **deprecated** and are now stubs — ALL data flows through the backend API exclusively
- SQLite/Prisma is retained for local development convenience only

---

## Authentication Flow (Supabase Auth — Real)

The auth system now uses **real Supabase Auth** (previously a no-op shim). Login and registration flows communicate directly with the Supabase backend, and the API client automatically attaches the Supabase JWT via a session interceptor.

```
┌─────────┐    signUp()     ┌───────────┐   Webhook    ┌─────────┐
│   User   │───────────────▶│ Supabase  │─────────────▶│ Backend │
│  (UI)    │               │   Auth    │              │   API   │
└─────────┘               └───────────┘              └─────────┘
     │                          │                          │
     │     signInWithPassword() │                          │
     │──────────────────────────▶│                          │
     │                          │                          │
     │◀─────── access_token ────│                          │
     │                          │                          │
     │  getAuthToken() via      │                          │
     │  supabase.getSession()   │                          │
     │         │                │                          │
     │         ▼                │                          │
     │  API Client interceptor  │                          │
     │  Authorization: Bearer   │                          │
     │         │                │                          │
     │    GET /auth/me ─────────────────────────────────▶  │
     │◀────────────────── { data: { id, role, ... } } ────│
```

### Login vs Register Flow

| Step | Login | Register |
|------|-------|----------|
| **UI Fields** | Identifier (ID) + Password | ID + Email + Password + Confirm Password |
| **Supabase Call** | `signInWithPassword({ email, password })` | `signUp({ email, password })` |
| **Email Confirmation** | N/A (already verified) | May require email confirmation before first login |
| **Token Source** | `data.session.access_token` | `data.session.access_token` (if auto-confirmed) |
| **Token Storage** | `localStorage.nexflowx_token` | `localStorage.nexflowx_token` |
| **Backend Validation** | `GET /auth/me` → user profile | `GET /auth/me` → user profile |

### Implementation Details

| Step | Action | Direction | Source File |
|------|--------|-----------|-------------|
| **REGISTER** | `supabase.auth.signUp({ email, password })` | UI → Supabase | `auth-store.ts` |
| | Backend auto-creates user record | Supabase → Backend (Webhook) | — |
| | If email confirmation required → UI shows "check your email" | — | `login-page.tsx` |
| **LOGIN** | `supabase.auth.signInWithPassword({ email, password })` | UI → Supabase | `auth-store.ts` |
| | Returns `access_token` (JWT) | Supabase → UI | — |
| | Token stored in `localStorage.nexflowx_token` | Client-side | `auth-store.ts` |
| **API CALL** | `Authorization: Bearer <token>` (auto-attached by interceptor) | UI → Backend | `api/client.ts` |
| | Backend validates JWKS signature | Backend middleware | — |
| **SESSION** | `supabase.auth.getSession()` → refresh stored token | UI (on mount) | `auth-store.ts` |
| | Auto-refresh token | Supabase (transparent) | — |
| **TOKEN INTERCEPTOR** | `getAuthToken()` → `supabase.getSession()` → Bearer header | Client-side | `api/client.ts` |
| **LOGOUT** | `supabase.auth.signOut()` + `clearAuthTokens()` | UI → Supabase | `auth-store.ts` |

### API Client Session Interceptor

The API client (`src/lib/api/client.ts`) no longer reads tokens directly from localStorage. Instead, it uses a **Supabase session interceptor** that calls `supabase.auth.getSession()` on every request, with a localStorage fallback:

```typescript
// src/lib/api/client.ts
async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) return session.access_token;
  } catch {
    /* Supabase not available — fall through */
  }
  // Fallback: localStorage (for dev bypass or edge cases)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('nexflowx_token');
  }
  return null;
}
```

### Auth Store (Zustand + Persist)

```typescript
// Persisted to localStorage key: 'nexflowx-auth'
interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  isDevMode: boolean
  user: AuthUser | null
  loginError: string | null
  registerError: string | null
  login(identifier: string, password: string): Promise<boolean>
  register(email: string, password: string): Promise<boolean>
  logout(): Promise<void>
  validateToken(): Promise<void>
  clearErrors(): void
}
```

### Dev Bypass Mode

- **Controlled by**: `NEXT_PUBLIC_ENABLE_DEV_BYPASS` environment variable
- **Never active in production** (checks `process.env.NODE_ENV !== 'production'`)
- When enabled: creates fake admin user with any credentials
- Stores `'dev-token-bypass'` in localStorage
- UI shows `DEV BYPASS` badge on login page and dashboard header

### Role Helpers

```typescript
isAdmin(user: AuthUser): boolean      // role === 'admin'
isMerchant(user: AuthUser): boolean   // role === 'merchant'
isCustomer(user: AuthUser): boolean   // role === 'customer'
getUserRole(user: AuthUser): string   // Uppercase role label
```

> **Note:** All auth flows go through Supabase client SDK. There are no local `/auth/login` or `/auth/register` API routes.

---

## API Response Format

All successful responses from the backend API use a **unified `data` wrapper**:

```json
{
  "data": {
    "id": "cuid_clx7abc123def456",
    "email": "merchant@example.com",
    "role": "merchant",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

Error responses follow this structure:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### API Error Handling

```typescript
// Custom error class in api/client.ts
class NexFlowXAPIError extends Error {
  status: number    // HTTP status code
  code: string      // Error code (UNAUTHORIZED, FORBIDDEN, etc.)
}
```

> React Query hooks automatically unwrap the `data` field via mappers defined in `src/lib/api/contracts.ts`.

---

## Project Structure

```
atlas-web/
├── public/
│   ├── logo-atlas-core.png        # Official logo (site-wide + favicon)
│   ├── logo-dark.png              # Dark mode logo
│   ├── logo-light.png             # Light mode logo
│   ├── logo.svg                   # SVG logo
│   └── robots.txt                 # Search engine directives
│
├── prisma/
│   └── schema.prisma              # Database schema (10 models, SQLite — local dev only)
│
├── db/
│   └── custom.db                  # SQLite database file (local dev only)
│
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main SPA router (7 pages, AnimatePresence)
│   │   ├── layout.tsx             # Root layout (metadata for atlasglobal.digital, fonts, providers)
│   │   ├── globals.css            # Complete theme system (377 lines)
│   │   └── api/
│   │       ├── route.ts           # Health check (ONLY remaining active route)
│   │       ├── kyb/route.ts       # [DEPRECATED STUB]
│   │       ├── transactions/route.ts # [DEPRECATED STUB]
│   │       ├── storefronts/route.ts   # [DEPRECATED STUB]
│   │       └── v2/
│   │           ├── analytics/route.ts     # [DEPRECATED STUB]
│   │           ├── customers/route.ts     # [DEPRECATED STUB]
│   │           ├── merchants/route.ts     # [DEPRECATED STUB]
│   │           └── payments/process/route.ts # [DEPRECATED STUB]
│   │
│   ├── components/
│   │   ├── providers.tsx          # QueryClientProvider (staleTime 30s)
│   │   │
│   │   ├── atlas/                 # ─── Landing & CMS Pages (11 files) ───
│   │   │   ├── landing-page.tsx       # Full landing (Hero, AI Engine, Marketplace)
│   │   │   ├── exchange-page.tsx      # Crypto Exchange (CoinGecko + Recharts)
│   │   │   ├── living-background.tsx  # Manus.im particle system background
│   │   │   ├── nexflowx-companion.tsx # AI Orb floating assistant
│   │   │   ├── navbar.tsx             # Top navigation (5 items, locale switcher)
│   │   │   ├── footer.tsx             # Unified legal footer (all pages)
│   │   │   ├── command-hub.tsx        # Unified command/knowledge hub
│   │   │   ├── legal-hub.tsx          # Legal documents (5 tabs)
│   │   │   ├── services-page.tsx      # Detailed services page
│   │   │   ├── pricing-page.tsx       # Pricing tiers
│   │   │   └── studio-builder.tsx     # [Legacy] Atlas Studio visual builder
│   │   │
│   │   ├── wallet/                # ─── AtlasWallet Dashboard (23 files) ───
│   │   │   ├── dashboard-shell.tsx       # Auth guard + section router
│   │   │   ├── login-page.tsx            # Real Supabase login/register
│   │   │   ├── login-grid-background.tsx # Animated grid + neon beams login BG
│   │   │   ├── sidebar.tsx               # Desktop + mobile sidebar
│   │   │   ├── header.tsx                # Top bar (clock, search, role badge)
│   │   │   ├── dashboard-overview.tsx    # KPIs + world map + activity feed
│   │   │   ├── wallet-cards.tsx          # 3-stage settlement treasury
│   │   │   ├── swap-widget.tsx           # Currency conversion (crypto/fiat)
│   │   │   ├── payout-widget.tsx         # Payout request management
│   │   │   ├── deposit-widget.tsx        # Deposit via payment links
│   │   │   ├── financial-activity-table.tsx # Ledger with filters
│   │   │   ├── stores-panel.tsx          # Multi-tenant store CRUD
│   │   │   ├── gateways-panel.tsx        # Gateway configuration
│   │   │   ├── payment-links-panel.tsx   # Checkout link management
│   │   │   ├── settings-security.tsx     # Password, Email, 2FA, Notifications
│   │   │   ├── admin-approval-table.tsx  # Admin-only ticket approval
│   │   │   ├── system-liquidity-panel.tsx # Admin-only liquidity overview
│   │   │   ├── api-management.tsx        # API Keys, Webhooks, Reference
│   │   │   ├── glass-card.tsx            # Glass-morphism card
│   │   │   ├── glow-wrapper.tsx          # Neon glow wrapper
│   │   │   ├── metric-card.tsx           # KPI metric display
│   │   │   ├── neon-chart.tsx            # Styled chart wrapper
│   │   │   ├── world-map-network.tsx     # Interactive network map
│   │   │   └── index.ts                  # Barrel exports
│   │   │
│   │   └── ui/                    # ─── shadcn/ui (44 components) ───
│   │       └── (44 .tsx files)
│   │
│   ├── hooks/
│   │   ├── use-wallets.ts         # 14 React Query hooks
│   │   ├── use-mobile.ts          # Mobile breakpoint (768px)
│   │   └── use-toast.ts           # Toast notification system
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts          # API Client V2.10 (Supabase session interceptor)
│   │   │   └── contracts.ts       # TypeScript contracts + mappers
│   │   ├── auth-store.ts          # Zustand auth (real Supabase + dev bypass)
│   │   ├── dashboard-store.ts     # Dashboard section navigation
│   │   ├── store.ts               # Global page navigation (SPA)
│   │   ├── supabase.ts            # Real Supabase client config (with fallback shim)
│   │   ├── nexflowx.ts            # NeXFlowX v3.0 engine (608 lines)
│   │   ├── db.ts                  # Prisma client (SQLite singleton — local dev only)
│   │   └── utils.ts               # cn() helper
│   │
│   └── i18n/
│       ├── config.ts              # 4 locales config
│       └── request.ts             # next-intl server handler
│
├── Caddyfile                      # Reverse proxy (port :81)
├── components.json                # shadcn/ui config
├── next.config.ts                 # Next.js config (standalone output)
├── tailwind.config.ts             # Tailwind config (HSL color system)
├── postcss.config.mjs             # PostCSS (@tailwindcss/postcss)
├── tsconfig.json                  # TypeScript config (ES2017, strict)
├── package.json                   # Dependencies & scripts
└── bun.lock                       # Lock file (text format)
```

---

## Landing Page

The landing page is a single-page application with 6 sections and a Manus.im-inspired animated background:

| # | Section | Description |
|---|---------|-------------|
| 1 | **Hero** | "The Context-Aware Orchestration Layer for the Global Agentic Economy" — animated headline, subtitle, CTA buttons |
| 2 | **NeXFlowX AI-Engine** | Visual flow: 4 Input Signals → Central Processing Node → 2 Routing Outputs (Viva.com / Onramp.money) |
| 3 | **Private B2B Marketplace** | 3 categories: Compute Power (GPU), Agentic Workflows, Digital IP Assets |
| 4 | **Core Modules** | 3 deep-dive cards: NeXFlowX Routing, Brain CRM, Atlas Exchange |
| 5 | **Trust Bar** | Partner logos: Stripe, Viva.com, Onramp.money + Compliance: PCI-DSS, ISO 27001 |
| 6 | **Stats** | 99.97% uptime · <50ms latency · 12M+ transactions · 47 countries |

### Living Background (`living-background.tsx`)

- **Mouse-reactive radial gradient** — tracks cursor position, creates ambient glow
- **3 breathing gradient layers** — 8s, 10s, 12s breathing cycles (green/cyan tones)
- **5 horizontal + 4 vertical data-flow lines** — animated with `translateY`/`translateX`
- **20 floating micro-particles** — alternating green/cyan, parallax-like movement
- **Vignette overlay** — darkened edges for depth focus
- **SSR-safe** — uses `useSyncExternalStore` for client detection

### NeXFlowX Companion (`nexflowx-companion.tsx`)

- **Floating AI Orb** — bottom-right corner, z-index 9999
- **Animated orb**: pulsing core dot, 3 concentric rings, rotating geometric ring, Y-axis float
- **Terminal-style chat panel** — 380×520px, glass-morphism, monospace font
- **Pattern-matching responses** — contextual answers for routing, compliance, marketplace, infrastructure queries
- **Typing indicator** — 3-dot animation + "PROCESSING" label

### SPA Navigation

| Label | Page Key | Component | KYB Required |
|-------|----------|-----------|-------------|
| **ATLASWALLET** | `wallet` | `DashboardShell` | No (shows login gate) |
| **EXCHANGE** | `exchange` | `ExchangePage` | No |
| **PRICING** | `prices` | `PricingPage` | No |
| **SERVICES** | `services` | `ServicesPage` | No |
| **LEGAL** | `legal` | `LegalHub` | No |

### Unified Footer

The `Footer` component (`src/components/atlas/footer.tsx`) is now rendered **across all pages** — landing, exchange, pricing, services, legal, and dashboard. A previous duplicate footer that existed inside `dashboard-shell.tsx` has been removed to avoid duplication.

---

## Exchange Page

The Exchange page (`src/components/atlas/exchange-page.tsx`) replaces the legacy Studio Builder. It provides a full-featured crypto exchange interface with real-time market data.

### Features

| Feature | Description |
|---------|-------------|
| **Real-time CoinGecko API** | 8 coins (BTC, ETH, LTC, USDT, BNB, SOL, XRP, ADA) with 30s auto-refetch |
| **Interactive Trading Chart** | Recharts `AreaChart` with gradient fill, tooltips, reference lines |
| **Market Pair Dropdown** | 7 pairs: BTC/USDT, ETH/USDT, SOL/USDT, BNB/USDT, XRP/USDT, ADA/USDT, LTC/USDT |
| **Timeframe Selector** | 5 timeframes: 1H, 4H, 1D, 1W, 1M with variable volatility |
| **Stat Banner** | Total Market Cap, BTC Dominance, 24H Avg Change, Active Markets |
| **Market Ticker** | Side panel with all coins, prices, and 24H change |
| **Onramp Placeholder** | "Em breve disponível" (Coming Soon) with payment method badges |
| **Security Notice** | Data source disclosure + TSP disclaimer |

### Market Data (CoinGecko Free API)

The Exchange page uses the [CoinGecko Free API](https://www.coingecko.com/en/api) (`/api/v3/simple/price`) which is subject to rate limits:

- **Free tier**: ~10-30 calls/minute
- **Refetch interval**: 30 seconds (configurable in `refetchInterval`)
- **Stale time**: 15 seconds
- **No API key required** for basic usage

> **Note:** If CoinGecko rate limits are hit, the page gracefully shows an error state and continues retrying.

### Onramp Placeholder

The onramp section displays payment method badges for upcoming fiat-to-crypto onramp integration:

| Badge | Method | Status |
|-------|--------|--------|
| **G Pay** | Google Pay | Coming Soon |
| **Apple Pay** | Apple Pay | Coming Soon |
| **SEPA** | SEPA Transfer (EU) | Coming Soon |
| **PIX** | PIX (Brazil) | Coming Soon |

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Exchange · Global Crypto Markets · Real-time Data  │
│  [Updated: HH:MM:SS]  [REFRESH]                            │
├──────────────────────────────────────┬──────────────────────┤
│  Stat Banner (4 metrics)             │                      │
│                                      │   Market Ticker      │
│  [Pair ▼] [1H ▼ 4H 1D 1W 1M]       │   ┌──────────────┐  │
│                                      │   │ BTC  $65,000  │  │
│  ┌────────────────────────────────┐  │   │ ETH  $3,200   │  │
│  │                                │  │   │ SOL  $148     │  │
│  │     Trading Chart              │  │   │ BNB  $580     │  │
│  │     (AreaChart + Recharts)     │  │   │ XRP  $0.52    │  │
│  │                                │  │   │ ADA  $0.38    │  │
│  │                                │  │   │ LTC  $84      │  │
│  └────────────────────────────────┘  │   └──────────────┘  │
│                                      │                      │
│  ┌────────────────────────────────┐  │   Security Notice    │
│  │  Onramp Placeholder           │  │                      │
│  │  "Em breve disponível"        │  │                      │
│  │  [G Pay] [Apple] [SEPA] [PIX] │  │                      │
│  └────────────────────────────────┘  │                      │
└──────────────────────────────────────┴──────────────────────┘
```

---

## AtlasWallet Dashboard

The merchant dashboard is a comprehensive financial management interface with **13 sections**, all lazy-loaded via `next/dynamic`:

```
┌─────────────────────────────────────────────────────────────┐
│  Header  │  AGP://  Dashboard          Admin ●  LIVE  NX   │
├──────────┼──────────────────────────────────────────────────┤
│          │                                                  │
│ Sidebar  │          Active Section                          │
│          │     (Overview / Wallets / Swap /                 │
│  ▸ Dashboard│   Payouts / Deposits / Activity /             │
│  ▸ Wallets  │   Stores / Gateways / Links /                 │
│  ▸ Activity │   Settings / Admin / API)                     │
│  ▸ Stores   │                                                │
│  ▸ Links    │                                                │
│  ▸ Gateways │                                                │
│  ▸ Swap     │                                                │
│  ▸ Payouts  │                                                │
│  ▸ Deposits │                                                │
│  ▸ Settings │                                                │
│  ▸ Admin*   │  *Admin-only sections                          │
│  ▸ Liquidity│  *Admin-only sections                          │
│  ▸ API      │                                                │
└──────────┴──────────────────────────────────────────────────┘
│  Footer: Unified legal structure (shared component)          │
└─────────────────────────────────────────────────────────────┘
```

### Login Grid Background

The login page features a new `LoginGridBackground` component (`src/components/wallet/login-grid-background.tsx`) — a full-screen canvas animation:

- **Animated grid** — pulsating green grid lines with intersection glow dots
- **Neon light beams** — cyan (`#00F0FF`) and green (`#00FF41`) beams traveling along grid lines
- **Beam spawning** — periodic horizontal and vertical beams with random speed/width
- **Disintegration effect** — when two beams cross (proximity < 20px), burst particles spawn at the intersection
- **Particle system** — radial glow particles with friction decay
- **Vignette** — darkened edges for depth focus
- **Performance** — `requestAnimationFrame` loop with proper cleanup

### Auth Gate Flow

```
DashboardShell (mount)
     │
     ▼
  validateToken()
     │
     ├── Not mounted? → Show Logo3D spinner
     ├── isAuthenticated === false → Show LoginPage (with LoginGridBackground)
     ├── isLoading === true → Show "Validating session..." spinner
     └── isAuthenticated === true → Show full dashboard layout
```

### 3-Stage Settlement Model

```
  Incoming           Pending              Available
  ┌────────┐        ┌────────┐           ┌────────┐
  │  €0.00 │───────▶│  €0.00 │──────────▶│  €0.00 │
  └────────┘        └────────┘           └────────┘
   Received          Processing           Ready to
   funds             (T+1, T+2)          withdraw
```

| Stage | Description | Duration |
|-------|-------------|----------|
| **Incoming** | Funds received, awaiting verification | Instant |
| **Pending** | Under compliance review & settlement processing | T+1 to T+2 |
| **Available** | Cleared funds, ready for withdrawal or swap | Available |

### Role-Based Access Control

| Section | Admin | Merchant | Customer |
|---------|-------|----------|----------|
| Dashboard Overview | ✅ | ✅ | ✅ |
| Wallet Management | ✅ | ✅ | ✅ |
| Transaction Activity | ✅ | ✅ | ✅ |
| Swap & Convert | ✅ | ✅ | ✅ |
| Payouts | ✅ | ✅ | ❌ |
| Deposits | ✅ | ✅ | ❌ |
| Store Management | ✅ | ✅ | ❌ |
| Gateway Configuration | ✅ | ✅ | ❌ |
| Payment Links | ✅ | ✅ | ❌ |
| Settings & Security | ✅ | ✅ | ✅ |
| Admin Approvals | ✅ | ❌ | ❌ |
| System Liquidity | ✅ | ❌ | ❌ |
| API Management | ✅ | ✅ | ❌ |

### Sidebar Navigation Groups

| Group | Sections | Visibility |
|-------|----------|------------|
| **Operacao** | Dashboard, Tesouraria/Wallets, Transacoes, Lojas & Marcas, Links de Pagamento, Gateways & API | All users |
| **Administracao** | Aprovacoes, Liquidez do Sistema | Admin only |
| **Sistema** | Developer/API, Definicoes | All users |

### Responsive Behavior

- **Desktop** (`md+`): Fixed sidebar (260px collapsed → 68px), full header with search
- **Mobile** (`<md`): Radix Sheet drawer sidebar, hamburger menu, simplified header

---

## NeXFlowX Routing Engine (v3.0)

The core intellectual property — a 608-line intelligent payment routing engine in `src/lib/nexflowx.ts`.

### 3-Level Waterfall Routing

```
┌──────────────────────────────────────────────────────────────┐
│                    Transaction Payload                        │
│               { amount, currency, region, ... }              │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  Level 1: SPECIFIC RULES                                    │
│  Merchant-defined routing rules (up to N per tier)           │
│  Conditions: amount range, currency, method, country         │
│  Confidence: 1.0 (100%)                                      │
└──────────┬─────────────────────────────────┬────────────────┘
           │ Match found?                    │ No match
           ▼                                 │
     ✅ Route to specific gateway            │
                                          ▼
┌──────────────────────────────────────────────────────────────┐
│  Level 2: CONDITIONAL LOGIC                                  │
│  Business rules: high-value → SEPA, PIX → Stark, etc.       │
│  Tier-based gateway filtering                                │
│  Confidence: 0.85 (85%)                                      │
└──────────┬─────────────────────────────────┬────────────────┘
           │ Match found?                    │ No match
           ▼                                 │
     ✅ Route to conditional gateway         │
                                          ▼
┌──────────────────────────────────────────────────────────────┐
│  Level 3: TIER FALLBACK                                      │
│  Tier-based gateway priority                                 │
│  Bronze: Stripe only                                        │
│  Silver: + Viva, Mistic                                      │
│  Gold: All gateways                                         │
│  Confidence: 0.6 (60%)                                       │
└──────────┬──────────────────────────────────────────────────┘
           ▼
     ✅ Route to tier-default gateway
```

### Tier System

| Tier | Min Volume | Fee Discount | Max Rules | Gateway Access | Features |
|------|-----------|-------------|-----------|----------------|----------|
| **Bronze** | €0 | 0% | 3 | Stripe only | Basic analytics, email support |
| **Silver** | €50K | 10% | 10 | + Viva, Mistic | Advanced analytics, custom routing |
| **Gold** | €250K | 20% | Unlimited | All gateways | White-label, Ledger API, dedicated support |

### Gateway Registry (15 gateways, 6 regions)

| Region | Gateways | Currency | Legal Entity |
|--------|----------|----------|-------------|
| **BR** | Stripe Brazil, Stark Bank, Mistic BR | BRL | Atlas Brazil Hub |
| **EU** | Stripe France, Viva Wallet, Mistic EU, Adyen | EUR | Sergio Monteiro (EI) |
| **UK** | Stripe UK, Viva UK, Mistic UK | GBP | IAHUB360 LTD |
| **US** | Stripe US, Mistic US | USD | IAHUB360 LTD |
| **LATAM** | Stripe Brazil, Mistic LATAM | BRL | Atlas Brazil Hub |
| **PT** | Mistic PT, Stripe PT | EUR | Atlas Global Core — ENI |

### Provider Adapters (5 adapters)

Each provider implements the `ProviderAdapter` interface:

```typescript
interface ProviderAdapter {
  name: string
  processPayment(payload, gateway): Promise<ProviderResult>
  refund(transactionRef, amount?): Promise<ProviderResult>
  getBalance(): Promise<{ available, pending, currency }>
}
```

| Adapter | Provider | Simulation Balances |
|---------|----------|-------------------|
| `StripeAdapter` | Stripe | €245,680.50 available |
| `VivaAdapter` | Viva Wallet | €98,230.75 available |
| `MisticAdapter` | Mistic | €67,890.25 available |
| `AdyenAdapter` | Adyen | €156,780.00 available |
| `StarkBankAdapter` | Stark Bank | R$234,560.00 available |

### Built-in Analytics

- `computeRoutingAnalytics()` — Aggregate routing decisions by level, region, gateway
- `aggregateVolumesByCurrency()` — Sum transaction volumes by currency
- `getAllGatewayStatuses()` — Full gateway health overview
- `buildLedgerEntries()` — Create payment + fee ledger entries for reconciliation

---

## State Management

### Zustand Stores (3 stores)

#### 1. `store.ts` — Page Navigation (SPA)

```typescript
type Page = 'landing' | 'command' | 'exchange' | 'legal' | 'prices' | 'services' | 'wallet'
type Locale = 'en' | 'fr' | 'pt-PT' | 'pt-BR'

interface AtlasState {
  currentPage: Page         // Default: 'landing'
  kybCompleted: boolean     // Gate for command pages
  locale: Locale            // Default: 'en'
  selectedLegalTab: LegalTab
  setPage, setKybCompleted, setLocale, navigateToLegal
}
```

#### 2. `auth-store.ts` — Authentication

```typescript
interface AuthState {
  isAuthenticated: boolean   // Persisted
  isLoading: boolean
  isDevMode: boolean         // Persisted
  user: AuthUser | null      // Persisted
  loginError, registerError
  login, register, logout, validateToken, clearErrors
}
// Persist key: 'nexflowx-auth'
```

#### 3. `dashboard-store.ts` — Dashboard Sections

```typescript
type DashboardSection = 'dashboard' | 'wallets' | 'activity' | 'stores'
  | 'payment-links' | 'gateways' | 'swap' | 'payouts' | 'deposits'
  | 'settings' | 'approvals' | 'liquidity' | 'developer'

interface DashboardState {
  activeSection: DashboardSection  // Default: 'dashboard'
  sidebarCollapsed: boolean
  sidebarOpen: boolean
  setActiveSection, toggleSidebar, setSidebarOpen
}
```

---

## API Client & Contracts

### Client (`src/lib/api/client.ts`)

API Client V2.10 — typed HTTP client with **Supabase session interceptor** for auth.

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.atlasglobal.digital/api/v1'

// Token retrieval order:
// 1. supabase.auth.getSession() → access_token (preferred)
// 2. localStorage: 'nexflowx_token' (fallback)
// Auth header: Authorization: Bearer <token>
// Mode: CORS
```

**Endpoints:**

| Namespace | Method | Endpoint | Purpose |
|-----------|--------|----------|---------|
| `auth` | GET | `/auth/me` | Validate Supabase JWT, get user profile |
| `wallets` | GET | `/wallets` | List merchant wallets |
| `swap` | POST | `/swap` | Execute currency conversion |
| `payout` | POST | `/payout` | Request payout |
| `deposits` | POST | `/deposits` | Create deposit |
| `paymentLinks` | GET/POST | `/payment-links` | List/create payment links |
| `stores` | GET/POST | `/stores` | List/create stores |
| `gateways` | GET/POST | `/settings/gateways` | List/configure gateways |
| `ledger` | GET | `/ledger` | List ledger entries |
| `actionTickets` | GET | `/action-tickets` | List admin tickets |
| `actionTickets` | POST | `/action-tickets/:id/approve` | Approve ticket |
| `settings` | POST | `/users/me/password` | Change password |
| `settings` | PATCH | `/users/me` | Update profile/email |
| `apiKeys` | GET/POST | `/api-keys` | List/create API keys |
| `users` | GET/PATCH | `/users/me` | Get/update user profile |

### Contracts (`src/lib/api/contracts.ts`)

Full TypeScript type system with **response mappers** that normalize backend data:

| Mapper | Purpose |
|--------|---------|
| `mapWallet()` | Normalize wallet balances (incoming/pending/available/total) |
| `mapLedgerEntry()` | Map ledger entry types, directions, statuses |
| `mapStore()` | Normalize store data |
| `mapGateway()` | Normalize gateway config |
| `mapPaymentLink()` | Map payment link data |
| `mapActionTicket()` | Map admin ticket with merchant info |

**Key Types:**

| Type | Fields |
|------|--------|
| `AuthUser` | id, username, email, role, organization_id, created_at |
| `Wallet` | id, currency_code, type, balance_incoming/pending/available/total |
| `LedgerEntry` | id, type, status, direction, amount, currency, description, reference |
| `Store` | id, name, store_id, status, created_at |
| `PaymentLink` | id, amount, currency, status, shareable_url, expires_at |
| `ActionTicket` | id, type, priority, merchant, metadata, status |

---

## React Query Hooks

14 hooks in `src/hooks/use-wallets.ts` — all use TanStack Query with automatic cache invalidation:

| Hook | Type | Endpoint | On Success Invalidation |
|------|------|----------|------------------------|
| `useWallets` | query | `GET /wallets` | — |
| `useSwap` | mutation | `POST /swap` | wallets, ledger |
| `usePayout` | mutation | `POST /payout` | wallets, ledger |
| `useDeposit` | mutation | `POST /deposits` | wallets, ledger, payment-links |
| `useStores` | query | `GET /stores` | — |
| `useCreateStore` | mutation | `POST /stores` | stores |
| `useGateways` | query | `GET /settings/gateways` | — |
| `useConfigureGateway` | mutation | `POST /settings/gateways` | gateways |
| `usePaymentLinks` | query | `GET /payment-links` | — |
| `useCreatePaymentLink` | mutation | `POST /payment-links` | payment-links, ledger |
| `useLedger` | query | `GET /ledger` | — |
| `useActionTickets` | query | `GET /action-tickets` | — |
| `useApproveTicket` | mutation | `POST /action-tickets/:id/approve` | action-tickets |

### Query Configuration

```typescript
// providers.tsx
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,     // 30 seconds
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

---

## Deprecated Local API Routes

The following 7 local API routes have been **deprecated and converted to stubs**. They return `{ deprecated: true }` and are no longer used by the frontend. ALL data now flows through `https://api.atlasglobal.digital/api/v1`.

| Route | Status | Replacement |
|-------|--------|-------------|
| `/api/kyb` | ⚠️ Deprecated stub | Backend API |
| `/api/transactions` | ⚠️ Deprecated stub | Backend API |
| `/api/storefronts` | ⚠️ Deprecated stub | Backend API |
| `/api/v2/analytics` | ⚠️ Deprecated stub | Backend API |
| `/api/v2/customers` | ⚠️ Deprecated stub | Backend API |
| `/api/v2/merchants` | ⚠️ Deprecated stub | Backend API |
| `/api/v2/payments/process` | ⚠️ Deprecated stub | Backend API |
| `/api` | ✅ Active | Health check: `{ message: "Hello, world!" }` |

> The route files still exist in the repository but contain minimal stub implementations. They may be removed entirely in a future cleanup.

---

## Database Schema (Local Dev Only — Prisma + SQLite)

> **Important:** SQLite/Prisma is used **only for local development**. In production, ALL data is managed by the backend API's PostgreSQL database. The frontend never connects directly to any database.

10 models for local dev/demo data:

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Base user | email (unique), role, locale, avatarUrl |
| **Merchant** | Merchant with tier | tier (bronze/silver/gold), monthlyVolume, chargebackRate, approvalRate, allowedMethods |
| **MerchantTier** | Tier configuration | tierLevel (unique), minVolume, feeDiscount, routingPriority, maxRules, features |
| **Transaction** | Payment with routing | gateway, region, routingEngine, routingLevel, confidence, feeAmount, netAmount |
| **RoutingRule** | Custom routing rules | level, conditions (JSON), gateway, fallbackGateway, hitCount |
| **Customer** | CRM data | ltv, churnRisk, totalSpent, txCount, avgOrderValue, tags |
| **LedgerEntry** | Financial ledger | type, status, direction, amount, currency, reference |
| **Store** | E-commerce store | name, status, jurisdiction, complianceText |
| **StorefrontProduct** | Store products | name, price, status, storeId |
| **PaymentLink** | Checkout links | amount, currency, status, expiresAt, shareableUrl |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** (production) | Supabase project URL (e.g., `https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** (production) | Supabase anonymous/public key |
| `NEXT_PUBLIC_API_URL` | No | Backend API URL (default: `https://api.atlasglobal.digital/api/v1`) |
| `NEXT_PUBLIC_ENABLE_DEV_BYPASS` | No | Set to `true` to enable dev bypass mode (dev only, never in production) |

### Supabase Configuration

The Supabase client (`src/lib/supabase.ts`) is configured with real credentials in production. When environment variables are missing, it falls back to a no-op shim that allows the module to load without crashing (useful for initial setup).

```typescript
// When NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set:
// → Creates a real Supabase client with full auth capabilities
// When missing:
// → Creates a minimal no-op client (auth calls will fail gracefully)
// → Dev bypass mode still works if NEXT_PUBLIC_ENABLE_DEV_BYPASS=true
```

---

## CORS Configuration

All API requests from the frontend to `api.atlasglobal.digital` use CORS mode (`mode: 'cors'`). The backend Express.js server must be configured to accept requests from the frontend domain.

```typescript
// Frontend (api/client.ts)
fetch(`${API_BASE}${endpoint}`, { ...options, mode: 'cors', headers })
```

---

## Admin Access Control

| Section | Admin | Merchant | Customer |
|---------|-------|----------|----------|
| Dashboard Overview | ✅ | ✅ | ✅ |
| Wallet Management | ✅ | ✅ | ✅ |
| Transaction Activity | ✅ | ✅ | ✅ |
| Swap & Convert | ✅ | ✅ | ✅ |
| Payouts | ✅ | ✅ | ❌ |
| Deposits | ✅ | ✅ | ❌ |
| Store Management | ✅ | ✅ | ❌ |
| Gateway Configuration | ✅ | ✅ | ❌ |
| Payment Links | ✅ | ✅ | ❌ |
| Settings & Security | ✅ | ✅ | ✅ |
| Admin Approvals | ✅ | ❌ | ❌ |
| System Liquidity | ✅ | ❌ | ❌ |
| API Management | ✅ | ✅ | ❌ |

---

## Internationalization

4 locales supported via `next-intl`:

| Code | Language | Region |
|------|----------|--------|
| `en` | English | International |
| `fr` | French | France |
| `pt-PT` | Portuguese | Portugal |
| `pt-BR` | Portuguese | Brazil |

---

## Deployment

### Domain

- **Primary domain**: `atlasglobal.digital`
- **API backend**: `https://api.atlasglobal.digital/api/v1`
- **SEO metadata** is configured for `atlasglobal.digital` in `src/app/layout.tsx`

### Build & Deploy

```bash
# Build the application
bun run build

# Start production server
bun run start
```

### Production Architecture

```
  Internet
     │
     ▼
  Caddy (Reverse Proxy, port :81)
     │
     ▼
  Next.js (standalone, port :3000)
     │
     ├── Supabase Auth (auth.atlasglobal.digital)
     │
     ├── Backend API (api.atlasglobal.digital/api/v1)
     │
     └── CoinGecko API (api.coingecko.com) — for Exchange page
```

> **Note:** There is NO SQLite, Prisma, or local database in production. All data goes through the backend API's PostgreSQL database. The Supabase Auth service handles authentication independently.

### Logo

The official logo (`logo-atlas-core.png`) is used throughout the site:
- Browser favicon (16x16 to 256x256)
- Apple Touch Icon (180x180)
- Open Graph image
- Navbar and footer branding

---

## Development

```bash
# Install dependencies
bun install

# Start development server (port 3000)
bun run dev

# Run linting
bun run lint

# Push database schema (local dev only)
bun run db:push
```

### Dev Bypass Mode

For local development without Supabase, set in `.env.local`:

```env
NEXT_PUBLIC_ENABLE_DEV_BYPASS=true
```

This allows login with any credentials (creates a fake admin user). The UI shows a `DEV BYPASS` badge.

---

## Compliance & Legal

| Entity | Details |
|--------|---------|
| **Operator** | Sergio Monteiro (EI) — SIREN 790 155 006 — SIRET 79015500600014 |
| **Holding** | IAHUB360 LTD — UK Reg. #16568194 |
| **Jurisdictions** | EU (France), UK, Brazil |
| **Status** | Technical Service Provider (TSP) — NOT a Financial Institution |
| **Year Established** | 2013 (France) |

### Legal Documents

All legal documents are accessible via the Legal Hub page:

- Terms of Service
- Privacy Policy
- Compliance Manifesto
- Refund Policy
- Corporate Structure

---

## License

Proprietary — Atlas Global Core. All rights reserved.
