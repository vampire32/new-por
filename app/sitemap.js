import { getPublishedProjects } from "@/lib/data";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const projects = await getPublishedProjects();
  return [
    { url: base },
    { url: `${base}/work` },
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}` })),
  ];
}
