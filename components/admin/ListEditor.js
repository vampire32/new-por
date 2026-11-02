import Link from "next/link";
import { saveItem } from "@/app/admin/actions";
import AdminForm from "./AdminForm";
import ListRow from "./ListRow";
import PageHeader from "./PageHeader";

// List + add/edit form page used by experience, services and testimonials. Editing uses ?edit=<id>.
export default function ListEditor({ table, title, description, items, editId, basePath, rowTitle, rowSubtitle, empty, renderFields }) {
  const editing = items.find((i) => i.id === editId) ?? null;

  return (
    <div className="max-w-4xl">
      <PageHeader title={title} description={description} />
      {items.length ? (
        <ul className="rounded-2xl border border-line bg-surface px-5">
          {items.map((item, i) => (
            <ListRow key={item.id} table={table} item={item} title={rowTitle(item)} subtitle={rowSubtitle?.(item)}
              editHref={`${basePath}?edit=${item.id}`} first={i === 0} last={i === items.length - 1} />
          ))}
        </ul>
      ) : (
        <p className="text-muted">{empty}</p>
      )}

      <section className="mt-10 rounded-2xl border border-line bg-surface p-6" id="editor">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl">{editing ? `Edit ${rowTitle(editing)}` : "Add new"}</h2>
          {editing && <Link href={basePath} className="text-sm text-muted hover:text-ink">Cancel</Link>}
        </div>
        <AdminForm key={editing?.id ?? "new"} action={saveItem.bind(null, table)} submitLabel={editing ? "Save changes" : "Add"} resetOnSuccess={!editing}>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          {renderFields(editing ?? {})}
        </AdminForm>
      </section>
    </div>
  );
}
