import { createPublicClient } from "@/lib/supabase/public";

// Called daily by Vercel Cron so the free Supabase project isn't paused for inactivity.
export async function GET(request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const { error } = await createPublicClient().from("profile").select("id").limit(1);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
