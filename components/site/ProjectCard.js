import Link from "next/link";
import ProjectCover from "./ProjectCover";

export function TechList({ tech }) {
  if (!tech?.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {tech.map((t) => (
        <li key={t} className="rounded-md bg-accent-tint px-2 py-0.5 text-xs font-medium text-accent">{t}</li>
      ))}
    </ul>
  );
}

export default function ProjectCard({ project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <ProjectCover project={project} />
      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-2xl tracking-tight transition-colors group-hover:text-accent">{project.title}</h3>
          {project.year && <span className="text-sm text-muted">{project.year}</span>}
        </div>
        {project.summary && <p className="mt-2 leading-relaxed text-muted">{project.summary}</p>}
        <div className="mt-4"><TechList tech={project.tech} /></div>
      </div>
    </Link>
  );
}
