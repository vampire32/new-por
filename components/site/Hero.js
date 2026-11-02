import { ArrowRight, Briefcase, CodeXml, Download, FolderKanban, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CountUp from "./CountUp";
import HeroScene from "./HeroScene";

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "—";
}

function ProfileCard({ p, current }) {
  return (
    <div className="float w-72 rounded-2xl border border-line bg-surface/90 p-5 shadow-[0_30px_60px_-30px_rgb(28_37_51/0.35)] backdrop-blur-md">
      <div className="flex items-center gap-3.5">
        {p.photo_url ? (
          <Image src={p.photo_url} alt={p.name ? `Photo of ${p.name}` : ""} width={96} height={96} priority
            className="size-12 shrink-0 rounded-full object-cover ring-2 ring-accent-tint" />
        ) : (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent font-serif text-xl text-white">
            {initials(p.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium">{p.name}</p>
          {current && <p className="truncate text-sm text-muted">{current.role}</p>}
        </div>
      </div>
      <ul className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
        {current && (
          <li className="flex items-center gap-2.5 text-ink/80">
            <Briefcase className="size-4 text-accent" aria-hidden />
            <span className="truncate">{current.company}</span>
          </li>
        )}
        {p.location && (
          <li className="flex items-center gap-2.5 text-ink/80">
            <MapPin className="size-4 text-accent" aria-hidden />
            {p.location}
          </li>
        )}
        {p.email && (
          <li className="flex items-center gap-2.5 text-ink/80">
            <Mail className="size-4 text-accent" aria-hidden />
            <a href={`mailto:${p.email}`} className="truncate hover:text-accent">{p.email}</a>
          </li>
        )}
      </ul>
    </div>
  );
}

export default function Hero({ data }) {
  const p = data.profile ?? {};
  const current = data.experience.find((e) => !e.end_date) ?? data.experience[0];
  const stack = data.skillGroups.flatMap((g) => g.skills.map((s) => s.name));
  const facts = [
    data.stats.years > 0 && { icon: Briefcase, count: data.stats.years, suffix: "+", label: "Years building for the web" },
    data.stats.projects > 0 && { icon: FolderKanban, count: data.stats.projects, suffix: p.projects_delivered ? "+" : "", label: "Projects delivered for clients" },
    stack.length > 0 && { icon: CodeXml, count: stack.length, label: "Tools and technologies" },
    p.location && { icon: MapPin, text: p.location, label: "Working with clients worldwide" },
  ].filter(Boolean);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgb(42_74_127/0.12),transparent_65%)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-5 pt-10 md:px-8 lg:grid-cols-12 lg:pt-16">
        <div className="lg:col-span-6 lg:py-16">
          {p.available && (
            <p className="rise mb-8 inline-flex items-center gap-2.5 rounded-full border border-accent/15 bg-surface px-3.5 py-1.5 text-sm font-medium text-accent shadow-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/50 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Open to new projects
            </p>
          )}
          <h1 className="rise font-serif text-5xl leading-[1.02] tracking-[-0.03em] text-balance sm:text-6xl lg:text-[4.6rem]" style={{ animationDelay: "60ms" }}>
            {p.headline || p.name || "Portfolio"}
          </h1>
          {p.intro && (
            <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl" style={{ animationDelay: "140ms" }}>
              {p.intro}
            </p>
          )}
          <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: "220ms" }}>
            <Link href="#contact" className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-medium text-white shadow-[0_10px_24px_-10px_rgb(42_74_127/0.7)] transition-colors hover:bg-ink">
              Start a project
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link href="/work" className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 font-medium transition-colors hover:border-ink">
              See case studies
            </Link>
            {p.cv_url && (
              <a href={p.cv_url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-3 py-3 font-medium text-muted hover:text-ink">
                <Download className="size-4" aria-hidden />
                Download CV
              </a>
            )}
          </div>
        </div>

        <div className="relative h-[380px] sm:h-[460px] lg:col-span-6 lg:h-[560px]">
          <HeroScene className="absolute inset-0" />
          <div className="rise absolute bottom-4 left-0 sm:bottom-10 lg:left-4" style={{ animationDelay: "400ms" }}>
            <ProfileCard p={p} current={current} />
          </div>
        </div>
      </div>

      {facts.length > 0 && (
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-6 md:px-8">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-3 bg-surface p-5 sm:flex-row sm:items-start sm:gap-4 md:p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-tint text-accent">
                  <f.icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="sr-only">{f.label}</dt>
                  <dd>
                    <span className="block break-words font-serif text-3xl leading-none tracking-tight">
                      {f.text ?? <CountUp value={f.count} suffix={f.suffix} />}
                    </span>
                    <span className="mt-2 block text-sm leading-snug text-muted">{f.label}</span>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
