import Image from "next/image";

// Cover image inside a browser frame; without an image, a quiet UI sketch stands in for a screenshot.
export default function ProjectCover({ project, priority = false }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_24px_48px_-28px_rgb(28_37_51/0.25)]">
      <div className="flex items-center gap-2 border-b border-line bg-bg px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="ml-3 truncate rounded bg-surface px-2 py-0.5 text-xs text-muted">{project.slug}</span>
      </div>
      {project.cover_url ? (
        <Image src={project.cover_url} alt="" width={1400} height={875} priority={priority}
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
      ) : (
        <div aria-hidden className="grid aspect-[16/10] grid-cols-[22%_1fr] gap-4 bg-surface p-5">
          <div className="space-y-2.5 rounded-lg bg-bg p-3">
            <div className="h-2.5 w-3/4 rounded bg-accent/70" />
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-2 rounded bg-surface-2" />)}
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-serif text-xl leading-tight text-ink/80 md:text-2xl">{project.title}</p>
            <div className="grid flex-1 grid-cols-3 gap-3">
              <div className="rounded-lg bg-accent-tint" />
              <div className="rounded-lg bg-bg" />
              <div className="rounded-lg bg-bg" />
              <div className="col-span-2 rounded-lg bg-bg" />
              <div className="rounded-lg bg-accent/15" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
