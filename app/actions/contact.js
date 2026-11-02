"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { getProfile } from "@/lib/data";
import { validateContact } from "@/lib/validation";

export async function sendMessage(prevState, formData) {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const result = validateContact({ ...values, website: formData.get("website") ?? "" });

  // Honeypot filled: pretend it worked so bots don't retry.
  if (result.spam) return { status: "sent", email: "" };
  // Values go back so the form (reset by React after an action) keeps what the visitor typed.
  if (!result.ok) return { status: "idle", errors: result.errors, values };

  const { error } = await createPublicClient().from("messages").insert(result.data);
  if (error) {
    const profile = await getProfile().catch(() => null);
    return {
      status: "error",
      values,
      message: profile?.email
        ? `Your message could not be sent. Email me directly at ${profile.email}.`
        : "Your message could not be sent. Try again in a minute.",
    };
  }
  return { status: "sent", email: result.data.email };
}
