import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-32 md:px-8">
      <h1 className="font-serif text-5xl tracking-tight">This page doesn&apos;t exist.</h1>
      <p className="mt-4 text-lg text-muted">The link may be old, or the project may have been taken down.</p>
      <Link href="/" className="mt-10 self-start rounded-md bg-accent px-5 py-3 font-medium text-white transition-colors hover:bg-ink">
        Go to the home page
      </Link>
    </main>
  );
}
