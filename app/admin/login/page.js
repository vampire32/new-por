"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const denied = useSearchParams().has("denied");
  const [error, setError] = useState(denied ? "This account doesn't have admin access." : "");
  const [pending, setPending] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const { error } = await createBrowserClient().auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (error) {
      setError("Email or password is incorrect.");
      setPending(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-20">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border border-line bg-surface p-8">
        <h1 className="font-serif text-3xl tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Manage the content of your portfolio.</p>

        <label htmlFor="email" className="mt-8 block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required
          className="mt-2 block w-full rounded-md border border-line bg-surface px-3.5 py-2.5 focus:border-accent focus:outline-none" />

        <label htmlFor="password" className="mt-5 block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required
          className="mt-2 block w-full rounded-md border border-line bg-surface px-3.5 py-2.5 focus:border-accent focus:outline-none" />

        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={pending}
          className="mt-8 w-full rounded-md bg-accent px-5 py-3 font-medium text-white transition-colors hover:bg-ink disabled:opacity-60">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
