import { saveItem } from "@/app/admin/actions";
import AdminForm from "@/components/admin/AdminForm";
import Field from "@/components/admin/Field";
import FileInput from "@/components/admin/FileInput";
import PageHeader from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";

function Group({ title, children }) {
  return (
    <fieldset className="space-y-5 rounded-2xl border border-line bg-surface p-6">
      <legend className="px-1 font-serif text-xl">{title}</legend>
      {children}
    </fieldset>
  );
}

// Per-request admin page (auth cookies); allowed to block on navigation.
export const instant = false;

export default async function ProfilePage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();
  const p = data ?? {};

  return (
    <div className="max-w-3xl">
      <PageHeader title="Profile" description="Your name, intro and links. Shown in the hero, About, Contact and footer." />
      <AdminForm action={saveItem.bind(null, "profile")}>
        <Group title="Hero">
          <Field label="Name" name="name" defaultValue={p.name} />
          <Field label="Headline" name="headline" defaultValue={p.headline} hint="The big line at the top of the home page." />
          <Field label="Intro" name="intro" rows={3} defaultValue={p.intro} />
          <Field label="Projects delivered" name="projects_delivered" type="number" defaultValue={p.projects_delivered}
            hint="Your total, shown as a stat on the home page. Leave empty to count published projects instead." />
          <Field label="Open to new projects" name="available" type="checkbox" defaultValue={p.available}
            hint="Shows the availability badge in the hero." />
          <FileInput label="Photo" name="photo_url" current={p.photo_url} hint="Portrait works best (4:5). Max 4 MB per save." />
          <FileInput label="CV" name="cv_url" current={p.cv_url} accept="application/pdf" hint="PDF, max 4 MB. Adds a Download CV link." />
        </Group>
        <Group title="About">
          <Field label="About text" name="about" rows={8} defaultValue={p.about} hint="Leave a blank line between paragraphs." />
          <FileInput label="About image" name="about_image_url" current={p.about_image_url} hint="Optional. Landscape (3:2)." />
        </Group>
        <Group title="Contact and links">
          <Field label="Email" name="email" type="email" defaultValue={p.email} />
          <Field label="Location" name="location" defaultValue={p.location} placeholder="Remote" />
          <Field label="GitHub URL" name="github_url" type="url" defaultValue={p.github_url} />
          <Field label="LinkedIn URL" name="linkedin_url" type="url" defaultValue={p.linkedin_url} />
          <Field label="X URL" name="x_url" type="url" defaultValue={p.x_url} />
        </Group>
        <Group title="Search and sharing">
          <Field label="Page title" name="seo_title" defaultValue={p.seo_title} hint="Shown in browser tabs and Google." />
          <Field label="Description" name="seo_description" rows={2} defaultValue={p.seo_description} />
        </Group>
      </AdminForm>
    </div>
  );
}
