import Field from "@/components/admin/Field";
import FileInput from "@/components/admin/FileInput";
import ListEditor from "@/components/admin/ListEditor";
import { requireAdmin } from "@/lib/auth";

// Per-request admin page (auth cookies); allowed to block on navigation.
export const instant = false;

export default async function TestimonialsPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const { edit } = await searchParams;
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");

  return (
    <ListEditor
      table="testimonials"
      title="Testimonials"
      description="Quotes from clients and colleagues."
      items={data ?? []}
      editId={edit}
      basePath="/admin/testimonials"
      rowTitle={(x) => x.name}
      rowSubtitle={(x) => x.quote}
      empty="No testimonials yet. The section is hidden on the site until you add one."
      renderFields={(x) => (
        <>
          <Field label="Quote" name="quote" rows={4} required defaultValue={x.quote} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" name="name" required defaultValue={x.name} />
            <Field label="Role and company" name="role" defaultValue={x.role} placeholder="CTO, Example Ltd" />
          </div>
          <FileInput label="Photo" name="avatar_url" current={x.avatar_url} hint="Optional. Square works best." />
        </>
      )}
    />
  );
}
