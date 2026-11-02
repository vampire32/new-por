import { ArrowRight, ArrowUpRight, CircleCheck, CircleDot } from "lucide-react";
import Link from "next/link";
import { TechList } from "./ProjectCard";
import ProjectCover from "./ProjectCover";
import Reveal from "./Reveal";

function FeaturedRow({ project, flip }) {
  return (
    <article className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <Reveal className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Link href={`/work/${project.slug}`} tabIndex={-1} aria-hidden className="relative block">
          <ProjectCover project={project} />
          <span className="absolute right-4 top-14 flex size-11 scale-90 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <ArrowUpRight className="size-5" />
          </span>
        </Link>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-5">
        <p className="text-sm text-muted">{[project.role, project.year].filter(Boolean).join(", ")}</p>
        <h3 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">
          <Link href={`/work/${project.slug}`} className="transition-colors hover:text-accent">{project.title}</Link>
        </h3>
        {project.summary && <p className="mt-4 text-lg leading-relaxed text-muted">{project.summary}</p>}
        {(project.problem || project.outcome) && (
          <dl className="mt-6 space-y-4 rounded-xl border border-line bg-surface p-5">
            {project.problem && (
              <div className="flex gap-3">
                <CircleDot className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
                <div>
                  <dt className="text-sm font-medium">The problem</dt>
                  <dd className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{project.problem}</dd>
                </div>
              </div>
            )}
            {project.outcome && (
              <div className="flex gap-3">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <div>
                  <dt className="text-sm font-medium">The result</dt>
                  <dd className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink">{project.outcome}</dd>
                </div>
              </div>
            )}
          </dl>
        )}
        <div className="mt-6"><TechList tech={project.tech} /></div>
        <Link href={`/work/${project.slug}`} className="group/link mt-7 inline-flex items-center gap-2 font-medium text-accent">
          Read the case study
          <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-1" aria-hidden />
        </Link>
      </Reveal>
    </article>
  );
}

export default function WorkList({ projects }) {
  return (
    <section id="work" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
          <div>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">Selected work</h2>
            <p className="mt-3 max-w-lg text-muted">A few projects I&apos;m proud of, with the problem behind each one and what changed after.</p>
          </div>
          <Link href="/work" className="group inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2 font-medium transition-colors hover:border-ink">
            See all projects
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </Reveal>
        <div className="mt-16 space-y-24 md:space-y-32">
          {projects.map((p, i) => (
            <FeaturedRow key={p.id} project={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
