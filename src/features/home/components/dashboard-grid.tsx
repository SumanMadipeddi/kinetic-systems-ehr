"use client";

import { DASHBOARD_ITEMS } from "../data/dashboard-items";
import { useSetupProgress } from "../hooks/use-setup-progress";
import { DashboardCard } from "./dashboard-card";
import { PracticeInfoCard } from "./practice-info-card";

export function DashboardGrid() {
  const { usersComplete } = useSetupProgress();

  const activeItems = DASHBOARD_ITEMS.filter(
    (item) => !(item.id === "users" && usersComplete),
  );
  const usersItem = DASHBOARD_ITEMS.find((item) => item.id === "users");

  return (
    <div className="px-4 pb-2 pt-4">
      <div className="grid grid-cols-3 gap-[30px]">
        {activeItems.map((item) => (
          <DashboardCard key={item.id} item={item} />
        ))}
      </div>

      <h2 className="mb-4 mt-6 text-[14px] font-bold text-[#444]">Completed</h2>
      <div className="mb-6 grid grid-cols-3 gap-[30px]">
        <PracticeInfoCard />
        {usersComplete && usersItem ? (
          <DashboardCard item={{ ...usersItem, status: "complete", actionLabel: undefined }} />
        ) : null}
      </div>
    </div>
  );
}
