"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { FIELDS, parseForm } from "@/lib/admin-fields";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/data";
import { slugify } from "@/lib/validation";

// Public pages read cached content; admin pages are dynamic but the client router must re-fetch them after an action.
function changed() {
  updateTag(CONTENT_TAG);
  refresh();
}

// shortcut: uploads pass through server actions (Vercel 4.5 MB body cap); upload straight from the browser to Storage if bigger files are needed.
const MAX_UPLOAD = 4 * 1024 * 1024;
// Reorderable lists and the column that scopes their order.
const ORDERED = {
  projects: null, experience: null, skill_categories: null, services: null, testimonials: null,
  skills: "category_id", project_images: "project_id",
};

async function uploadFile(supabase, file, folder) {
  const isPdf = file.type === "application/pdf";
  if (file.size > MAX_UPLOAD) throw new Error("Files must be 4 MB or smaller.");
  if (!file.type.startsWith("image/") && !(isPdf && folder === "cv_url")) {
    throw new Error(folder === "cv_url" ? "Upload the CV as a PDF." : "Upload a JPG, PNG, WebP or GIF image.");
  }
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

async function nextSortOrder(supabase, table, scope) {
  let query = supabase.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (scope) query = query.eq(scope.column, scope.value);
  const { data } = await query;
  return (data?.[0]?.sort_order ?? 0) + 1;
}

function friendly(error) {
  if (error.code === "23505") return "Another project already uses this URL slug.";
  return error.message;
}

export async function saveItem(table, prevState, formData) {
  const fields = FIELDS[table];
  if (!fields) return { ok: false, message: "Unknown section." };
  const { supabase } = await requireAdmin();

  const { values, uploads, missing } = parseForm(formData, fields);
  if (missing.length) return { ok: false, message: `Fill in: ${missing.join(", ").replaceAll("_", " ")}.` };

  try {
    for (const { name, file } of uploads) values[name] = await uploadFile(supabase, file, name);
  } catch (e) {
    return { ok: false, message: e.message };
  }

  if (table === "projects") values.slug = slugify(values.slug || values.title);
  if (table === "experience" && formData.get("current")) values.end_date = null;

  const id = table === "profile" ? 1 : formData.get("id") || null;
  let result;
  if (table === "profile") {
    result = await supabase.from("profile").upsert({ id: 1, ...values }).select("id").single();
  } else if (id) {
    result = await supabase.from(table).update(values).eq("id", id).select("id").single();
  } else {
    const scopeCol = ORDERED[table];
    const scope = scopeCol ? { column: scopeCol, value: values[scopeCol] } : null;
    values.sort_order = await nextSortOrder(supabase, table, scope);
    result = await supabase.from(table).insert(values).select("id").single();
  }
  if (result.error) return { ok: false, message: friendly(result.error) };

  changed();
  if (table === "projects" && !id) redirect(`/admin/projects/${result.data.id}?saved=1`);
  return { ok: true, message: "Saved.", at: Date.now() };
}

export async function deleteItem(table, id) {
  if (!(table in ORDERED) && table !== "messages") return;
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  changed();
}

export async function deleteProject(id) {
  await deleteItem("projects", id);
  redirect("/admin/projects");
}

export async function moveItem(table, id, direction) {
  if (!(table in ORDERED)) return;
  const { supabase } = await requireAdmin();
  // One atomic swap in Postgres (supabase/migrations/0003_move_item.sql) instead of four round trips.
  const { error } = await supabase.rpc("move_item", { tbl: table, item_id: id, direction });
  if (error) throw new Error(error.message);
  changed();
}

export async function addProjectImages(projectId, prevState, formData) {
  const { supabase } = await requireAdmin();
  const files = formData.getAll("images").filter((f) => typeof f === "object" && f.size > 0);
  if (!files.length) return { ok: false, message: "Choose at least one image." };

  let order = await nextSortOrder(supabase, "project_images", { column: "project_id", value: projectId });
  try {
    for (const file of files) {
      const url = await uploadFile(supabase, file, "project_images");
      const { error } = await supabase.from("project_images").insert({ project_id: projectId, url, sort_order: order++ });
      if (error) throw new Error(error.message);
    }
  } catch (e) {
    return { ok: false, message: e.message };
  }
  changed();
  return { ok: true, message: `${files.length === 1 ? "Image" : "Images"} added.`, at: Date.now() };
}

export async function saveImageAlt(id, formData) {
  const { supabase } = await requireAdmin();
  await supabase.from("project_images").update({ alt: String(formData.get("alt") ?? "").trim() || null }).eq("id", id);
  changed();
}

export async function setMessageRead(id, read) {
  const { supabase } = await requireAdmin();
  await supabase.from("messages").update({ read }).eq("id", id);
  refresh();
}

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
