// Editable columns per table and how to read them from a form.
// Types: text | int | bool | date | tags (comma list → text[]) | file (uploaded to storage, stored as URL).
export const FIELDS = {
  profile: {
    name: "text", headline: "text", intro: "text", about: "text", email: "text", location: "text",
    github_url: "text", linkedin_url: "text", x_url: "text", available: "bool",
    seo_title: "text", seo_description: "text",
    photo_url: "file", about_image_url: "file", cv_url: "file",
  },
  projects: {
    title: "text!", slug: "text", summary: "text", role: "text", year: "int", tech: "tags",
    problem: "text", built: "text", outcome: "text", live_url: "text", repo_url: "text",
    featured: "bool", published: "bool", cover_url: "file",
  },
  experience: { role: "text!", company: "text!", start_date: "date", end_date: "date", description: "text" },
  skill_categories: { name: "text!" },
  skills: { name: "text!", category_id: "text!" },
  services: { title: "text!", description: "text" },
  testimonials: { quote: "text!", name: "text!", role: "text", avatar_url: "file" },
};

export function parseForm(formData, fields) {
  const values = {};
  const uploads = [];
  const missing = [];

  for (const [name, spec] of Object.entries(fields)) {
    const type = spec.replace("!", "");
    const raw = formData.get(name);

    if (type === "file") {
      if (raw && typeof raw === "object" && raw.size > 0) uploads.push({ name, file: raw });
      else if (formData.get(`${name}__remove`)) values[name] = null;
      continue;
    }
    if (type === "bool") {
      values[name] = formData.get(name) != null;
      continue;
    }

    const text = typeof raw === "string" ? raw.trim() : "";
    if (type === "int") {
      const n = Number.parseInt(text, 10);
      values[name] = Number.isFinite(n) ? n : null;
    } else if (type === "tags") {
      values[name] = text.split(",").map((t) => t.trim()).filter(Boolean);
    } else {
      values[name] = text || null;
    }
    if (spec.endsWith("!") && values[name] == null) missing.push(name);
  }

  return { values, uploads, missing };
}
