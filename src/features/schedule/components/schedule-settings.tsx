"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const SUBTABS = ["General", "Providers/Facilities", "Templates"] as const;

export function ScheduleSettings() {
  const [tab, setTab] = useState<(typeof SUBTABS)[number]>("General");
  const [createEncounters, setCreateEncounters] = useState(true);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-[var(--pf-page-background)]">
      <div className="flex gap-4 border-b border-[var(--pf-border)] bg-white px-4">
        {SUBTABS.map((t) => (
          <button
            key={t}
            type="button"
            className={cn(
              "py-2 text-[13px]",
              tab === t
                ? "border-b-2 border-[var(--pf-primary)] font-semibold text-[var(--pf-text)]"
                : "text-[var(--pf-text-muted)]",
            )}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="m-4 border border-[var(--pf-border)] bg-white p-4">
        {tab === "General" ? (
          <>
            <h2 className="mb-3 text-[14px] font-bold">
              Encounters for no-shows / cancellations
            </h2>
            <label className="mb-2 flex items-start gap-2 text-[13px]">
              <input
                type="radio"
                name="encounters"
                checked={createEncounters}
                onChange={() => setCreateEncounters(true)}
              />
              <span>
                Create encounters for patient no-shows and cancellations (affects all providers)
              </span>
            </label>
            <label className="flex items-start gap-2 text-[13px]">
              <input
                type="radio"
                name="encounters"
                checked={!createEncounters}
                onChange={() => setCreateEncounters(false)}
              />
              <span>
                Do not create encounters for patient no-shows and cancellations (affects all
                providers)
              </span>
            </label>
          </>
        ) : (
          <p className="text-[13px] text-[var(--pf-text-muted)]">
            No additional {tab.toLowerCase()} settings are configured.
          </p>
        )}
      </div>
    </div>
  );
}
