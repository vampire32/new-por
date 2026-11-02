"use client";

import { CircleCheck, Send } from "lucide-react";
import { useActionState } from "react";
import { sendMessage } from "@/app/actions/contact";

const input =
  "mt-2 block w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-accent aria-[invalid=true]:border-red-700";

function Field({ name, label, error, children }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, { status: "idle" });
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  if (state.status === "sent") {
    return (
      <div role="status" className="p-2">
        <CircleCheck className="size-10 text-accent" aria-hidden />
        <p className="mt-4 font-serif text-2xl">Message sent.</p>
        <p className="mt-2 text-muted">
          {state.email ? `I'll reply to ${state.email} soon.` : "I'll reply soon."}
        </p>
      </div>
    );
  }

  const describe = (name) => (errors[name] ? `${name}-error` : undefined);

  return (
    <form action={action} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" maxLength={100} required className={input} defaultValue={values.name}
            aria-invalid={Boolean(errors.name)} aria-describedby={describe("name")} />
        </Field>
        <Field name="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" required className={input} defaultValue={values.email}
            aria-invalid={Boolean(errors.email)} aria-describedby={describe("email")} />
        </Field>
      </div>
      <Field name="message" label="Message" error={errors.message}>
        <textarea id="message" name="message" rows={6} maxLength={5000} required className={input} defaultValue={values.message}
          placeholder="What are you building, and when do you need it?"
          aria-invalid={Boolean(errors.message)} aria-describedby={describe("message")} />
      </Field>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending}
        className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-medium text-white transition-colors hover:bg-ink disabled:opacity-60">
        {pending ? "Sending…" : "Send message"}
        <Send className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </button>
    </form>
  );
}
