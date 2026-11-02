"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";

// Matches the server's bodySizeLimit; checked here so a big upload gets a message instead of an error page.
const MAX_REQUEST = 4 * 1024 * 1024;

// Wraps server-rendered fields; shows the action's result next to the save button.
// Submits via onSubmit (not the form action prop) so React doesn't reset what the admin typed when a save fails.
export default function AdminForm({ action, submitLabel = "Save changes", resetOnSuccess = false, children, className = "" }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [localError, setLocalError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    if (!state?.ok || !formRef.current) return;
    if (resetOnSuccess) formRef.current.reset();
    else formRef.current.querySelectorAll('input[type="file"]').forEach((i) => (i.value = ""));
  }, [state, resetOnSuccess]);

  function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const bytes = [...formData.values()].reduce((sum, v) => sum + (typeof v === "object" ? v.size : 0), 0);
    if (bytes > MAX_REQUEST) {
      setLocalError("Files add up to more than 4 MB. Upload fewer or smaller files at a time.");
      return;
    }
    setLocalError("");
    startTransition(() => formAction(formData));
  }

  const message = localError ? { ok: false, message: localError } : state;

  return (
    <form ref={formRef} onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={pending}
          className="rounded-md bg-accent px-5 py-2.5 font-medium text-white transition-colors hover:bg-ink disabled:opacity-60">
          {pending ? "Saving…" : submitLabel}
        </button>
        {message && !pending && (
          <p role={message.ok ? "status" : "alert"} key={message.at ?? message.message}
            className={`text-sm ${message.ok ? "text-accent" : "text-red-700"}`}>
            {message.message}
          </p>
        )}
      </div>
    </form>
  );
}
