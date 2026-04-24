<div align="center">

# Atlas Global Core

**The Context-Aware Orchestration Layer for the Global Agentic Economy**

<p>
  <img src="public/logo-dark.png" alt="Atlas Global Core" width="280" />
</p>

AI-driven liquidity routing · Real-time dynamic compliance · Seamless B2B settlement across Fiat & Crypto

</div>

---

## Overview

Atlas Global Core is the **B2B infrastructure platform** that fuses AI, Financial Orchestration (Fiat & Crypto via Stripe, Onramp.money, Viva.com), and Intelligent Routing into a single context-aware orchestration layer.

The platform enables merchants and enterprises to:

- **Route liquidity intelligently** — AI-driven decision engine selects optimal payment rails (Viva.com / Onramp.money / Stripe) in real time
- **Maintain dynamic compliance** — Automated KYC/KYB, jurisdiction-aware rules, and regulatory guardrails across 47 countries
- **Settle seamlessly** — Unified fiat-to-crypto and crypto-to-fiat B2B settlement with a 3-stage treasury model
- **Operate globally** — Multi-currency, multi-tenant, multi-jurisdiction from a single dashboard

---

## Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend** | Next.js 16 + React 19 + TypeScript 5 | App Router, SPA-style navigation |
| **Styling** | Tailwind CSS 4 + Framer Motion | Hacker-Luxe dark theme |
| **Client State** | Zustand | Auth, dashboard, navigation |
| **Server State** | TanStack React Query | 14 hooks, background refetch |
| **Authentication** | Supabase Auth | JWKS asymmetric architecture |
| **Backend API** | Express.js (hosted separately) | `https://api.atlasglobal.digital/api/v1` |
| **Database** | PostgreSQL (managed by backend) | No Prisma on Next.js side |
| **Maps** | react-simple-maps | Network topology visualization |
| **Charts** | Recharts | Financial charts & KPIs |
| **Icons** | Lucide React | Consistent icon system |
| **UI Library** | shadcn/ui (New York style) | 40+ pre-built components |

### Design System

| Token | Value | Usage |
|-------|-------|-------|
| **Matrix Green** | `#39FF14` | Primary accent, CTAs, active states |
| **Cyber Blue** | `#00F0FF` | Secondary accent, links, highlights |
| **Background** | Deep black / near-black | `#050505` / `#0A0A0A` |
| **Surface** | `rgba(255,255,255,0.03)` | Glass-morphism cards |
| **Text Primary** | `#FFFFFF` | Headings, labels |
| **Text Secondary** | `#94A3B8` | Descriptions, muted content |

---

## The Golden Rule: "Dumb Frontend, Smart Backend"

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│              │  REST  │              │  SQL   │              │
│   Next.js    │───────▶│  Backend API │───────▶│  PostgreSQL  │
│  (Frontend)  │  JSON  │  (Express)   │        │  (Database)  │
│              │◀───────│              │◀───────│              │
└──────────────┘        └──────────────┘        └──────────────┘

  ❌ Frontend → Database    (NEVER)
  ✅ Frontend → Backend API  (ALWAYS)
```

> **The frontend NEVER connects directly to the production database.**

- All business logic, data creation, and transactions are handled exclusively by the backend API
- Next.js is responsible for **three things only**:
  1. **UI rendering** — Components, layouts, animations
  2. **State management** — Zustand stores for auth, dashboard, navigation
  3. **Data fetching** — React Query hooks that call the backend API

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
     │                                                     │
     │    GET /users/me + Authorization: Bearer <token>     │
     │────────────────────────────────────────────────────▶│
     │◀────────────────── { data: { id, role, ... } } ─────│
```

### Flow Details

| Step | Action | Direction |
|------|--------|-----------|
| **REGISTER** | `supabase.auth.signUp()` | UI → Supabase |
| | Backend auto-creates user record | Supabase → Backend (Webhook) |
| **LOGIN** | `supabase.auth.signInWithPassword()` | UI → Supabase |
| | Returns `access_token` (JWT) | Supabase → UI |
| **API CALL** | `Authorization: Bearer <token>` | UI → Backend |
| | Backend validates JWKS signature | Backend middleware |
| **SESSION** | `supabase.auth.getSession()` | UI (on mount) |
| | Auto-refresh token | Supabase (transparent) |

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

> React Query hooks automatically unwrap the `data` field via mappers defined in `src/lib/api/contracts.ts`.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Main SPA router (Landing, AtlasWallet, Studio, etc.)
│   ├── layout.tsx                # Root layout with metadata, fonts, providers
│   └── globals.css               # Complete theme system (CSS variables, animations)
│
├── components/
│   ├── atlas/                    # Landing page sections
│   │   ├── landing-page.tsx      # Full landing page (Hero, AI Engine, Marketplace, etc.)
│   │   ├── living-background.tsx # Manus.im-style animated particle background
│   │   ├── nexflowx-companion.tsx# AI Orb floating assistant
│   │   ├── navbar.tsx            # Top navigation bar with scroll detection
│   │   ├── footer.tsx            # Legal footer (SIREN, compliance)
│   │   ├── command-hub.tsx       # Unified command/knowledge hub
│   │   ├── legal-hub.tsx         # Legal documents & terms
│   │   ├── services-page.tsx     # Detailed services page
│   │   ├── pricing-page.tsx      # Pricing tiers & plans
│   │   └── studio-builder.tsx    # Atlas Studio visual builder
│   │
│   ├── wallet/                   # AtlasWallet Dashboard
│   │   ├── dashboard-shell.tsx       # Auth guard + section router
│   │   ├── login-page.tsx            # Supabase login/register with canvas animation
│   │   ├── sidebar.tsx               # Desktop + mobile responsive sidebar
│   │   ├── header.tsx                # Top bar with clock, search, role badge
│   │   ├── dashboard-overview.tsx    # KPIs + activity feed + world map
│   │   ├── wallet-cards.tsx          # 3-stage settlement treasury cards
│   │   ├── swap-widget.tsx           # Currency conversion (crypto/fiat)
│   │   ├── payout-widget.tsx         # Payout request management
│   │   ├── deposit-widget.tsx        # Deposit via payment links
│   │   ├── financial-activity-table.tsx # Ledger with advanced filters
│   │   ├── stores-panel.tsx          # Multi-tenant store CRUD
│   │   ├── gateways-panel.tsx        # Payment gateway configuration
│   │   ├── payment-links-panel.tsx   # Checkout link management
│   │   ├── settings-security.tsx     # Password, Email, 2FA, Notifications
│   │   ├── admin-approval-table.tsx  # Admin ticket approval
│   │   ├── system-liquidity-panel.tsx# Admin liquidity overview
│   │   ├── api-management.tsx        # API Keys, Webhooks, Reference
│   │   ├── glow-wrapper.tsx          # Neon glow effect wrapper
│   │   ├── glass-card.tsx            # Glass-morphism card component
│   │   ├── metric-card.tsx           # KPI metric display card
│   │   ├── neon-chart.tsx            # Styled chart wrapper
│   │   ├── world-map-network.tsx     # Interactive network map
│   │   └── index.ts                  # Barrel exports
│   │
│   └── ui/                       # shadcn/ui components (40+ components)
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input.tsx
│       ├── input-otp.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle.tsx
│       ├── toggle-group.tsx
│       ├── tooltip.tsx
│       └── ...
│
├── hooks/
│   ├── use-wallets.ts            # All React Query hooks (14 hooks)
│   ├── use-mobile.ts             # Mobile breakpoint detection
│   └── use-toast.ts              # Toast notification hook
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # API client (api.atlasglobal.digital)
│   │   └── contracts.ts          # TypeScript types + response mappers
│   ├── auth-store.ts             # Zustand auth state (Supabase integration)
│   ├── dashboard-store.ts        # Dashboard section navigation state
│   ├── store.ts                  # Global page navigation state
│   ├── supabase.ts               # Supabase client configuration
│   ├── nexflowx.ts               # NeXFlowX AI engine utilities
│   └── utils.ts                  # cn() utility + helpers
│
├── providers.tsx                 # Global providers (QueryClient, Tooltip, etc.)
└── i18n/
    ├── config.ts                 # Internationalization configuration
    └── request.ts                # i18n request handler
```

---

## Landing Page Sections

The landing page is built as a single-page application with smooth scroll navigation between sections:

| # | Section | Description |
|---|---------|-------------|
| 1 | **Hero** | "The Context-Aware Orchestration Layer for the Global Agentic Economy" — headline with animated background |
| 2 | **NeXFlowX AI-Engine** | Visual flow diagram: Input Signals → AI Engine → Routing Decisions (Viva.com / Onramp.money / Stripe) |
| 3 | **Private B2B Marketplace** | Compute Power (GPU), Agentic Workflows, Digital IP Assets — tokenized and tradable |
| 4 | **Core Modules** | NeXFlowX Routing, Brain CRM, Atlas Studio — feature deep-dive cards |
| 5 | **Trust Bar** | Stripe, Viva.com, Onramp.money, PCI-DSS, ISO 27001 — partner & compliance logos |
| 6 | **Stats** | 99.97% uptime · <50ms latency · 12M+ transactions · 47 countries — animated counters |

### Key Components

- **`living-background.tsx`** — Manus.im-inspired particle system with matrix-green trailing effects
- **`nexflowx-companion.tsx`** — Floating AI Orb with contextual chat assistant capabilities
- **`navbar.tsx`** — Scroll-aware top bar with section anchors and auth integration

---

## AtlasWallet Dashboard

The merchant dashboard is a comprehensive financial management interface with **13 sections** and lazy loading:

```
┌─────────────────────────────────────────────────────┐
│  Header  │  AtlasWallet                    Admin ●  │
├──────────┼──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │          Active Section                  │
│          │     (Overview / Wallets / Swap /         │
│  ▸ Over  │      Payouts / Deposits / Activity /     │
│  ▸ Wall  │      Stores / Gateways / Links /         │
│  ▸ Swap  │      Settings / Admin / API)             │
│  ▸ Pay   │                                          │
│  ▸ Dep   │                                          │
│  ▸ Act   │                                          │
│  ▸ Stor  │                                          │
│  ▸ Gate  │                                          │
│  ▸ Link  │                                          │
│  ▸ Sett  │                                          │
│  ▸ Admin │                                          │
│  ▸ API   │                                          │
└──────────┴──────────────────────────────────────────┘
```

### 3-Stage Settlement Model

```
  Incoming           Pending              Available
  ┌────────┐        ┌────────┐           ┌────────┐
  │  $0.00 │───────▶│  $0.00 │──────────▶│  $0.00 │
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

| Feature | Admin | Merchant | Customer |
|---------|-------|----------|----------|
| Dashboard Overview | ✅ | ✅ | ✅ |
| Wallet Management | ✅ | ✅ | ✅ |
| Swap & Convert | ✅ | ✅ | ✅ |
| Payouts | ✅ | ✅ | ❌ |
| Deposits | ✅ | ✅ | ❌ |
| Store Management | ✅ | ✅ | ❌ |
| Gateway Config | ✅ | ✅ | ❌ |
| Payment Links | ✅ | ✅ | ❌ |
| Settings & Security | ✅ | ✅ | ✅ |
| Admin Approvals | ✅ | ❌ | ❌ |
| System Liquidity | ✅ | ❌ | ❌ |
| API Management | ✅ | ✅ | ❌ |

### React Query Hooks (`use-wallets.ts`)

The dashboard uses **14 React Query hooks** for all data operations:

| Hook | Method | Endpoint |
|------|--------|----------|
| `useProfile` | GET | `/users/me` |
| `useWallets` | GET | `/wallets` |
| `useTransactions` | GET | `/transactions` |
| `usePayouts` | GET | `/payouts` |
| `useStores` | GET | `/stores` |
| `useGateways` | GET | `/gateways` |
| `usePaymentLinks` | GET | `/payment-links` |
| `useAdminUsers` | GET | `/admin/users` |
| `usePendingPayouts` | GET | `/admin/payouts/pending` |
| `useCreatePayout` | POST | `/payouts` |
| `useCreatePaymentLink` | POST | `/payment-links` |
| `useCreateStore` | POST | `/stores` |
| `useSwapCurrency` | POST | `/wallets/swap` |
| `useApprovePayout` | PATCH | `/admin/payouts/:id/approve` |

---

## Environment Variables

```env
# Backend API
NEXT_PUBLIC_API_URL=https://api.atlasglobal.digital/api/v1

# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Development (set to "true" to bypass auth in local dev)
NEXT_PUBLIC_ENABLE_DEV_BYPASS=false
```

> **Note:** All `NEXT_PUBLIC_*` variables are exposed to the browser. Never store secrets or private keys in environment variables prefixed with `NEXT_PUBLIC_`.

---

## CORS Configuration

- `wallet.atlasglobal.digital` is **whitelisted** on the backend CORS middleware
- `localhost:3000` is included in development mode
- No CORS issues expected in production deployments

---

## Admin Access

Admin functionality is enforced at the **backend level** — the frontend simply hides UI elements for non-admin users:

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

## Deployment

| Property | Value |
|----------|-------|
| **Framework** | Next.js 16 with `standalone` output |
| **Runtime** | Bun |
| **Recommended** | Vercel (automatic Next.js detection) |
| **Build command** | `next build` |
| **Start command** | `next start` |
| **Node version** | 20.x+ |

### Vercel Deployment

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy — Vercel auto-detects Next.js and configures build

### Self-Hosted Deployment

```bash
# Install dependencies
bun install

# Build for production
bun run build

# Start production server
bun run start
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Animation** | Framer Motion |
| **Client State** | Zustand |
| **Server State** | TanStack React Query |
| **Authentication** | Supabase Auth (JWKS) |
| **Charts** | Recharts |
| **Maps** | react-simple-maps |
| **Components** | shadcn/ui (New York style) |
| **Icons** | Lucide React |
| **Runtime** | Bun |

---

## Compliance

| Certification | Status |
|---------------|--------|
| **PCI-DSS** | Compatible |
| **ISO 27001** | Compatible |
| **PSD2** | Compatible |
| **LGPD** | Compatible |

> **Operated by** Sergio Monteiro (EI) — SIREN 790 155 006
>
> Atlas Global Core operates as a **Technical Service Provider (TSP)** and is **not** a Financial Institution. All payment processing is conducted through licensed partners (Stripe, Viva.com, Onramp.money).

---

## License

**Proprietary — Atlas Global Core**

All rights reserved. Unauthorized reproduction, distribution, or modification of this software is strictly prohibited.

---

<div align="center">

**Built with precision. Orchestrated by intelligence.**

*Atlas Global Core — The Context-Aware Orchestration Layer for the Global Agentic Economy*

</div>
