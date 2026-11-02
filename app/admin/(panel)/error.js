"use client";

export default function AdminError({ error, reset }) {
  return (
    <div role="alert" className="max-w-xl rounded-lg border border-line bg-surface p-6">
      <h1 className="font-serif text-2xl">That didn&apos;t work.</h1>
      <p className="mt-2 text-muted">
        {error?.message?.includes("Body exceeded")
          ? "The upload was larger than 4 MB. Try fewer or smaller files."
          : "Something went wrong while saving. Your last saved version is unchanged."}
      </p>
      <button onClick={reset} className="mt-6 rounded-md bg-accent px-4 py-2 font-medium text-white hover:bg-ink">
        Try again
      </button>
    </div>
  );
}
