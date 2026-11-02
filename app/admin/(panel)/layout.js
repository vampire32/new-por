import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import PendingButton from "@/components/admin/PendingButton";
import { requireAdmin } from "@/lib/auth";

// Admin is always rendered per request (auth cookies), so navigations may block instead of showing a prefetched shell.
export const instant = false;

async function UnreadBadge() {
  const { supabase } = await requireAdmin();
  const { count } = await supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false);
  if (!count) return null;
  return (
    <span className="ml-auto rounded-full bg-accent-tint px-2 py-0.5 text-xs font-semibold text-accent">
      {count}
      <span className="sr-only"> unread</span>
    </span>
  );
}

async function SignedInAs() {
  const { user } = await requireAdmin();
  return <p className="truncate text-xs text-muted">{user.email}</p>;
}

export default function PanelLayout({ children }) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="border-b border-line bg-surface md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex h-full flex-col gap-6 p-4 md:sticky md:top-0 md:h-screen md:p-5">
          <Link href="/admin" className="flex items-center gap-3 px-1">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent font-serif text-lg text-white">A</span>
            <span>
              <span className="block font-serif text-lg leading-tight">Admin</span>
              <span className="block text-xs text-muted">Portfolio content</span>
            </span>
          </Link>
          <AdminNav badge={<Suspense fallback={null}><UnreadBadge /></Suspense>} />
          <div className="mt-auto space-y-1 border-t border-line pt-4 text-sm">
            <Suspense fallback={null}><div className="px-3 pb-2"><SignedInAs /></div></Suspense>
            <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted hover:bg-bg hover:text-ink">
              <ExternalLink className="size-4" aria-hidden />
              View site
            </Link>
            <form action={signOut}>
              <PendingButton className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted hover:bg-bg hover:text-ink">
                <LogOut className="size-4" aria-hidden />
                Sign out
              </PendingButton>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-10 md:px-12">
        <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded-lg bg-surface-2" />}>{children}</Suspense>
      </main>
    </div>
  );
}
