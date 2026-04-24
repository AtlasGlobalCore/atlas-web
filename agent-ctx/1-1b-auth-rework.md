# Task ID: 1 & 1b — Auth System Rework & API Cleanup

**Agent:** Main Agent
**Date:** 2025-01-XX

## Summary
Complete auth system rework replacing the no-op Supabase shim with a real Supabase client, upgrading the API client with a proper auth token interceptor pattern, redesigning the login/register UI with separate forms, and gutting deprecated local API routes.

## Changes Made

### 1a. `src/lib/supabase.ts` — Full Rewrite
- Replaced the no-op shim with a real `@supabase/supabase-js` `createClient()` call
- Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from environment
- Falls back to placeholder URL/key when env vars are missing (avoids `createClient` crash)
- Emits a `console.warn` when env vars are missing so developers know to configure them
- Removed `supabaseAdmin` export and `SupabaseClient` type (not needed)

### 1b. `src/lib/api/client.ts` — Auth Token Interceptor
- Added `getAuthToken()` async function that:
  1. First tries `supabase.auth.getSession()` for a fresh access token
  2. Falls back to `localStorage.getItem('nexflowx_token')`
  3. Returns `null` if neither is available
- Updated `request()` to call `await getAuthToken()` before each fetch (replacing direct `localStorage` access)
- Updated `deposits.create()` to also use `getAuthToken()` instead of direct `localStorage`
- Updated version comment to V2.10
- All existing endpoints (wallets, swap, payout, ledger, etc.) remain unchanged

### 1c. `src/lib/auth-store.ts` — Updated Login/Register
- `login()` signature changed from `(email, password)` to `(identifier, password)`
  - Parameter is labeled `identifier` for UX clarity (UI shows "Identificador")
  - Still passes value as `email` to `supabase.auth.signInWithPassword()`
  - DEV BYPASS `createBypassUser()` also updated to use `identifier`
- `register()` signature remains `(email, password)` — register form sends email separately
- All other logic preserved: DEV BYPASS, token storage in localStorage, `api.auth.me()` validation, error handling

### 1c. `src/components/wallet/login-page.tsx` — New Login/Register UI
**LOGIN form (mode === 'login'):**
- Field 1: "Identificador" — text input with User icon, placeholder "ID ou Email"
- Field 2: "Palavra-passe" — password input with Lock icon, show/hide toggle
- Button: "Entrar na Plataforma"
- Calls `login(loginIdentifier, regPassword)`

**REGISTER form (mode === 'register'):**
- Field 1: "Identificador" — text input with User icon (optional, for UX)
- Field 2: "Email" — email input with Mail icon, required
- Field 3: "Palavra-passe" — password input, min 8 chars, show/hide toggle
- Field 4: "Confirmar Palavra-passe" — password input, must match, separate show/hide toggle
- Button: "Criar Conta"
- Client-side validation: password match check before submit
- Calls `register(regEmail, regPassword)`

**Preserved:**
- FinancialCanvas particle background animation
- glass-panel styling
- DEV BYPASS badge and hint
- Registration success message ("Conta criada com sucesso!...")
- Error handling with red error box
- Logo3D component usage
- All neon styling classes (neon-input, neon-btn-primary, neon-glow, etc.)
- Tab toggle between Entrar/Registar
- Secure notice footer with TLS 1.3 / AES-256-GCM

### 1d. Deprecated API Routes — Gutted
All routes now return a deprecation JSON message pointing to the external API:
- `src/app/api/route.ts` — Kept as health check (returns `{ status: 'ok', service, timestamp }`)
- `src/app/api/kyb/route.ts` — Gutted (was 81 lines of DB logic)
- `src/app/api/transactions/route.ts` — Gutted (was 128 lines of DB/mock logic)
- `src/app/api/storefronts/route.ts` — Gutted (was 69 lines of DB logic)
- `src/app/api/v2/analytics/route.ts` — Gutted (was 148 lines of mock analytics)
- `src/app/api/v2/customers/route.ts` — Gutted (was 391 lines of mock CRM)
- `src/app/api/v2/merchants/route.ts` — Gutted (was 285 lines of mock merchants)
- `src/app/api/v2/payments/process/route.ts` — Gutted (was 346 lines of NeXFlowX routing)

## Verification
- `bun run lint`: 0 errors, 0 warnings
- Dev server: Compiles successfully, serves `GET / 200`
- Pre-existing issue: `react-simple-maps` and `d3-geo` modules not installed (unrelated to this task)

## Files Modified
1. `/src/lib/supabase.ts` — Full rewrite (18 lines)
2. `/src/lib/api/client.ts` — Added `getAuthToken()`, updated `request()` (166 lines)
3. `/src/lib/auth-store.ts` — Updated `login()` signature and bypass logic (227 lines)
4. `/src/components/wallet/login-page.tsx` — New login/register UI (370 lines)
5-11. API routes — Gutted to deprecation stubs
