import { Wrench } from "lucide-react";
import { DashboardGrid } from "@/features/home/components/dashboard-grid";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col overflow-auto bg-[var(--pf-page-background)]">
      <div className="flex h-[52px] items-center justify-between bg-[var(--pf-primary)] px-4">
        <h1 className="text-[24px] font-light leading-none text-white">
          Practice dashboard
        </h1>

        <div className="flex flex-col items-end gap-0.5 text-white">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.04em]">
            <Wrench size={12} strokeWidth={2.25} />
            Practice Setup
          </div>
          <div className="flex items-center">
            <div className="h-[6px] w-[100px] overflow-hidden bg-white/40">
              <div
                className="h-full bg-[var(--pf-success)]"
                style={{ width: "16%" }}
              />
            </div>
            <span className="progress-total-position-outside pl-[5px] text-[13px] leading-none text-white">
              16%
            </span>
          </div>
        </div>
      </div>
      <DashboardGrid />
    </div>
  );
}
