import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, NexFlowXAPIError, clearAuthTokens } from './api/client';
import { supabase } from './supabase';
import type { AuthUser, UserRole } from './api/contracts';

/* ═══════════════════════════════════════════════════════════
   DEV BYPASS — Controlled by NEXT_PUBLIC_ENABLE_DEV_BYPASS
   Disabled by default. Never activates in production.
   When enabled, ANY credentials are accepted (no secrets in bundle).
   ═══════════════════════════════════════════════════════════ */

const DEV_BYPASS_ENABLED =
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_PUBLIC_ENABLE_DEV_BYPASS === 'true';

if (DEV_BYPASS_ENABLED) {
  console.warn(
    '[Atlas GP] ⚠️  DEV BYPASS is ACTIVE. Any credentials will be accepted.' +
    ' This mode is disabled in production and must never be committed with NEXT_PUBLIC_ENABLE_DEV_BYPASS=true.'
  );
}

function createBypassUser(identifier: string): AuthUser {
  return {
    id: 'dev-bypass-001',
    username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
    email: identifier.includes('@') ? identifier : `${identifier}@dev.local`,
    role: 'admin' as UserRole,
    organization_id: 'org-dev-bypass',
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  };
}

export const IS_DEV_MODE = DEV_BYPASS_ENABLED;
/* ═══════════════════════════════════════════════════════ */

interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  isDevMode: boolean;
  user: AuthUser | null;
  loginError: string | null;
  registerError: string | null;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  validateToken: () => Promise<void>;
  clearErrors: () => void;
}

export function isAdmin(user: AuthUser | null): boolean { return user?.role === 'admin'; }
export function isMerchant(user: AuthUser | null): boolean { return user?.role === 'merchant'; }
export function isCustomer(user: AuthUser | null): boolean { return user?.role === 'customer'; }
export function getUserRole(user: AuthUser | null): UserRole { return user?.role ?? 'customer'; }

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false, isLoading: false, isDevMode: false, user: null, loginError: null, registerError: null,

      clearErrors: () => set({ loginError: null, registerError: null }),

      /**
       * Login with identifier (email or username) + password.
       * Uses Supabase Auth's signInWithPassword (requires a valid email).
       */
      login: async (identifier: string, password: string) => {
        set({ isLoading: true, loginError: null, registerError: null });

        /* ── DEV BYPASS (env-controlled, never in production) ── */
        if (DEV_BYPASS_ENABLED) {
          const bypassUser = createBypassUser(identifier);
          if (typeof window !== 'undefined') {
            localStorage.setItem('nexflowx_token', 'dev-token-bypass');
            localStorage.setItem('nexflowx_refresh', 'dev-refresh-bypass');
          }
          await new Promise((r) => setTimeout(r, 400)); // simulate latency
          set({ isAuthenticated: true, isDevMode: true, user: bypassUser, loginError: null, isLoading: false });
          return true;
        }
        /* ── END DEV BYPASS ── */

        try {
          // Authenticate via Supabase Auth
          // Supabase signInWithPassword requires the email field, but we accept
          // any identifier — the user sees "Identificador" in the UI.
          const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password,
          });

          if (error) {
            const message = error.message || 'Credenciais inválidas. Acesso não autorizado.';
            set({ loginError: message, isLoading: false, isAuthenticated: false, user: null, isDevMode: false });
            return false;
          }

          // Store Supabase access token for API client
          const accessToken = data.session?.access_token;
          if (accessToken && typeof window !== 'undefined') {
            localStorage.setItem('nexflowx_token', accessToken);
          }

          // Validate token on backend & fetch user profile
          const meRes = await api.auth.me();
          set({
            isAuthenticated: true,
            isDevMode: false,
            user: meRes.user,
            loginError: null,
            isLoading: false,
          });
          return true;
        } catch (err) {
          let message = 'Erro de conexão com o servidor.';
          if (err instanceof NexFlowXAPIError) {
            message = err.status === 401 ? 'Sessão inválida. Acesso não autorizado.' : err.message;
          }
          set({ loginError: message, isLoading: false, isAuthenticated: false, user: null, isDevMode: false });
          return false;
        }
      },

      /**
       * Register with email + password via Supabase Auth.
       */
      register: async (email: string, password: string) => {
        set({ isLoading: true, registerError: null, loginError: null });

        /* ── DEV BYPASS (env-controlled, never in production) ── */
        if (DEV_BYPASS_ENABLED) {
          const bypassUser = createBypassUser(email);
          if (typeof window !== 'undefined') {
            localStorage.setItem('nexflowx_token', 'dev-token-bypass');
            localStorage.setItem('nexflowx_refresh', 'dev-refresh-bypass');
          }
          await new Promise((r) => setTimeout(r, 400)); // simulate latency
          set({ isAuthenticated: true, isDevMode: true, user: bypassUser, registerError: null, isLoading: false });
          return true;
        }
        /* ── END DEV BYPASS ── */

        try {
          // Register via Supabase Auth
          const { data, error } = await supabase.auth.signUp({ email, password });

          if (error) {
            const message = error.message || 'Erro ao criar conta. Tente novamente.';
            set({ registerError: message, isLoading: false, isAuthenticated: false, user: null });
            return false;
          }

          // If Supabase requires email confirmation, user may be null
          if (!data.session) {
            // Email confirmation required — user must verify email first
            set({
              isLoading: false,
              registerError: null,
              // Mark a special state so the UI can show "check your email"
              isAuthenticated: false,
              user: null,
            });
            return true; // Return true — registration succeeded, just needs confirmation
          }

          // Auto-confirmed: store token and validate on backend
          const accessToken = data.session.access_token;
          if (accessToken && typeof window !== 'undefined') {
            localStorage.setItem('nexflowx_token', accessToken);
          }

          const meRes = await api.auth.me();
          set({
            isAuthenticated: true,
            isDevMode: false,
            user: meRes.user,
            registerError: null,
            isLoading: false,
          });
          return true;
        } catch (err) {
          let message = 'Erro de conexão com o servidor.';
          if (err instanceof NexFlowXAPIError) {
            message = err.message;
          }
          set({ registerError: message, isLoading: false, isAuthenticated: false, user: null });
          return false;
        }
      },

      logout: async () => {
        try { await supabase.auth.signOut(); } catch { /* ignore Supabase signOut failures */ }
        clearAuthTokens();
        set({ isAuthenticated: false, user: null, loginError: null, registerError: null, isLoading: false, isDevMode: false });
      },

      validateToken: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('nexflowx_token') : null;
        if (!token) { set({ isAuthenticated: false, user: null }); return; }

        /* ── DEV BYPASS token validation ── */
        if (DEV_BYPASS_ENABLED && token === 'dev-token-bypass') {
          const fallbackUser = createBypassUser('dev@local');
          set({ isAuthenticated: true, isDevMode: true, user: fallbackUser, isLoading: false });
          return;
        }
        /* ── END DEV BYPASS ── */

        set({ isLoading: true });
        try {
          // First, check Supabase session is still valid
          const { data: sessionData } = await supabase.auth.getSession();
          if (!sessionData.session) {
            clearAuthTokens();
            set({ isAuthenticated: false, user: null, isLoading: false, isDevMode: false });
            return;
          }

          // Refresh the stored token in case Supabase rotated it
          const freshToken = sessionData.session.access_token;
          if (freshToken && typeof window !== 'undefined') {
            localStorage.setItem('nexflowx_token', freshToken);
          }

          // Validate on backend (validates the Supabase JWT)
          const res = await api.auth.me();
          set({ isAuthenticated: true, isDevMode: false, user: res.user, isLoading: false });
        } catch {
          clearAuthTokens();
          set({ isAuthenticated: false, user: null, isLoading: false, isDevMode: false });
        }
      },
    }),
    { name: 'nexflowx-auth', partialize: (state) => ({ isAuthenticated: state.isAuthenticated, isDevMode: state.isDevMode, user: state.user }) }
  )
);
