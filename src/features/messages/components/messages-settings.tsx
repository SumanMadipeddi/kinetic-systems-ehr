"use client";

import { useState } from "react";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/cn";

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={cn(
        "relative inline-flex h-7 w-[58px] shrink-0 items-center rounded-full border px-1 text-[11px] font-bold transition-colors",
        on
          ? "justify-start border-[var(--pf-primary)] bg-[var(--pf-primary)] text-white"
          : "justify-end border-[#c8c8c8] bg-white text-[#777]",
      )}
      onClick={() => onChange(!on)}
    >
      {on ? <span className="pl-1">ON</span> : null}
      <span
        className={cn(
          "absolute h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-all",
          on ? "right-1" : "left-1 border border-[#ddd]",
        )}
      />
      {!on ? <span className="pr-1">OFF</span> : null}
    </button>
  );
}

export function MessagesSettings() {
  const showToast = useUiStore((s) => s.showToast);
  const [includeInChart, setIncludeInChart] = useState(false);
  const [archiveGroup, setArchiveGroup] = useState(true);

  return (
    <div className="flex h-full flex-col overflow-auto bg-[var(--pf-page-background)]">
      <div className="flex min-h-[64px] items-center bg-[var(--pf-primary)] px-4">
        <h1 className="text-[var(--pf-font-lg)] font-normal text-white">Messages settings</h1>
      </div>

      <div className="space-y-4 p-4">
        <section className="border border-[var(--pf-border)] bg-white p-4">
          <h2 className="mb-2 text-[14px] font-bold text-[#222]">Messages about patients</h2>
          <p className="mb-1 text-[13px] text-[#333]">
            Automatically include any messages about a patient in the Chart. This includes:
          </p>
          <ul className="mb-2 list-disc pl-5 text-[13px] text-[#333]">
            <li>Messages &apos;regarding a patient&apos;</li>
          </ul>
          <p className="mb-4 text-[12px] text-[var(--pf-text-muted)]">
            Note: You will still have the option to not include a message in the patient&apos;s chart
            on a message-by-message basis.
          </p>
          <div className="flex items-center gap-3">
            <Toggle
              on={includeInChart}
              onChange={setIncludeInChart}
              label="Automatically include any messages about a patient in the Chart"
            />
            <span className="text-[13px] text-[#333]">
              Automatically include any messages about a patient in the Chart
            </span>
          </div>
        </section>

        <section className="border border-[var(--pf-border)] bg-white p-4">
          <h2 className="mb-2 text-[14px] font-bold text-[#222]">Archive group messages</h2>
          <p className="mb-4 text-[13px] text-[#333]">
            This setting will archive group messages for all participants in the thread as soon as
            the first user archives it.{" "}
            <button
              type="button"
              className="text-[var(--pf-link)] hover:underline"
              onClick={() => showToast("Learn more is unavailable.", "info")}
            >
              Learn more.
            </button>
          </p>
          <div className="flex items-center gap-3">
            <Toggle
              on={archiveGroup}
              onChange={setArchiveGroup}
              label="Archive group messages for entire group"
            />
            <span className="text-[13px] text-[#333]">Archive group messages for entire group</span>
          </div>
        </section>
      </div>
    </div>
  );
}
