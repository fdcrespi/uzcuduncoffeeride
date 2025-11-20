import { createClient } from '@supabase/supabase-js'

// Server-side client with service role to bypass RLS on Storage operations
// Ensure SUPABASE_SERVICE_ROLE_KEY is set in the environment.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)