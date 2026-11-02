import Field from "@/components/admin/Field";
import ListEditor from "@/components/admin/ListEditor";
import { requireAdmin } from "@/lib/auth";

// Per-request admin page (auth cookies); allowed to block on navigation.
export const instant = false;

export default async function ExperiencePage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const { edit } = await searchParams;
  const { data } = await supabase.from("experience").select("*").order("sort_order");

  return (
    <ListEditor
      table="experience"
      title="Experience"
      description="Jobs and freelance work, newest first."
      items={data ?? []}
      editId={edit}
      basePath="/admin/experience"
      rowTitle={(x) => `${x.role} at ${x.company}`}
      rowSubtitle={(x) => `${x.start_date ?? "?"} to ${x.end_date ?? "Present"}`}
      empty="No experience yet. The section is hidden on the site until you add one."
      renderFields={(x) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Role" name="role" required defaultValue={x.role} />
            <Field label="Company" name="company" required defaultValue={x.company} />
            <Field label="Start date" name="start_date" type="date" defaultValue={x.start_date} />
            <Field label="End date" name="end_date" type="date" defaultValue={x.end_date} />
          </div>
          <Field label="I work here now" name="current" type="checkbox" defaultValue={x.id && !x.end_date} hint="Shows Present as the end date." />
          <Field label="Description" name="description" rows={3} defaultValue={x.description} />
        </>
      )}
    />
  );
}
