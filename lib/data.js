import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";

// Every public read is cached under one tag; admin actions call updateTag(CONTENT_TAG).
export const CONTENT_TAG = "content";

function unwrap({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

async function list(table, filter) {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  let query = createPublicClient().from(table).select("*").order("sort_order");
  if (filter === "featured") query = query.eq("published", true).eq("featured", true);
  if (filter === "published") query = query.eq("published", true);
  return unwrap(await query) ?? [];
}

export async function getProfile() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  return unwrap(await createPublicClient().from("profile").select("*").eq("id", 1).maybeSingle());
}

export const getFeaturedProjects = () => list("projects", "featured");
export const getPublishedProjects = () => list("projects", "published");
export const getExperience = () => list("experience");
export const getServices = () => list("services");
export const getTestimonials = () => list("testimonials");

export async function getProjectBySlug(slug) {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  const project = unwrap(
    await createPublicClient()
      .from("projects")
      .select("*, images:project_images(*)")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
  );
  if (project) project.images.sort((a, b) => a.sort_order - b.sort_order);
  return project;
}

export async function getSkillGroups() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  const groups = unwrap(
    await createPublicClient().from("skill_categories").select("id, name, skills(id, name, sort_order)").order("sort_order")
  ) ?? [];
  groups.forEach((g) => g.skills.sort((a, b) => a.sort_order - b.sort_order));
  return groups;
}

export async function getHomeData() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  const [profile, featured, published, experience, skillGroups, services, testimonials] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getPublishedProjects(),
    getExperience(),
    getSkillGroups(),
    getServices(),
    getTestimonials(),
  ]);

  // Computed inside the cache so reading the clock is allowed under Cache Components.
  const starts = experience.map((e) => e.start_date).filter(Boolean).sort();
  // UTC: date-only strings parse as UTC midnight, so a local getFullYear() can land on the previous year.
  const years = starts.length ? new Date().getUTCFullYear() - new Date(starts[0]).getUTCFullYear() : 0;
  // The owner's own total (e.g. 200+ client projects) beats counting only the case studies on the site.
  const stats = { years, projects: profile?.projects_delivered || published.length };

  return { profile, featured, experience, skillGroups, services, testimonials, stats };
}
