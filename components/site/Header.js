import Link from "next/link";

function hrefFor(id) {
  return id === "work" ? "/work" : `/#${id}`;
}

export default function Header({ name, sections }) {
  const links = sections.filter((s) => s.id !== "contact");

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/" className="font-serif text-xl tracking-tight">
          {name || "Portfolio"}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 text-sm md:flex">
          {links.map((s) => (
            <Link key={s.id} href={hrefFor(s.id)} className="text-muted transition-colors hover:text-ink">
              {s.label}
            </Link>
          ))}
          <Link href="/#contact" className="rounded-md bg-accent px-4 py-2 font-medium text-white transition-colors hover:bg-ink">
            Start a project
          </Link>
        </nav>

        <details className="group relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-line px-3 py-1.5 text-sm">
            Menu
          </summary>
          <nav aria-label="Main" className="absolute right-0 mt-2 flex w-52 flex-col rounded-lg border border-line bg-surface p-2 text-sm shadow-lg shadow-ink/5">
            {[...links, { id: "contact", label: "Contact" }].map((s) => (
              <Link key={s.id} href={hrefFor(s.id)} className="rounded-md px-3 py-2 hover:bg-bg">
                {s.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
