import { Wrench } from "lucide-react";
import { skillIcon } from "./icons";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Skills({ groups }) {
  return (
    <Section id="skills" title="Skills" intro="The tools I reach for, grouped by where they sit in the stack." icon={Wrench} band>
      <div className="grid gap-4 sm:grid-cols-2">
        {groups
          .filter((g) => g.skills.length > 0)
          .map((g, i) => {
            const Icon = skillIcon(g.name);
            return (
              <Reveal key={g.id} delay={i * 80} className="group rounded-2xl border border-line bg-bg p-6 transition-colors hover:border-accent/40">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-surface text-accent shadow-sm transition-colors group-hover:bg-accent group-hover:text-white">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-medium">{g.name}</h3>
                  <span className="ml-auto text-sm text-muted">{g.skills.length}</span>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <li key={s.id} className="rounded-md border border-line bg-surface px-2.5 py-1 text-sm">{s.name}</li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
      </div>
    </Section>
  );
}
