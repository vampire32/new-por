"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

// Submit button for small row actions (move, delete, mark read) that shows a spinner while the action runs.
export default function PendingButton({ children, className = "", confirm, disabled, ...rest }) {
  const { pending } = useFormStatus();
  return (
    <button
      {...rest}
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={`relative ${className}`}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      <span className={`inline-flex items-center gap-1.5 ${pending ? "invisible" : ""}`}>{children}</span>
      {pending && <LoaderCircle className="absolute inset-0 m-auto size-4 animate-spin" aria-hidden />}
    </button>
  );
}
