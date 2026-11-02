import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Paragraphs from "@/components/site/Paragraphs";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  // Cache Components needs at least one param to prerender; unknown slugs still 404 at runtime.
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, ...(project.cover_url && { images: [project.cover_url] }) },
  };
}

function Block({ title, text }) {
  if (!text?.trim()) return null;
  return (
    <div className="grid gap-4 border-t border-line py-10 md:grid-cols-12">
      <h2 className="font-serif text-2xl tracking-tight md:col-span-4">{title}</h2>
      <Paragraphs text={text} className="text-lg leading-relaxed text-ink/85 md:col-span-8" />
    </div>
  );
}

export default async function ProjectPage({ params }) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();

  const meta = [
    project.role && { label: "Role", value: project.role },
    project.year && { label: "Year", value: project.year },
    project.tech?.length && { label: "Stack", value: project.tech.join(", ") },
  ].filter(Boolean);

  return (
    <article className="mx-auto max-w-6xl px-5 pb-28 pt-12 md:px-8 md:pt-16">
      <Link href="/work" className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
        All work
      </Link>
      <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight text-balance md:text-6xl">{project.title}</h1>
      {project.summary && <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{project.summary}</p>}

      <div className="mt-10 flex flex-wrap items-start gap-x-12 gap-y-6">
        {meta.length > 0 && (
          <dl className="flex flex-wrap gap-x-12 gap-y-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-sm text-muted">{m.label}</dt>
                <dd className="mt-1 font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="flex gap-6 md:ml-auto">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener" className="rounded-md bg-accent px-5 py-2.5 font-medium text-white transition-colors hover:bg-ink">
              Live site
            </a>
          )}
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noopener" className="rounded-md border border-line px-5 py-2.5 font-medium transition-colors hover:border-ink">
              Source code
            </a>
          )}
        </div>
      </div>

      {project.cover_url && (
        <Image src={project.cover_url} alt={`${project.title} screenshot`} width={1600} height={1000} priority
          className="mt-14 w-full rounded-lg border border-line bg-surface-2" />
      )}

      <div className="mt-16">
        <Block title="The problem" text={project.problem} />
        <Block title="What I built" text={project.built} />
        <Block title="Outcome" text={project.outcome} />
      </div>

      {project.images.length > 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {project.images.map((img) => (
            <Image key={img.id} src={img.url} alt={img.alt || `${project.title} screenshot`} width={1200} height={800}
              className="w-full rounded-lg border border-line bg-surface-2" />
          ))}
        </div>
      )}
    </article>
  );
}
