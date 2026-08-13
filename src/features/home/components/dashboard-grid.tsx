"use client";

import { DASHBOARD_ITEMS } from "../data/dashboard-items";
import { DashboardCard } from "./dashboard-card";
import { PracticeInfoCard } from "./practice-info-card";

export function DashboardGrid() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-3">
        {DASHBOARD_ITEMS.map((item) => (
          <DashboardCard key={item.id} item={item} />
        ))}
      </div>

      <h2 className="mb-2 mt-6 text-[14px] font-bold text-[#444]">Completed</h2>
      <div className="grid grid-cols-3 gap-3">
        <PracticeInfoCard />
      </div>
    </div>
  );
}
