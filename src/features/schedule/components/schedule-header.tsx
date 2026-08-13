"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useFilteredEntries } from "../hooks/use-filtered-entries";
import { entriesForDay } from "../utils/calendar";
import { useScheduleStore } from "@/store/schedule-store";

const TABS = [
  { label: "Appointments", href: "/schedule/appointments" },
  { label: "Day", href: "/schedule" },
  { label: "Week", href: "/schedule/week" },
  { label: "Settings", href: "/schedule/settings" },
] as const;

export function ScheduleHeader() {
  const pathname = usePathname();
  const selectedDate = useScheduleStore((s) => s.selectedDate);
  const entries = useFilteredEntries();
  const count = entriesForDay(entries, selectedDate).filter((e) => e.kind === "patient").length;

  return (
    <div className="bg-[var(--pf-primary)] text-white">
      <div className="flex items-end gap-3 px-4 pt-3">
        <h1 className="text-[24px] font-light leading-none">Schedule</h1>
        <span className="pb-0.5 text-[13px] text-white/90">{count} Appointments</span>
      </div>
      <div className="mt-3 flex items-end gap-[6px] pl-4">
        {TABS.map((tab) => {
          const active =
            tab.href === "/schedule"
              ? pathname === "/schedule"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex h-[26px] items-center rounded-[3px] px-2 py-0.5 text-[13px] no-underline hover:no-underline",
                active
                  ? "bg-white text-[var(--pf-text)]"
                  : "bg-[#0070BF] text-white hover:brightness-110",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
