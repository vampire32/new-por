import Field from "@/components/admin/Field";
import ListEditor from "@/components/admin/ListEditor";
import { requireAdmin } from "@/lib/auth";

// Per-request admin page (auth cookies); allowed to block on navigation.
export const instant = false;

export default async function ServicesPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const { edit } = await searchParams;
  const { data } = await supabase.from("services").select("*").order("sort_order");

  return (
    <ListEditor
      table="services"
      title="Services"
      description="What you offer clients."
      items={data ?? []}
      editId={edit}
      basePath="/admin/services"
      rowTitle={(x) => x.title}
      rowSubtitle={(x) => x.description}
      empty="No services yet. The section is hidden on the site until you add one."
      renderFields={(x) => (
        <>
          <Field label="Title" name="title" required defaultValue={x.title} />
          <Field label="Description" name="description" rows={3} defaultValue={x.description} />
        </>
      )}
    />
  );
}
