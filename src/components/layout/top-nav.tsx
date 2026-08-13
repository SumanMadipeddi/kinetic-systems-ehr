"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  CircleHelp,
  Lock,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/store/ui-store";

type SubTab = {
  label: string;
  href: string;
  closable?: boolean;
};

function buildTabs(pathname: string, practiceInfoTabOpen: boolean): SubTab[] {
  if (pathname.startsWith("/home")) {
    const tabs: SubTab[] = [
      { label: "Dashboard", href: "/home" },
      { label: "Documents", href: "/home" },
      { label: "Directory", href: "/home" },
    ];
    if (practiceInfoTabOpen || pathname.startsWith("/home/practice-info")) {
      tabs.push({
        label: "Practice Info",
        href: "/home/practice-info",
        closable: true,
      });
    }
    return tabs;
  }
  if (pathname.startsWith("/tasks")) {
    return [
      { label: "Tasks", href: "/tasks" },
      { label: "Documents", href: "/tasks" },
    ];
  }
  if (pathname.startsWith("/schedule")) {
    return [{ label: "Schedule", href: "/schedule" }];
  }
  return [];
}

function isTabActive(pathname: string, tab: SubTab): boolean {
  if (tab.label === "Practice Info") {
    return pathname.startsWith("/home/practice-info");
  }
  if (tab.label === "Dashboard") {
    return pathname === "/home" || pathname === "/home/";
  }
  if (tab.label === "Tasks") {
    return pathname.startsWith("/tasks");
  }
  if (tab.label === "Schedule") {
    return pathname.startsWith("/schedule");
  }
  return false;
}

function UtilityDivider() {
  return <span className="mx-0.5 h-3.5 w-px shrink-0 bg-[#555]" aria-hidden />;
}

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const practiceInfoTabOpen = useUiStore((s) => s.practiceInfoTabOpen);
  const closePracticeInfoTab = useUiStore((s) => s.closePracticeInfoTab);
  const tabs = buildTabs(pathname, practiceInfoTabOpen);

  return (
    <header className="flex shrink-0 flex-col text-[12px] leading-5 text-[var(--pf-topnav-text)]">
      {/* Row 1 — utilities only, right-aligned */}
      <div className="flex h-[30px] items-center justify-end border-b border-[#444] bg-[var(--pf-topnav-background)] px-1">
        <button
          type="button"
          className="inline-flex h-full items-center gap-1 px-2 text-[var(--pf-topnav-text)] hover:text-white"
          onClick={() => showToast("Help center is not included in this assessment.", "info")}
        >
          <CircleHelp size={14} />
          Help
          <ChevronDown size={11} />
        </button>

        <UtilityDivider />

        <span className="whitespace-nowrap px-2 text-[var(--pf-topnav-text)]">
          suman Ma | suman Ma Practice
        </span>

        <UtilityDivider />

        <button
          type="button"
          className="inline-flex h-full items-center gap-1 px-2 text-[var(--pf-topnav-text)] hover:text-white"
          onClick={() => showToast("Session lock is not implemented.", "info")}
        >
          <Lock size={13} />
          Lock
        </button>

        <UtilityDivider />

        <Link
          href="/settings"
          className="inline-flex h-full items-center gap-1 px-2 text-[var(--pf-topnav-text)] no-underline hover:text-white hover:no-underline"
        >
          <Settings size={13} />
          Settings
        </Link>

        <UtilityDivider />

        <button
          type="button"
          className="inline-flex h-full items-center gap-1 px-2 text-[var(--pf-topnav-text)] hover:text-white"
          onClick={() => showToast("Authentication is out of scope for this assessment.", "info")}
        >
          <LogOut size={13} />
          Log out
        </button>
      </div>

      {/* Row 2 — Dashboard / Documents / etc. */}
      {tabs.length > 0 ? (
        <nav className="flex h-[30px] items-stretch border-b border-[var(--pf-primary)] bg-[#2a2a2a] px-2">
          {tabs.map((tab, idx) => {
            const active = isTabActive(pathname, tab);
            return (
              <div
                key={`${tab.label}-${idx}`}
                className="relative flex items-center"
              >
                <Link
                  href={tab.href}
                  className={cn(
                    "menu-label relative flex h-full items-center px-3 text-[12px] no-underline hover:no-underline",
                    active
                      ? "text-[var(--pf-primary)]"
                      : "text-white hover:text-[var(--pf-primary)]",
                  )}
                  onClick={(e) => {
                    if (
                      (pathname.startsWith("/home") &&
                        tab.label !== "Dashboard" &&
                        tab.label !== "Practice Info") ||
                      (pathname.startsWith("/tasks") && tab.label !== "Tasks")
                    ) {
                      e.preventDefault();
                      showToast(`${tab.label} is a placeholder in this assessment.`, "info");
                    }
                  }}
                >
                  {tab.label}
                  {active ? (
                    <span
                      className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[5px] border-b-[5px] border-x-transparent border-b-[var(--pf-primary)]"
                      aria-hidden
                    />
                  ) : null}
                </Link>
                {tab.closable ? (
                  <button
                    type="button"
                    aria-label="Close Practice Info"
                    className="text-[var(--pf-topnav-text)] hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      closePracticeInfoTab();
                      if (pathname.startsWith("/home/practice-info")) {
                        router.push("/home");
                      }
                    }}
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                ) : null}
              </div>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
