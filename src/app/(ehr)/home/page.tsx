import { DashboardGrid } from "@/features/home/components/dashboard-grid";
import { PracticeSetupProgress } from "@/features/home/components/practice-setup-progress";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[var(--pf-page-background)]">
      <div className="flex h-[56px] min-h-[56px] shrink-0 items-center justify-between bg-[var(--pf-primary)] px-4">
        <h1 className="text-[24px] font-light leading-none text-white">
          Practice dashboard
        </h1>
        <PracticeSetupProgress />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <DashboardGrid />
      </div>
    </div>
  );
}
