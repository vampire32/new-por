import { createClient } from "@supabase/supabase-js";

// Cookie-less anon client: safe inside 'use cache' and always sees only public rows (RLS).
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
