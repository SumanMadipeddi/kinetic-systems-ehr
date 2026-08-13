"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Check,
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

type HelpItem =
  | { kind: "header"; label: string }
  | { kind: "link"; label: string; statusOk?: boolean };

const HELP_MENU: HelpItem[] = [
  { kind: "header", label: "System status" },
  { kind: "link", label: "All Systems Operational", statusOk: true },
  { kind: "link", label: "Run diagnostics" },
  { kind: "header", label: "Self help" },
  { kind: "link", label: "Knowledge Base (FAQs)" },
  { kind: "link", label: "Tutorials" },
  { kind: "link", label: "About" },
  { kind: "header", label: "Practice Fusion support" },
  { kind: "link", label: "Contact us" },
  { kind: "header", label: "Product Report" },
  { kind: "link", label: "Known Issues" },
  { kind: "header", label: "Feature request" },
  { kind: "link", label: "Share idea" },
  { kind: "header", label: "Legal" },
  { kind: "link", label: "Privacy policy" },
  { kind: "link", label: "Terms of use" },
  { kind: "link", label: "Healthcare provider user agreement" },
  { kind: "link", label: "Addenda to user agreement" },
];

function buildTabs(
  pathname: string,
  practiceInfoTabOpen: boolean,
  usersTabOpen: boolean,
): SubTab[] {
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
    if (usersTabOpen || pathname.startsWith("/home/users")) {
      tabs.push({
        label: "Users",
        href: "/home/users",
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
  if (tab.label === "Users") {
    return pathname.startsWith("/home/users");
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

const navButtonClass =
  "nav-button inline-flex h-full items-center gap-1.5 border-l border-[#555] px-[15px] text-[12px] text-[#cccccc] hover:text-white";

function HelpMenu({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (label: string) => void;
}) {
  if (!open) return null;

  let sectionIndex = -1;

  return (
    <div
      className="absolute right-0 top-full z-50 mt-0 max-h-[320px] w-[260px] overflow-y-auto border border-[#d0d0d0] bg-white text-[12px] text-[#222] shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
      role="menu"
      aria-label="Help"
    >
      {HELP_MENU.map((item, idx) => {
        if (item.kind === "header") {
          sectionIndex += 1;
          return (
            <div key={`${item.label}-${idx}`}>
              {sectionIndex > 0 ? (
                <div className="border-t border-[#e0e0e0]" />
              ) : null}
              <div className="px-3 pb-1 pt-2 text-[12px] font-bold text-[#222]">
                {item.label}
              </div>
            </div>
          );
        }

        return (
          <button
            key={`${item.label}-${idx}`}
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-1.5 pl-6 text-left text-[12px] text-[#222] hover:bg-black hover:text-white"
            onClick={() => {
              onSelect(item.label);
              onClose();
            }}
          >
            {item.statusOk ? (
              <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#73b925] text-white">
                <Check size={9} strokeWidth={3} />
              </span>
            ) : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const practiceInfoTabOpen = useUiStore((s) => s.practiceInfoTabOpen);
  const closePracticeInfoTab = useUiStore((s) => s.closePracticeInfoTab);
  const usersTabOpen = useUiStore((s) => s.usersTabOpen);
  const closeUsersTab = useUiStore((s) => s.closeUsersTab);
  const tabs = buildTabs(pathname, practiceInfoTabOpen, usersTabOpen);
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!helpOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!helpRef.current?.contains(event.target as Node)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [helpOpen]);

  return (
    <header className="flex shrink-0 flex-col text-[12px] leading-5 text-[var(--pf-topnav-text)]">
      {/* Row 1 — utilities only, right-aligned; each item is a bordered cell */}
      <div className="flex h-[30px] items-stretch justify-end border-b border-[#444] bg-[#333333]">
        <div ref={helpRef} className="relative flex">
          <button
            type="button"
            className={cn(navButtonClass, "nav-help", helpOpen && "text-white")}
            aria-haspopup="menu"
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen((value) => !value)}
          >
            <CircleHelp
              size={14}
              fill="#cccccc"
              stroke="#333333"
              strokeWidth={1.75}
              className="shrink-0"
            />
            Help
            <ChevronDown size={9} strokeWidth={2.5} className="shrink-0 opacity-90" />
          </button>
          <HelpMenu
            open={helpOpen}
            onClose={() => setHelpOpen(false)}
            onSelect={(label) =>
              showToast(`${label} is a placeholder in this assessment.`, "info")
            }
          />
        </div>

        <span className={cn(navButtonClass, "cursor-default hover:text-[#cccccc]")}>
          suman Ma | suman Ma Practice
        </span>

        <button
          type="button"
          className={cn(navButtonClass, "nav-lock")}
          onClick={() => showToast("Session lock is not implemented.", "info")}
        >
          <Lock size={13} />
          Lock
        </button>

        <Link
          href="/settings"
          className={cn(
            navButtonClass,
            "nav-settings no-underline hover:no-underline",
          )}
        >
          <Settings size={13} />
          Settings
        </Link>

        <button
          type="button"
          className={cn(navButtonClass, "nav-logout border-r")}
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
                        tab.label !== "Practice Info" &&
                        tab.label !== "Users") ||
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
                    aria-label={`Close ${tab.label}`}
                    className="text-[var(--pf-topnav-text)] hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      if (tab.label === "Users") {
                        closeUsersTab();
                        if (pathname.startsWith("/home/users")) {
                          router.push("/home");
                        }
                        return;
                      }
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
