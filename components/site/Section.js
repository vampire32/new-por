import Reveal from "./Reveal";

// Shared section frame: heading in a left column on desktop, content on the right.
// `band` puts the section on a white surface to alternate with the grey page background.
export default function Section({ id, title, intro, action, icon: Icon, band = false, children }) {
  return (
    <section id={id} className={`scroll-mt-24 py-20 md:py-28 ${band ? "border-y border-line bg-surface" : ""}`}>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <Reveal className="md:sticky md:top-28">
            {Icon && (
              <span className="mb-6 flex size-11 items-center justify-center rounded-xl border border-line bg-surface text-accent shadow-sm">
                <Icon className="size-5" aria-hidden />
              </span>
            )}
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">{title}</h2>
            {intro && <p className="mt-4 max-w-xs leading-relaxed text-muted">{intro}</p>}
            {action && <div className="mt-6">{action}</div>}
          </Reveal>
        </div>
        <div className="md:col-span-8">{children}</div>
      </div>
    </section>
  );
}
