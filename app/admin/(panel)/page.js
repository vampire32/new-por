import { ArrowRight, Briefcase, FolderKanban, Inbox, MessageSquareQuote, Plus, Rocket, UserRound, Wrench } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";

// Per-request admin page (auth cookies); allowed to block on navigation.
export const instant = false;

const when = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const count = (table, filter) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) q = filter(q);
    return q.then((r) => r.count ?? 0);
  };
  const [projects, published, unread, experience, skills, services, testimonials, latest] = await Promise.all([
    count("projects"),
    count("projects", (q) => q.eq("published", true)),
    count("messages", (q) => q.eq("read", false)),
    count("experience"),
    count("skills"),
    count("services"),
    count("testimonials"),
    supabase.from("messages").select("id, name, body, created_at, read").order("created_at", { ascending: false }).limit(4).then((r) => r.data ?? []),
  ]);

  const stats = [
    { label: "Projects", value: projects, hint: `${published} published`, href: "/admin/projects", icon: FolderKanban },
    { label: "Unread messages", value: unread, hint: "From the contact form", href: "/admin/messages", icon: Inbox },
    { label: "Skills", value: skills, hint: "Shown in the stack strip", href: "/admin/skills", icon: Wrench },
    { label: "Testimonials", value: testimonials, hint: testimonials ? "Visible on the site" : "Section hidden until you add one", href: "/admin/testimonials", icon: MessageSquareQuote },
  ];
  const sections = [
    { label: "Profile", text: "Name, headline, photo, CV, links", href: "/admin/profile", icon: UserRound },
    { label: "Experience", text: `${experience} roles`, href: "/admin/experience", icon: Briefcase },
    { label: "Services", text: `${services} services`, href: "/admin/services", icon: Rocket },
  ];

  return (
    <div className="max-w-5xl">
      <PageHeader title="Overview" description="Everything on your portfolio, in one place. Changes show on the site as soon as you save.">
        <Link href="/admin/projects/new" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-medium text-white shadow-sm hover:bg-ink">
          <Plus className="size-4" aria-hidden />
          New project
        </Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_20px_40px_-28px_rgb(28_37_51/0.4)]">
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent-tint text-accent transition-colors group-hover:bg-accent group-hover:text-white">
              <s.icon className="size-5" aria-hidden />
            </span>
            <p className="mt-5 font-serif text-4xl leading-none">{s.value}</p>
            <p className="mt-2 font-medium">{s.label}</p>
            <p className="mt-0.5 text-sm text-muted">{s.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <section className="rounded-2xl border border-line bg-surface p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Latest messages</h2>
            <Link href="/admin/messages" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              All messages <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {latest.length ? (
            <ul className="mt-4 divide-y divide-line">
              {latest.map((m) => (
                <li key={m.id} className="flex items-start gap-3 py-3">
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${m.read ? "bg-line" : "bg-accent"}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className={m.read ? "" : "font-semibold"}>{m.name}{!m.read && <span className="sr-only"> (unread)</span>}</p>
                    <p className="truncate text-sm text-muted">{m.body}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{when.format(new Date(m.created_at))}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-muted">No messages yet.</p>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface p-6 lg:col-span-2">
          <h2 className="font-serif text-2xl">Edit sections</h2>
          <ul className="mt-4 space-y-2">
            {sections.map((s) => (
              <li key={s.label}>
                <Link href={s.href} className="group flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:border-accent/40">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-bg text-accent"><s.icon className="size-4" aria-hidden /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{s.label}</span>
                    <span className="block truncate text-sm text-muted">{s.text}</span>
                  </span>
                  <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
