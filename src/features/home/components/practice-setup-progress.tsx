"use client";

import { Wrench } from "lucide-react";
import { useSetupProgress } from "../hooks/use-setup-progress";

export function PracticeSetupProgress() {
  const { percent } = useSetupProgress();

  return (
    <div className="flex h-full flex-col justify-center gap-1 text-white">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.04em]">
        <Wrench size={12} strokeWidth={2.25} />
        Practice Setup
      </div>
      <div className="progress total-position-outside flex h-[20px] w-[237px] items-center">
        <div className="h-[20px] flex-1 overflow-hidden border border-[#e8e0c8] bg-[#eeeeee]">
          <div
            className="h-full bg-[var(--pf-success)] transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="progress-total-position-outside pl-[5px] text-[13px] leading-none text-white">
          {percent}%
        </span>
      </div>
    </div>
  );
}
