"use client";

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
  return (
    <div className="flex h-full flex-col bg-white">
      <ScheduleHeader />
      <ScheduleToolbar
        showAddAppointment={showAddAppointment}
        showPrint={showPrint}
      />
      <div className="flex min-h-0 flex-1">
        {showFilterRail ? <ScheduleSidebar /> : null}
        {children}
      </div>
      <AppointmentModal />
    </div>
  );
}
