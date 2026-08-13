"use client";

import { DASHBOARD_ITEMS } from "../data/dashboard-items";
import { DashboardCard } from "./dashboard-card";
import { PracticeInfoCard } from "./practice-info-card";

export function DashboardGrid() {
  return (
    <div className="px-4 pb-0 pt-4">
      <div className="grid grid-cols-3 gap-5">
        {DASHBOARD_ITEMS.map((item) => (
          <DashboardCard key={item.id} item={item} />
        ))}
      </div>

      <h2 className="mb-4 mt-6 text-[14px] font-bold text-[#444]">Completed</h2>
      <div className="grid grid-cols-3 gap-5">
        <PracticeInfoCard />
      </div>
    </div>
  );
}
