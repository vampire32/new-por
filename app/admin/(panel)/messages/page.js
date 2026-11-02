import { Inbox, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { deleteItem, setMessageRead } from "@/app/admin/actions";
import PageHeader from "@/components/admin/PageHeader";
import PendingButton from "@/components/admin/PendingButton";
import { requireAdmin } from "@/lib/auth";

const when = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });
const btn = "inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm transition-colors hover:border-ink";

// Per-request admin page (auth cookies); allowed to block on navigation.
export const instant = false;

export default async function MessagesPage() {
  const { supabase } = await requireAdmin();
  const { data: messages } = await supabase.from("messages").select("*").order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl">
      <PageHeader title="Messages" description="Everything sent through the contact form. Click a message to read it." />
      {messages?.length ? (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={`rounded-2xl border bg-surface transition-colors ${m.read ? "border-line" : "border-accent/30"}`}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-4">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${m.read ? "bg-bg text-muted" : "bg-accent text-white"}`}>
                    {m.read ? <MailOpen className="size-4" aria-hidden /> : <Mail className="size-4" aria-hidden />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span className={m.read ? "font-medium" : "font-semibold"}>{m.name}</span>
                      {!m.read && <span className="rounded-full bg-accent-tint px-2 py-0.5 text-xs font-medium text-accent">New</span>}
                      <span className="text-sm text-muted">{m.email}</span>
                      <span className="ml-auto text-sm text-muted">{when.format(new Date(m.created_at))}</span>
                    </span>
                    <span className="mt-1 block truncate text-sm text-muted group-open:hidden">{m.body}</span>
                  </span>
                </summary>
                <div className="border-t border-line px-5 py-5 sm:pl-19">
                  <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-ink">
                      <Reply className="size-4" aria-hidden />
                      Reply by email
                    </a>
                    <form action={setMessageRead.bind(null, m.id, !m.read)}>
                      <PendingButton className={btn}>
                        {m.read ? <Mail className="size-4" aria-hidden /> : <MailOpen className="size-4" aria-hidden />}
                        {m.read ? "Mark as unread" : "Mark as read"}
                      </PendingButton>
                    </form>
                    <form action={deleteItem.bind(null, "messages", m.id)}>
                      <PendingButton confirm={`Delete the message from ${m.name}?`} className={`${btn} text-red-700 hover:border-red-700`}>
                        <Trash2 className="size-4" aria-hidden />
                        Delete
                      </PendingButton>
                    </form>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <Inbox className="mx-auto size-8 text-muted" aria-hidden />
          <p className="mt-3 text-muted">No messages yet. They&apos;ll show up here when someone uses the contact form.</p>
        </div>
      )}
    </div>
  );
}
