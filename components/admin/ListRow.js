import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteItem, moveItem } from "@/app/admin/actions";
import PendingButton from "./PendingButton";

const btn = "flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-30 disabled:hover:border-line";

export default function ListRow({ table, item, title, subtitle, editHref, first, last, children }) {
  return (
    <li className="flex flex-wrap items-center gap-4 border-b border-line py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
        {children}
      </div>
      <div className="flex items-center gap-1.5">
        <form action={moveItem.bind(null, table, item.id, "up")}>
          <PendingButton className={btn} disabled={first} aria-label={`Move ${title} up`}><ArrowUp className="size-4" /></PendingButton>
        </form>
        <form action={moveItem.bind(null, table, item.id, "down")}>
          <PendingButton className={btn} disabled={last} aria-label={`Move ${title} down`}><ArrowDown className="size-4" /></PendingButton>
        </form>
        {editHref && (
          <Link href={editHref} className={btn} aria-label={`Edit ${title}`}><Pencil className="size-4" /></Link>
        )}
        <form action={deleteItem.bind(null, table, item.id)}>
          <PendingButton confirm={`Delete "${title}"? This can't be undone.`} aria-label={`Delete ${title}`}
            className={`${btn} hover:border-red-700 hover:text-red-700`}>
            <Trash2 className="size-4" />
          </PendingButton>
        </form>
      </div>
    </li>
  );
}
