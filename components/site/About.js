import { Briefcase, CircleCheck, FolderKanban, MapPin, UserRound } from "lucide-react";
import Image from "next/image";
import Paragraphs from "./Paragraphs";
import Reveal from "./Reveal";
import Section from "./Section";

export default function About({ profile, stats }) {
  const facts = [
    stats.years > 0 && [Briefcase, "Experience", `${stats.years}+ years`],
    stats.projects > 0 && [FolderKanban, "Projects delivered", `${stats.projects}${profile.projects_delivered ? "+" : ""}`],
    profile.location && [MapPin, "Based in", profile.location],
    [CircleCheck, "Availability", profile.available ? "Taking new work" : "Fully booked"],
  ].filter(Boolean);

  return (
    <Section id="about" title="About" intro="The short version of who I am and how I work." icon={UserRound} band>
      <div className="grid gap-12 lg:grid-cols-8">
        <Reveal className="lg:col-span-5">
          <Paragraphs text={profile.about} className="text-lg leading-relaxed text-ink/85 [&>p:first-child]:font-serif [&>p:first-child]:text-2xl [&>p:first-child]:leading-snug [&>p:first-child]:text-ink" />
        </Reveal>
        <Reveal delay={120} as="aside" className="lg:col-span-3">
          {profile.about_image_url && (
            <Image src={profile.about_image_url} alt="" width={800} height={600}
              className="mb-6 aspect-[4/3] w-full rounded-xl bg-surface-2 object-cover" />
          )}
          <dl className="divide-y divide-line rounded-xl border border-line bg-bg">
            {facts.map(([Icon, label, value]) => (
              <div key={label} className="flex items-center gap-3 px-5 py-4">
                <Icon className="size-4 shrink-0 text-accent" aria-hidden />
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="ml-auto text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
