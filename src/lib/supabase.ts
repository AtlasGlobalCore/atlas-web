// Supabase shim — no-op implementation for local development
// Replace with real Supabase credentials when available

const noopAuth = {
  getSession: async () => ({ data: { session: null } }),
  signInWithPassword: async (_: any) => ({ data: { session: null }, error: { message: 'Supabase not configured' } }),
  signUp: async (_: any) => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
  signOut: async () => ({ error: null }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
}

const noopClient = {
  auth: noopAuth,
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
  }),
}

export const supabase = noopClient as any
export const supabaseAdmin = noopClient as any
export type SupabaseClient = typeof supabase
