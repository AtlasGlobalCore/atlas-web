<div align="center">

# Atlas Global Core

**The Context-Aware Orchestration Layer for the Global Agentic Economy**

<p>
  <img src="public/logo-dark.png" alt="Atlas Global Core" width="280" />
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
- [AtlasWallet Dashboard](#atlaswallet-dashboard)
- [NeXFlowX Routing Engine](#nexflowx-routing-engine-v30)
- [State Management](#state-management)
- [API Client & Contracts](#api-client--contracts)
- [React Query Hooks](#react-query-hooks)
- [Local API Routes](#local-api-routes)
- [Database Schema](#database-schema-prisma--sqlite)
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
| **Domain** | `atlasglobalcore.com` |
| **API Backend** | `https://api.atlasglobal.digital/api/v1` |
| **Operator** | Sergio Monteiro (EI) — SIREN 790 155 006 |
| **Holding** | IAHUB360 LTD — UK Reg. #16568194 |
| **Version** | 2.1.0 |
| **Runtime** | Bun |

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                       CLIENT (Bun + Next.js 16)                  │
│                                                                   │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────────┐   │
│  │  Zustand    │  │  TanStack    │  │  Supabase Auth         │   │
│  │  (3 stores) │  │  React Query │  │  (signUp / signIn)     │   │
│  │  - store    │  │  (14 hooks)  │  │  → JWT → localStorage  │   │
│  │  - auth     │  │              │  └───────────┬────────────┘   │
│  │  - dashboard│  └──────┬───────┘              │                 │
│  └────────────┘         │                Bearer token            │
│                     query key              (nexflowx_token)       │
│                          │                       │                │
│  ┌───────────────────────▼───────────────────────▼───────────┐   │
│  │              API Client V2.00                              │   │
│  │              api.atlasglobal.digital/api/v1                │   │
│  │              (CORS-enabled, typed, error-boundary)         │   │
│  └───────────────────────┬────────────────────────────────────┘   │
└──────────────────────────┼────────────────────────────────────────┘
                           │ HTTPS / REST / JSON
┌──────────────────────────▼────────────────────────────────────────┐
│                   BACKEND (Express.js — Hosted Separately)        │
│                                                                   │
│  ┌─────────────┐   ┌──────────────┐   ┌────────────────────┐    │
│  │  JWKS Auth  │→ │  Business     │→ │  PostgreSQL         │    │
│  │  Middleware  │   │  Logic       │   │  (Production DB)   │    │
│  │  (Supabase  │   │  (Wallets,   │   │                    │    │
│  │   JWT       │   │   Routing,   │   │                    │    │
│  │   verify)   │   │   Settlement)│   │                    │    │
│  └─────────────┘   └──────────────┘   └────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘

              LOCAL DEMO ROUTES (Next.js API Routes):
┌──────────────────────────────────────────────────────────────────┐
│  /api/v2/payments/process  ← NeXFlowX v3.0 Engine (simulated)  │
│  /api/v2/merchants         ← Tier system with mock fallback     │
│  /api/v2/customers         ← CRM with mock fallback             │
│  /api/v2/analytics         ← Dashboard KPIs (mock data)        │
│  /api/kyb                  ← KYB verification CRUD              │
│  /api/transactions         ← Transaction list + routing         │
│  /api/storefronts          ← E-commerce store CRUD              │
│                            ↓                                     │
│              Prisma → SQLite (db/custom.db)                      │
└──────────────────────────────────────────────────────────────────┘
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
| **Authentication** | Supabase Auth | 2.x | JWKS asymmetric, `signUp` / `signInWithPassword` |
| **Charts** | Recharts | 2.x | Financial charts, sparklines, KPIs |
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
| **Database (local)** | SQLite via Prisma | 6.11+ | Dev/demo data only |

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

- All business logic, data creation, and transactions are handled exclusively by the backend API
- Next.js is responsible for **three things only**:
  1. **UI rendering** — Components, layouts, animations
  2. **State management** — Zustand stores for auth, dashboard, navigation
  3. **Data fetching** — React Query hooks that call the backend API
- Local API routes (`/api/v2/*`) exist for **demo purposes only** with SQLite + mock data fallbacks

---

## Authentication Flow (Supabase Auth)

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
     │    GET /users/me + Authorization: Bearer <token>     │
     │────────────────────────────────────────────────────▶│
     │◀────────────────── { data: { id, role, ... } } ─────│
```

### Implementation Details

| Step | Action | Direction | Source File |
|------|--------|-----------|-------------|
| **REGISTER** | `supabase.auth.signUp()` | UI → Supabase | `auth-store.ts` |
| | Backend auto-creates user record | Supabase → Backend (Webhook) | — |
| **LOGIN** | `supabase.auth.signInWithPassword()` | UI → Supabase | `auth-store.ts` |
| | Returns `access_token` (JWT) | Supabase → UI | — |
| | Token stored in `localStorage.nexflowx_token` | Client-side | `auth-store.ts` |
| **API CALL** | `Authorization: Bearer <token>` | UI → Backend | `api/client.ts` |
| | Backend validates JWKS signature | Backend middleware | — |
| **SESSION** | `supabase.auth.getSession()` | UI (on mount) | `auth-store.ts` |
| | Auto-refresh token | Supabase (transparent) | — |
| **LOGOUT** | `supabase.auth.signOut()` + `clearAuthTokens()` | UI → Supabase | `auth-store.ts` |

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
  login(email: string, password: string): Promise<void>
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

> **Deprecated:** Do NOT POST directly to `/auth/login` or `/auth/register`. All auth flows go through Supabase client SDK.

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
│   ├── logo-dark.png              # Dark mode logo
│   ├── logo-light.png             # Light mode logo
│   ├── logo.svg                   # SVG logo
│   └── robots.txt                 # Search engine directives
│
├── prisma/
│   └── schema.prisma              # Database schema (10 models, SQLite)
│
├── db/
│   └── custom.db                  # SQLite database file (local demo)
│
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main SPA router (7 pages, AnimatePresence)
│   │   ├── layout.tsx             # Root layout (metadata, fonts, providers)
│   │   ├── globals.css            # Complete theme system (377 lines)
│   │   └── api/
│   │       ├── route.ts           # Health check
│   │       ├── kyb/route.ts       # KYB verification CRUD
│   │       ├── transactions/route.ts # Transactions with NeXFlowX routing
│   │       ├── storefronts/route.ts   # Store management
│   │       └── v2/
│   │           ├── analytics/route.ts     # Dashboard analytics (mock)
│   │           ├── customers/route.ts     # CRM data (mock)
│   │           ├── merchants/route.ts     # Merchant tiers (mock)
│   │           └── payments/process/route.ts # Payment processing + routing
│   │
│   ├── components/
│   │   ├── providers.tsx          # QueryClientProvider (staleTime 30s)
│   │   │
│   │   ├── atlas/                 # ─── Landing & CMS Pages (10 files) ───
│   │   │   ├── landing-page.tsx       # Full landing (Hero, AI Engine, Marketplace)
│   │   │   ├── living-background.tsx  # Manus.im particle system background
│   │   │   ├── nexflowx-companion.tsx # AI Orb floating assistant
│   │   │   ├── navbar.tsx             # Top navigation (5 items, locale switcher)
│   │   │   ├── footer.tsx             # Legal footer (SIREN, compliance, contact)
│   │   │   ├── command-hub.tsx        # Unified command/knowledge hub
│   │   │   ├── legal-hub.tsx          # Legal documents (5 tabs)
│   │   │   ├── services-page.tsx      # Detailed services page
│   │   │   ├── pricing-page.tsx       # Pricing tiers
│   │   │   └── studio-builder.tsx     # Atlas Studio visual builder
│   │   │
│   │   ├── wallet/                # ─── AtlasWallet Dashboard (22 files) ───
│   │   │   ├── dashboard-shell.tsx       # Auth guard + section router
│   │   │   ├── login-page.tsx            # Supabase login/register + canvas BG
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
│   │   │   ├── client.ts          # API Client V2.00 (Bearer auth, CORS)
│   │   │   └── contracts.ts       # TypeScript contracts + mappers
│   │   ├── auth-store.ts          # Zustand auth (Supabase + dev bypass)
│   │   ├── dashboard-store.ts     # Dashboard section navigation
│   │   ├── store.ts               # Global page navigation (SPA)
│   │   ├── supabase.ts            # Supabase client config
│   │   ├── nexflowx.ts            # NeXFlowX v3.0 engine (608 lines)
│   │   ├── db.ts                  # Prisma client (SQLite singleton)
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
| 4 | **Core Modules** | 3 deep-dive cards: NeXFlowX Routing, Brain CRM, Atlas Studio |
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
| **STUDIO** | `studio` | `StudioBuilder` | Yes |
| **PRICING** | `prices` | `PricingPage` | No |
| **SERVICES** | `services` | `ServicesPage` | No |
| **LEGAL** | `legal` | `LegalHub` | No |

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
│  Footer: 3-column legal structure + logout                   │
└─────────────────────────────────────────────────────────────┘
```

### Auth Gate Flow

```
DashboardShell (mount)
     │
     ▼
  validateToken()
     │
     ├── Not mounted? → Show Logo3D spinner
     ├── isAuthenticated === false → Show LoginPage
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
type Page = 'landing' | 'command' | 'studio' | 'legal' | 'prices' | 'services' | 'wallet'
type Locale = 'en' | 'fr' | 'pt-PT' | 'pt-BR'

interface AtlasState {
  currentPage: Page         // Default: 'landing'
  kybCompleted: boolean     // Gate for command/studio pages
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

API Client V2.00 — typed HTTP client with Bearer token auth.

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.atlasglobal.digital/api/v1'

// Token sourced from localStorage: 'nexflowx_token'
// Auth header: Authorization: Bearer <token>
// Mode: CORS
```

**Endpoints:**

| Namespace | Method | Endpoint | Purpose |
|-----------|--------|----------|---------|
| `auth` | GET | `/auth/me` | Validate JWT, get user profile |
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

## Local API Routes

8 Next.js API routes for demo/local development (SQLite-backed with mock data fallbacks):

| Route | Methods | Description | Mock Fallback |
|-------|---------|-------------|---------------|
| `/api` | GET | Health check: `{ message: "Hello, world!" }` | No |
| `/api/kyb` | POST, GET | KYB verification — upsert + query by email | No |
| `/api/transactions` | GET, POST | List/create transactions with NeXFlowX routing | 25 auto-seeded txs |
| `/api/storefronts` | GET, POST | Store CRUD with jurisdiction-aware compliance text | No |
| `/api/v2/merchants` | GET | Merchant list with tier config, summary stats | 10 mock merchants |
| `/api/v2/customers` | GET | CRM customer list with churn risk analysis | 12 mock customers |
| `/api/v2/analytics` | GET | Dashboard KPIs, charts, 30-day volume | All mock data |
| `/api/v2/payments/process` | POST, GET | Full NeXFlowX payment processing + ledger | Routing simulation |

---

## Database Schema (Prisma + SQLite)

10 models for local demo data:

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Base user | email (unique), role, locale, avatarUrl |
| **Merchant** | Merchant with tier | tier (bronze/silver/gold), monthlyVolume, chargebackRate, approvalRate, allowedMethods |
| **MerchantTier** | Tier configuration | tierLevel (unique), minVolume, feeDiscount, routingPriority, maxRules, features |
| **Transaction** | Payment with routing | gateway, region, routingEngine, routingLevel, confidence, feeAmount, netAmount |
| **RoutingRule** | Custom routing rules | level, conditions (JSON), gateway, fallbackGateway, hitCount |
| **Customer** | CRM data | ltv, churnRisk, totalSpent, txCount, avgOrderValue, tags |
| **LedgerEntry** | Reconciliation | type, amount, currency, gateway, status |
| **OnboardingProgress** | User onboarding | currentStep, completedSteps, kybSubmitted, bankConnected, apiKeysGenerated |
| **Storefront** | E-commerce store | slug (unique), products (JSON), jurisdiction, complianceText |
| **MerchantKyb** | KYB verification | companyName, registrationNumber, directorName, directorId, status |

---

## Environment Variables

```env
# ─── Backend API ───
NEXT_PUBLIC_API_URL=https://api.atlasglobal.digital/api/v1

# ─── Supabase Authentication ───
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ─── Development (bypass auth in local dev) ───
NEXT_PUBLIC_ENABLE_DEV_BYPASS=false
```

> **Note:** All `NEXT_PUBLIC_*` variables are exposed to the browser. Never store secrets or private keys in environment variables prefixed with `NEXT_PUBLIC_`.

---

## CORS Configuration

| Origin | Status |
|--------|--------|
| `wallet.atlasglobal.digital` | Whitelisted |
| `localhost:3000` | Active in development |
| `*.space.z.ai` | Allowed dev origin (sandbox) |

- CORS is handled by the backend middleware
- The API client uses `mode: 'cors'` on all requests
- No CORS issues expected in production deployments on `wallet.atlasglobal.digital`

---

## Admin Access Control

Admin functionality is enforced at the **backend level**. The frontend hides UI elements for non-admin users:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   GET /api/v1/admin/users                        │
│                                                  │
│   Authorization: Bearer <access_token>           │
│                     │                            │
│                     ▼                            │
│              ┌─────────────┐                     │
│              │  Middleware  │                     │
│              │  requireRole │                     │
│              │  ('admin')   │                     │
│              └──────┬──────┘                     │
│                     │                            │
│         ┌───────────┼───────────┐                │
│         │ role ===  │           │                │
│         │ 'admin'   │  Other    │                │
│         ▼           ▼           ▼                │
│      ✅ 200 OK   ❌ 403    ❌ 401               │
│                                                  │
└──────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Role source** | `/users/me` payload (`role` field) |
| **Admin-only routes** | `/api/v1/admin/users`, `/api/v1/admin/payouts/pending` |
| **Non-admin response** | `403 Forbidden` with `{ error: { code: "FORBIDDEN" } }` |

---

## Internationalization

| Property | Value |
|----------|-------|
| **Library** | next-intl v4.9+ |
| **Locales** | `en`, `fr`, `pt-PT`, `pt-BR` |
| **Config** | `src/i18n/config.ts` |
| **Request handler** | `src/i18n/request.ts` |
| **Locale switcher** | Navbar dropdown (Globe icon) |

---

## Deployment

| Property | Value |
|----------|-------|
| **Framework** | Next.js 16 with `standalone` output |
| **Runtime** | Bun |
| **Recommended** | Vercel (automatic Next.js detection) |
| **Build command** | `bun run build` |
| **Start command** | `bun run start` |
| **Node version** | 20.x+ |

### Vercel Deployment

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy — Vercel auto-detects Next.js and configures build

### Self-Hosted Deployment

```bash
# Install dependencies
bun install

# Set up database (local demo only)
bun run db:push

# Build for production
bun run build

# Start production server
bun run start
```

### Development

```bash
# Install dependencies
bun install

# Start dev server (port 3000)
bun run dev

# Run linter
bun run lint

# Push schema to database
bun run db:push
```

---

## Compliance & Legal

| Certification | Status |
|---------------|--------|
| **PCI-DSS** | Compatible |
| **ISO 27001** | Compatible |
| **PSD2** | Compatible |
| **LGPD** | Compatible |

### Legal Entity Structure

| Entity | Type | Jurisdiction | Registration |
|--------|------|-------------|-------------|
| Sergio Monteiro | EI (Entreprise Individuelle) | France | SIREN 790 155 006 |
| IAHUB360 LTD | LTD (Private Limited) | United Kingdom | #16568194 |
| Atlas Global Core | ENI | Portugal | NIF Pending |
| Atlas Brazil Hub | Hub | Brazil | CNPJ Pending |

> **Operated by** Sergio Monteiro (EI) — SIREN 790 155 006
>
> Atlas Global Core operates as a **Technical Service Provider (TSP)** and is **not** a Financial Institution. All payment processing is conducted through licensed partners (Stripe, Viva.com, Onramp.money, Adyen, Stark Bank).

---

## License

**Proprietary — Atlas Global Core**

All rights reserved. Unauthorized reproduction, distribution, or modification of this software is strictly prohibited.

---

<div align="center">

**Built with precision. Orchestrated by intelligence.**

*Atlas Global Core — The Context-Aware Orchestration Layer for the Global Agentic Economy*

</div>
