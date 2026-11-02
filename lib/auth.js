import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { createClient } from "./supabase/server";

// One auth check per request, shared by the layout's unread badge and the page.
const checkAdmin = cache(async () => {
  // Admin is always per-request; Supabase auth reads the clock, which Cache Components forbids during prerender.
  await connection();
  const supabase = await createClient();
  // getClaims verifies the JWT locally when the project uses asymmetric signing keys (no network round trip).
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { supabase, user: null, isAdmin: false };
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return { supabase, user: { id: data.claims.sub, email: data.claims.email }, isAdmin: Boolean(isAdmin) };
});

// Every admin page and server action calls this first; the proxy alone is not enough.
export async function requireAdmin() {
  const { supabase, user, isAdmin } = await checkAdmin();
  if (!user) redirect("/admin/login");
  // Signed in is not enough: the user must be listed in `admins` (same check RLS uses).
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?denied=1");
  }
  return { supabase, user };
}
