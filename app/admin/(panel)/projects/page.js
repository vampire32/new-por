import Link from "next/link";
import ListRow from "@/components/admin/ListRow";
import PageHeader from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";

function Badge({ children, tone }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone === "accent" ? "bg-accent-tint text-accent" : "bg-surface-2 text-muted"}`}>
      {children}
    </span>
  );
}

// Per-request admin page (auth cookies); allowed to block on navigation.
export const instant = false;

export default async function ProjectsPage() {
  const { supabase } = await requireAdmin();
  const { data: projects } = await supabase.from("projects").select("id, title, slug, featured, published").order("sort_order");

  return (
    <div className="max-w-4xl">
      <PageHeader title="Projects" description="Published projects appear on /work. Featured ones also appear on the home page.">
        <Link href="/admin/projects/new" className="rounded-md bg-accent px-4 py-2 font-medium text-white hover:bg-ink">
          New project
        </Link>
      </PageHeader>
      {projects?.length ? (
        <ul className="rounded-2xl border border-line bg-surface px-5">
          {projects.map((p, i) => (
            <ListRow key={p.id} table="projects" item={p} title={p.title} subtitle={`/work/${p.slug}`}
              editHref={`/admin/projects/${p.id}`} first={i === 0} last={i === projects.length - 1}>
              <div className="mt-2 flex gap-2">
                {p.published ? <Badge tone="accent">Published</Badge> : <Badge>Draft</Badge>}
                {p.featured && <Badge tone="accent">Featured</Badge>}
              </div>
            </ListRow>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No projects yet. Add your first one to show it on the site.</p>
      )}
    </div>
  );
}
