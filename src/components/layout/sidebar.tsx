"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderPlus,
  Mail,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/cn";

function ScheduleIcon({ size = 24, className, ...props }: LucideProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  );
}

function TasksIcon({ size = 24, className, strokeWidth: _strokeWidth, ...props }: LucideProps) {
  void _strokeWidth;
  const displaySize = typeof size === "number" ? Math.max(size, 22) : size;
  return (
    <svg
      width={displaySize}
      height={displaySize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      <g transform="translate(12 12) scale(1.2) translate(-12 -12)">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="m9 12 2 2 4-4" />
      </g>
    </svg>
  );
}

function ReportsIcon({ size = 24, className, strokeWidth: _strokeWidth, ...props }: LucideProps) {
  void _strokeWidth;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}

const NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: ScheduleIcon, match: "/schedule" },
  { href: "/tasks", label: "Tasks", icon: TasksIcon },
  { href: "/charts", label: "Charts", icon: FolderPlus },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/reports", label: "Reports", icon: ReportsIcon },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-full w-[var(--pf-sidebar-width)] shrink-0 flex-col bg-[var(--pf-sidebar-background)] text-[var(--pf-nav-inactive)]"
      aria-label="Primary"
    >
      <div className="flex h-[95px] w-full shrink-0 flex-col items-center justify-center px-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/favicon.ico"
          alt=""
          width={34}
          height={34}
          className="mb-1 h-[34px] w-[34px] object-contain"
        />
        <div className="text-center text-[13px] font-normal leading-[1.15] text-[var(--pf-primary)]">
          practice
          <br />
          fusion
        </div>
      </div>

      <nav className="menu-list mt-0 flex flex-1 flex-col">
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
