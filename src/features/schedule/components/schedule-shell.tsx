"use client";

import { useEffect } from "react";
import { LoadingOverlay } from "@/components/ui/loading-spinner";
import { useScheduleStore } from "@/store/schedule-store";
import { useUiStore } from "@/store/ui-store";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleToolbar } from "./schedule-toolbar";
import { ScheduleSidebar } from "./schedule-sidebar";
import { AppointmentModal } from "./appointment-modal";

type Props = {
  children: React.ReactNode;
  showAddAppointment?: boolean;
  showPrint?: boolean;
  showFilterRail?: boolean;
};

export function ScheduleShell({
  children,
  showAddAppointment = true,
  showPrint = false,
  showFilterRail = true,
}: Props) {
  const hydrated = useScheduleStore((s) => s.hydrated);
  const setHydrated = useScheduleStore((s) => s.setHydrated);
  const scheduleRefreshing = useUiStore((s) => s.scheduleRefreshing);
  const scheduleRefreshKey = useUiStore((s) => s.scheduleRefreshKey);
  const showLoader = !hydrated || scheduleRefreshing;

  // Ensure we never stay stuck if persist rehydration is a no-op.
  useEffect(() => {
    if (hydrated) return;
    const id = window.setTimeout(() => setHydrated(true), 50);
    return () => window.clearTimeout(id);
  }, [hydrated, setHydrated]);

  return (
    <div className="flex h-full flex-col bg-white">
      <ScheduleHeader />
      <ScheduleToolbar
        showAddAppointment={showAddAppointment}
        showPrint={showPrint}
      />
      <div className="relative flex min-h-0 flex-1">
        {showFilterRail ? <ScheduleSidebar /> : null}
        <div className="relative min-h-0 min-w-0 flex-1">
          <div key={scheduleRefreshKey} className="flex h-full min-h-0 flex-col">
            {children}
          </div>
          <LoadingOverlay show={showLoader} size={64} label="Loading schedule" />
        </div>
      </div>
      <AppointmentModal />
    </div>
  );
}
