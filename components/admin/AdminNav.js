"use client";

import { Briefcase, FolderKanban, Inbox, LayoutDashboard, MessageSquareQuote, Rocket, UserRound, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/services", label: "Services", icon: Rocket },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
];

// `badge` is rendered on the server (unread count) and passed in for the Messages item.
export default function AdminNav({ badge }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto text-sm md:flex-col">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 transition-colors ${
              active ? "bg-accent text-white shadow-sm" : "text-ink/75 hover:bg-bg hover:text-ink"
            }`}>
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
            {href === "/admin/messages" && badge}
          </Link>
        );
      })}
    </nav>
  );
}
