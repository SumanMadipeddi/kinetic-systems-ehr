"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  CheckSquare,
  FolderPlus,
  Mail,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays, match: "/schedule" },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/charts", label: "Charts", icon: FolderPlus },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/reports", label: "Reports", icon: BarChart3 },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-full w-[var(--pf-sidebar-width)] shrink-0 flex-col bg-[var(--pf-sidebar-background)] text-[var(--pf-nav-inactive)]"
      aria-label="Primary"
    >
      <div className="flex flex-col items-center px-1 pt-3 pb-2">
        <div
          className="mb-1 grid h-8 w-8 place-items-center bg-[var(--pf-primary)] text-white text-[11px] font-bold"
          aria-hidden
        >
          PF
        </div>
        <div className="text-center text-[9px] leading-tight text-[var(--pf-primary)]">
          practice
          <br />
          fusion
        </div>
      </div>

      <nav className="mt-2 flex flex-1 flex-col">
        {NAV.map((item) => {
          const match = "match" in item && item.match ? item.match : item.href;
          const active =
            pathname === item.href || pathname.startsWith(`${match}/`) || pathname === match;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-[11px] no-underline hover:no-underline",
                active
                  ? "bg-[var(--pf-sidebar-active)] text-white"
                  : "text-[var(--pf-nav-inactive)] hover:bg-[var(--pf-sidebar-active)] hover:text-white",
              )}
            >
              <Icon size={20} strokeWidth={1.75} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
