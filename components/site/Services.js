import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";
import { serviceIcon } from "./icons";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Services({ items }) {
  return (
    <Section
      id="services"
      title="Services"
      intro="What I can take off your plate, from a first version to fixing what's already live."
      icon={Rocket}
      action={
        <Link href="#contact" className="group inline-flex items-center gap-2 font-medium text-accent">
          Discuss your project
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((s, i) => {
          const Icon = serviceIcon(s.title);
          return (
            <Reveal key={s.id} delay={i * 80}
              className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_48px_-30px_rgb(28_37_51/0.4)]">
              <span aria-hidden className="absolute -right-10 -top-10 size-32 rounded-full bg-accent-tint opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative flex size-12 items-center justify-center rounded-xl bg-accent text-white shadow-[0_10px_20px_-10px_rgb(42_74_127/0.8)]">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="relative mt-6 font-serif text-2xl tracking-tight">{s.title}</h3>
              {s.description && <p className="relative mt-3 leading-relaxed text-muted">{s.description}</p>}
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
