"use client";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";

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

export default function TasksPage() {
  const showToast = useUiStore((s) => s.showToast);

  return (
    <div className="flex h-full flex-col overflow-auto bg-white">
      <div className="flex min-h-[64px] items-center justify-between bg-[var(--pf-primary)] px-4">
        <h1 className="text-[var(--pf-font-lg)] font-normal text-white">Tasks</h1>
        <Button
          variant="secondary"
          className="border-white bg-transparent text-white hover:bg-white/10"
          onClick={() => showToast("Task actions are a placeholder.", "info")}
        >
          Actions ▾
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 bg-[var(--pf-primary-darker)] px-2 py-1">
        {FILTERS.map((f, idx) => (
          <button
            key={f}
            type="button"
            className={
              idx === 0
                ? "bg-[var(--pf-primary)] px-2 py-1 text-[12px] text-white"
                : "bg-[var(--pf-primary-dark)] px-2 py-1 text-[12px] text-white hover:brightness-110"
            }
            onClick={() => showToast(`${f} filter is shallow.`, "info")}
          >
            {f}
          </button>
        ))}
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
        <Button
          variant="orange"
          size="sm"
          onClick={() => showToast("New task is not implemented in this assessment.", "info")}
        >
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
    </div>
  );
}
