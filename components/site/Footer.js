import { ArrowUp } from "lucide-react";
import Link from "next/link";
import BrandIcon from "./BrandIcons";
import { socialLinks } from "./socials";

export default function Footer({ profile, sections = [] }) {
  const links = socialLinks(profile);

  return (
    <footer className="mt-auto">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="font-serif text-2xl tracking-tight">{profile?.name || "Portfolio"}</p>
          {profile?.headline && <p className="mt-2 max-w-sm text-muted">{profile.headline}</p>}
          {links.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener" aria-label={l.label}
                    className="flex size-10 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent hover:text-accent">
                    <BrandIcon name={l.label} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav aria-label="Footer" className="text-sm md:col-span-4 md:col-start-9">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {sections.map((s) => (
              <li key={s.id}>
                <Link href={s.id === "work" ? "/work" : `/#${s.id}`} className="text-muted hover:text-ink">{s.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-sm text-muted md:px-8">
          <p>{profile?.location ? `${profile.name}, ${profile.location}` : profile?.name}</p>
          <a href="#main" className="group inline-flex items-center gap-1.5 hover:text-ink">
            Back to top
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
