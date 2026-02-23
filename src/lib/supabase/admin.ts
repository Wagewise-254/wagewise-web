// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

export const createSupabaseAdmin = async () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use the SERVICE role key, not the ANON key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}