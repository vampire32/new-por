import { MessageSquareQuote, Quote } from "lucide-react";
import Image from "next/image";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Testimonials({ items }) {
  return (
    <Section id="testimonials" title="What people say" icon={MessageSquareQuote}>
      <div className="grid gap-4">
        {items.map((t, i) => (
          <Reveal as="figure" key={t.id} delay={i * 80} className="relative rounded-2xl border border-line bg-surface p-8">
            <Quote className="absolute right-6 top-6 size-10 text-accent-tint" aria-hidden />
            <blockquote className="relative font-serif text-2xl leading-snug tracking-tight md:text-[1.7rem]">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {t.avatar_url ? (
                <Image src={t.avatar_url} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
              ) : (
                <span className="flex size-11 items-center justify-center rounded-full bg-accent-tint font-medium text-accent">
                  {t.name.charAt(0)}
                </span>
              )}
              <span>
                <span className="block font-medium">{t.name}</span>
                {t.role && <span className="block text-sm text-muted">{t.role}</span>}
              </span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
