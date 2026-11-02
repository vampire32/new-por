import { Clock, Mail, MapPin } from "lucide-react";
import BrandIcon from "./BrandIcons";
import ContactForm from "./ContactForm";
import Reveal from "./Reveal";
import { socialLinks } from "./socials";

export default function Contact({ profile }) {
  const links = socialLinks(profile);
  const details = [
    profile?.email && { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    profile?.location && { icon: MapPin, label: profile.location },
    { icon: Clock, label: "Replies within one working day" },
  ].filter(Boolean);

  return (
    <section id="contact" className="scroll-mt-16 px-3 py-3 md:px-5 md:py-5">
      <div className="relative overflow-hidden rounded-3xl bg-ink text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_100%,rgb(42_74_127/0.6),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">Let&apos;s build something good.</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Tell me about your project or the role you&apos;re hiring for, and I&apos;ll get back to you with next steps.
            </p>
            <ul className="mt-10 space-y-4">
              {details.map((d) => (
                <li key={d.label} className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                    <d.icon className="size-4" aria-hidden />
                  </span>
                  {d.href ? (
                    <a href={d.href} className="break-all font-medium underline decoration-white/30 underline-offset-4 hover:decoration-white">{d.label}</a>
                  ) : (
                    <span className="text-white/80">{d.label}</span>
                  )}
                </li>
              ))}
            </ul>
            {links.length > 0 && (
              <ul className="mt-10 flex gap-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener" aria-label={l.label}
                      className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:bg-white hover:text-ink">
                      <BrandIcon name={l.label} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
          <Reveal delay={120} className="rounded-2xl bg-surface p-6 text-ink shadow-2xl md:p-8 lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
