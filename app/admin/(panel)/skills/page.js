import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { deleteItem, moveItem, saveItem } from "@/app/admin/actions";
import AdminForm from "@/components/admin/AdminForm";
import ListRow from "@/components/admin/ListRow";
import PageHeader from "@/components/admin/PageHeader";
import PendingButton from "@/components/admin/PendingButton";
import { requireAdmin } from "@/lib/auth";
import { techLogo } from "@/lib/tech-logos";

const input = "min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 focus:border-accent focus:outline-none";
const chipBtn = "flex size-6 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-ink disabled:opacity-30";

// Same logo the public stack strip will show, so the admin can see a name was recognised.
function TechMark({ name }) {
  const logo = techLogo(name);
  if (!logo) return <span className="size-4 rounded-full bg-surface-2" title="No logo found for this name" />;
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill={logo.color} aria-hidden>
      <path d={logo.path} />
    </svg>
  );
}

// Per-request admin page (auth cookies); allowed to block on navigation.
export const instant = false;

export default async function SkillsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("skill_categories")
    .select("id, name, sort_order, skills(id, name, sort_order)")
    .order("sort_order");
  const groups = (data ?? []).map((g) => ({ ...g, skills: g.skills.sort((a, b) => a.sort_order - b.sort_order) }));

  return (
    <div className="max-w-4xl">
      <PageHeader title="Skills" description="Grouped by category. Categories with no skills are hidden on the site." />

      <div className="space-y-6">
        {groups.map((g, gi) => (
          <section key={g.id} className="rounded-2xl border border-line bg-surface px-5">
            <ul>
              <ListRow table="skill_categories" item={g} title={g.name} first={gi === 0} last={gi === groups.length - 1} />
            </ul>
            <ul className="flex flex-wrap gap-2 py-4" aria-label={`${g.name} skills`}>
              {g.skills.map((s, si) => (
                <li key={s.id} className="flex items-center gap-1 rounded-full border border-line bg-bg py-1 pl-2.5 pr-1 text-sm">
                  <TechMark name={s.name} />
                  <span className="ml-1 mr-1">{s.name}</span>
                  <form action={moveItem.bind(null, "skills", s.id, "up")}>
                    <PendingButton className={chipBtn} disabled={si === 0} aria-label={`Move ${s.name} left`}><ChevronLeft className="size-3.5" /></PendingButton>
                  </form>
                  <form action={moveItem.bind(null, "skills", s.id, "down")}>
                    <PendingButton className={chipBtn} disabled={si === g.skills.length - 1} aria-label={`Move ${s.name} right`}><ChevronRight className="size-3.5" /></PendingButton>
                  </form>
                  <form action={deleteItem.bind(null, "skills", s.id)}>
                    <PendingButton confirm={`Remove ${s.name}?`} className={`${chipBtn} hover:text-red-700`} aria-label={`Remove ${s.name}`}>
                      <X className="size-3.5" />
                    </PendingButton>
                  </form>
                </li>
              ))}
            </ul>
            <AdminForm action={saveItem.bind(null, "skills")} submitLabel="Add skill" resetOnSuccess className="flex flex-wrap items-end gap-3 space-y-0 pb-5">
              <input type="hidden" name="category_id" value={g.id} />
              <input name="name" required placeholder={`New ${g.name} skill`} aria-label={`New ${g.name} skill`} className={input} />
            </AdminForm>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-line bg-surface p-6">
        <h2 className="mb-4 font-serif text-2xl">Add category</h2>
        <AdminForm action={saveItem.bind(null, "skill_categories")} submitLabel="Add category" resetOnSuccess className="flex flex-wrap items-end gap-3 space-y-0">
          <input name="name" required placeholder="e.g. Mobile" aria-label="Category name" className={input} />
        </AdminForm>
      </section>
    </div>
  );
}
