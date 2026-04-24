import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0

if (!isConfigured) {
  console.warn(
    '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Auth features will not work until these environment variables are set. ' +
    'Dev Bypass mode is available if NEXT_PUBLIC_ENABLE_DEV_BYPASS=true'
  )
}

// Create a real client only when properly configured.
// When unconfigured, export a "null client" shim so that auth-store
// can still import this module without crashing at module evaluation.
function createMaybeRealClient(): SupabaseClient {
  if (isConfigured) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  // Return a minimal no-op client using a fake project URL
  // This prevents createClient from throwing on empty string
  return createClient('https://none.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbmUiLCJpYXQiOjE2NDYzNjEwMTMsImV4cCI6MTk2MTkzNzAxM30.placeholder')
}

export const supabase = createMaybeRealClient()
export const IS_SUPABASE_CONFIGURED = isConfigured
