import { techLogo } from "@/lib/tech-logos";
import { skillIcon } from "./icons";

// Endless strip of every skill: the real brand logo when one exists, otherwise the category's icon.
export default function StackMarquee({ groups }) {
  const items = groups.flatMap((g) =>
    g.skills.map((s) => ({ id: s.id, name: s.name, logo: techLogo(s.name), Icon: skillIcon(g.name) }))
  );
  if (items.length < 4) return null;

  return (
    <div className="relative overflow-hidden border-y border-line bg-surface py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <p className="sr-only">Technologies: {items.map((i) => i.name).join(", ")}</p>
      <ul aria-hidden className="marquee flex w-max gap-12 motion-reduce:animate-none">
        {[...items, ...items].map((item, i) => (
          <li key={`${item.id}-${i}`} className="flex items-center gap-3 whitespace-nowrap">
            {item.logo ? (
              <svg viewBox="0 0 24 24" className="size-6" fill={item.logo.color}>
                <path d={item.logo.path} />
              </svg>
            ) : (
              <item.Icon className="size-6 text-accent" />
            )}
            <span className="text-lg font-medium text-ink/80">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
