import ProjectCard from "@/components/site/ProjectCard";
import { getPublishedProjects } from "@/lib/data";

export const metadata = {
  title: "Work",
  description: "Projects and case studies.",
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-16 md:px-8 md:pt-24">
      <h1 className="font-serif text-5xl tracking-tight md:text-6xl">Work</h1>
      <p className="mt-5 max-w-xl text-lg text-muted">
        Products, tools and APIs I&apos;ve built, with the problem behind each one and what changed after.
      </p>
      {projects.length > 0 ? (
        <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-muted">Projects are on their way.</p>
      )}
    </div>
  );
}
