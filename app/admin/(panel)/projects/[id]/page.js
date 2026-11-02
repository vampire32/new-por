import Link from "next/link";
import { notFound } from "next/navigation";
import { addProjectImages, deleteItem, deleteProject, moveItem, saveImageAlt, saveItem } from "@/app/admin/actions";
import AdminForm from "@/components/admin/AdminForm";
import PendingButton from "@/components/admin/PendingButton";
import Field from "@/components/admin/Field";
import FileInput from "@/components/admin/FileInput";
import PageHeader from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";

const btn = "rounded-md border border-line px-2.5 py-1 text-sm hover:border-ink disabled:opacity-40";

// Per-request admin page (auth cookies); allowed to block on navigation.
export const instant = false;

export default async function ProjectEditPage({ params }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const isNew = id === "new";

  let p = { published: false, featured: false, tech: [] };
  let images = [];
  if (!isNew) {
    const { data } = await supabase.from("projects").select("*, images:project_images(*)").eq("id", id).maybeSingle();
    if (!data) notFound();
    p = data;
    images = data.images.sort((a, b) => a.sort_order - b.sort_order);
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="text-sm text-muted hover:text-ink">All projects</Link>
      <PageHeader title={isNew ? "New project" : p.title}>
        {!isNew && p.published && (
          <Link href={`/work/${p.slug}`} target="_blank" className="text-sm text-accent underline">View on site</Link>
        )}
      </PageHeader>

      <AdminForm action={saveItem.bind(null, "projects")} submitLabel={isNew ? "Create project" : "Save changes"}
        className="rounded-2xl border border-line bg-surface p-6">
        {!isNew && <input type="hidden" name="id" value={p.id} />}
        <Field label="Title" name="title" required defaultValue={p.title} />
        <Field label="URL slug" name="slug" defaultValue={p.slug} hint="Leave empty to make one from the title." />
        <Field label="One-line summary" name="summary" defaultValue={p.summary} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your role" name="role" defaultValue={p.role} />
          <Field label="Year" name="year" type="number" defaultValue={p.year} />
        </div>
        <Field label="Tech stack" name="tech" defaultValue={p.tech?.join(", ")} hint="Comma separated, e.g. Next.js, Node.js, PostgreSQL" />
        <Field label="The problem" name="problem" rows={4} defaultValue={p.problem} />
        <Field label="What I built" name="built" rows={5} defaultValue={p.built} />
        <Field label="Outcome" name="outcome" rows={3} defaultValue={p.outcome} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Live URL" name="live_url" type="url" defaultValue={p.live_url} />
          <Field label="Source code URL" name="repo_url" type="url" defaultValue={p.repo_url} />
        </div>
        <FileInput label="Cover image" name="cover_url" current={p.cover_url} hint="Landscape (16:10) screenshot. Max 4 MB." />
        <Field label="Published" name="published" type="checkbox" defaultValue={p.published} hint="Visible on /work and its own page." />
        <Field label="Featured" name="featured" type="checkbox" defaultValue={p.featured} hint="Also shown on the home page (needs Published)." />
      </AdminForm>

      {!isNew && (
        <>
          <section className="mt-10 rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-serif text-2xl">Gallery</h2>
            <p className="mt-1 text-sm text-muted">Extra screenshots shown at the bottom of the case study.</p>
            {images.length > 0 && (
              <ul className="mt-6 space-y-4">
                {images.map((img, i) => (
                  <li key={img.id} className="flex flex-wrap items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
                    <img src={img.url} alt="" className="h-16 w-24 rounded-md border border-line object-cover" />
                    <form action={saveImageAlt.bind(null, img.id)} className="flex flex-1 gap-2">
                      <input name="alt" defaultValue={img.alt ?? ""} placeholder="Describe the image"
                        aria-label="Image description" className="min-w-0 flex-1 rounded-md border border-line px-3 py-1.5 text-sm" />
                      <PendingButton className={btn}>Save</PendingButton>
                    </form>
                    <form action={moveItem.bind(null, "project_images", img.id, "up")}>
                      <PendingButton className={btn} disabled={i === 0} aria-label="Move image up">↑</PendingButton>
                    </form>
                    <form action={moveItem.bind(null, "project_images", img.id, "down")}>
                      <PendingButton className={btn} disabled={i === images.length - 1} aria-label="Move image down">↓</PendingButton>
                    </form>
                    <form action={deleteItem.bind(null, "project_images", img.id)}>
                      <PendingButton confirm="Delete this image?" className={`${btn} text-red-700`}>Delete</PendingButton>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <AdminForm action={addProjectImages.bind(null, p.id)} submitLabel="Add images" resetOnSuccess className="mt-6">
              <input name="images" type="file" accept="image/*" multiple aria-label="Gallery images"
                className="text-sm file:mr-3 file:rounded-md file:border file:border-line file:bg-surface file:px-3 file:py-1.5" />
            </AdminForm>
          </section>

          <form action={deleteProject.bind(null, p.id)} className="mt-10">
            <PendingButton confirm={`Delete "${p.title}" and its images? This can't be undone.`}
              className="text-sm text-red-700 underline">
              Delete this project
            </PendingButton>
          </form>
        </>
      )}
    </div>
  );
}
