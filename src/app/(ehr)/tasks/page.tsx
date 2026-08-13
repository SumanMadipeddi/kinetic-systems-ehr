"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/features/tasks/components/task-modal";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/cn";

const FILTERS = [
  "All tasks",
  "My tasks",
  "Unassigned tasks",
  "Rx change/cancel",
  "Lab results",
  "Refill requests",
  "Imaging results",
  "Prior Authorizations",
  "Rx orders",
];

function ShortcutKeys({ keys }: { keys: string[] }) {
  return (
    <span className="ml-6 inline-flex items-center gap-1 text-[11px] text-[#555]">
      {keys.map((key, idx) => (
        <span key={`${key}-${idx}`} className="inline-flex items-center gap-1">
          {idx > 0 ? <span className="text-[#777]">+</span> : null}
          <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[3px] border border-[#d8d8d8] bg-[#f3f3f3] px-1 font-sans text-[11px] text-[#444] shadow-[0_1px_0_#d0d0d0]">
            {key}
          </kbd>
        </span>
      ))}
    </span>
  );
}

export default function TasksPage() {
  const showToast = useUiStore((s) => s.showToast);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const actionsRef = useRef<HTMLDivElement>(null);
  const pendingKeyRef = useRef<string | null>(null);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!actionsOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) {
        setActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [actionsOpen]);

  useEffect(() => {
    const clearPending = () => {
      pendingKeyRef.current = null;
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (taskModalOpen) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) {
        return;
      }

      const key = event.key.toLowerCase();
      if (pendingKeyRef.current === "n") {
        if (key === "t") {
          event.preventDefault();
          clearPending();
          setTaskModalOpen(true);
          return;
        }
        if (key === "m") {
          event.preventDefault();
          clearPending();
          showToast("Send new message is a placeholder.", "info");
          return;
        }
        clearPending();
      }

      if (key === "n" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        pendingKeyRef.current = "n";
        if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = setTimeout(clearPending, 1000);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearPending();
    };
  }, [showToast, taskModalOpen]);

  const openTaskModal = () => {
    setActionsOpen(false);
    setTaskModalOpen(true);
  };

  return (
    <div className="flex h-full flex-col overflow-auto bg-white">
      <div className="bg-[var(--pf-primary)]">
        <div className="flex min-h-[64px] items-center justify-between px-4">
          <h1 className="text-[var(--pf-font-lg)] font-normal text-white">Tasks</h1>
          <div className="relative" ref={actionsRef}>
            <Button
              variant="ghost"
              className="border border-white bg-transparent text-white hover:bg-white/10"
              aria-haspopup="menu"
              aria-expanded={actionsOpen}
              onClick={() => setActionsOpen((v) => !v)}
            >
              Actions
              <ChevronDown size={14} />
            </Button>
            {actionsOpen ? (
              <div
                className="absolute right-0 top-full z-50 mt-0 min-w-[340px] border border-[#b7d7ea] bg-white py-1 text-[13px] text-[#222] shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
                role="menu"
                aria-label="Task actions"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full px-3 py-2 text-left hover:bg-[#f3f9fc]"
                  onClick={() => {
                    setActionsOpen(false);
                    showToast(
                      "Convert historical unsigned encounters to tasks is a placeholder.",
                      "info",
                    );
                  }}
                >
                  Convert historical unsigned encounters to tasks
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full px-3 py-2 text-left hover:bg-[#f3f9fc]"
                  onClick={() => {
                    setActionsOpen(false);
                    showToast("Tasks refreshed.", "info");
                  }}
                >
                  Refresh tasks
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-[#f3f9fc]"
                  onClick={() => {
                    setActionsOpen(false);
                    showToast("Send new message is a placeholder.", "info");
                  }}
                >
                  <span>Send new message</span>
                  <ShortcutKeys keys={["N", "M"]} />
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-[#f3f9fc]"
                  onClick={openTaskModal}
                >
                  <span>Create task</span>
                  <ShortcutKeys keys={["N", "T"]} />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-[6px] px-2 pb-0">
          {FILTERS.map((f) => {
            const active = f === activeFilter;
            return (
              <button
                key={f}
                type="button"
                className={cn(
                  "inline-flex h-[28px] items-center px-2.5 text-[12px]",
                  active
                    ? "bg-white text-[var(--pf-text)]"
                    : "bg-[var(--pf-primary-dark)] text-white hover:brightness-110",
                )}
                onClick={() => {
                  setActiveFilter(f);
                  if (f !== "All tasks") {
                    showToast(`${f} filter is shallow.`, "info");
                  }
                }}
              >
                {f}
              </button>
            );
          })}
          <button
            type="button"
            aria-label="More task filters"
            className="inline-flex h-[28px] items-center justify-center bg-[var(--pf-primary-dark)] px-2.5 text-[12px] leading-none text-white hover:brightness-110"
            onClick={() => showToast("More filters are a placeholder.", "info")}
          >
            ...
          </button>
          <button
            type="button"
            aria-label="Task settings"
            className="inline-flex h-[28px] items-center justify-center bg-[var(--pf-primary-dark)] px-2.5 text-white hover:brightness-110"
            onClick={() => showToast("Task settings are a placeholder.", "info")}
          >
            <Wrench size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--pf-border)] px-3 py-2">
        <select className="h-7 border border-[var(--pf-border)] px-2 text-[12px]">
          <option>All types</option>
        </select>
        <input
          className="h-7 w-56 border border-[var(--pf-border)] px-2 text-[12px]"
          placeholder="Search patient name, record..."
        />
        <select className="h-7 border border-[var(--pf-border)] px-2 text-[12px]">
          <option>Incomplete</option>
        </select>
        <select className="h-7 border border-[var(--pf-border)] px-2 text-[12px]">
          <option>Current</option>
        </select>
        <div className="flex-1" />
        <Button variant="orange" size="sm" onClick={openTaskModal}>
          New task
        </Button>
      </div>

      <table className="w-full border-collapse text-[12px]">
        <thead className="bg-[var(--pf-table-header)]">
          <tr className="border-b border-[var(--pf-border)] text-left uppercase text-[11px]">
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">0 Task</th>
            <th className="px-3 py-2">Patient</th>
            <th className="px-3 py-2">Details</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={5}
              className="px-3 py-16 text-center text-[13px] text-[var(--pf-text-muted)]"
            >
              Your practice has no tasks matching the filter selection.
            </td>
          </tr>
        </tbody>
      </table>

      <TaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
    </div>
  );
}
