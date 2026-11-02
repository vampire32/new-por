import { Briefcase, Calendar, Route } from "lucide-react";
import Reveal from "./Reveal";
import Section from "./Section";

const monthYear = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });

function formatDate(date) {
  return date ? monthYear.format(new Date(date)) : null;
}

export default function Experience({ items }) {
  return (
    <Section id="experience" title="Experience" intro="Where I've worked and what I did there." icon={Route}>
      <ol className="relative space-y-6 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-px before:bg-line">
        {items.map((job, i) => (
          <Reveal as="li" key={job.id} delay={i * 80} className="relative flex gap-5">
            <span className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border ${job.end_date ? "border-line bg-surface text-muted" : "border-accent bg-accent text-white"}`}>
              <Briefcase className="size-4" aria-hidden />
            </span>
            <div className="flex-1 rounded-xl border border-line bg-surface p-6 transition-shadow hover:shadow-[0_20px_40px_-28px_rgb(28_37_51/0.35)]">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-medium">
                  {job.role} <span className="text-muted">at {job.company}</span>
                </h3>
                <p className="inline-flex items-center gap-1.5 text-sm text-muted">
                  <Calendar className="size-3.5" aria-hidden />
                  {formatDate(job.start_date)} to {formatDate(job.end_date) ?? "Present"}
                </p>
              </div>
              {job.description && <p className="mt-3 leading-relaxed text-muted">{job.description}</p>}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
