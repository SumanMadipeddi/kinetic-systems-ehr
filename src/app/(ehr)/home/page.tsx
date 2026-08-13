import { Wrench } from "lucide-react";
import { DashboardGrid } from "@/features/home/components/dashboard-grid";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[var(--pf-page-background)]">
      <div className="flex h-[56px] min-h-[56px] shrink-0 items-center justify-between bg-[var(--pf-primary)] px-4">
        <h1 className="text-[24px] font-light leading-none text-white">
          Practice dashboard
        </h1>

        <div className="flex h-full flex-col items-end justify-center gap-1 text-white">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.04em]">
            <Wrench size={12} strokeWidth={2.25} />
            Practice Setup
          </div>
          <div className="progress total-position-outside flex h-[20px] w-[217px] items-center">
            <div className="h-[20px] flex-1 overflow-hidden border border-[#e8e0c8] bg-[#eeeeee]">
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
      <div className="min-h-0 flex-1 overflow-y-auto">
        <DashboardGrid />
      </div>
    </div>
  );
}
