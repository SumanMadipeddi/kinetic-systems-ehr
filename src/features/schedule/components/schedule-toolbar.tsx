"use client";

import { RefreshCw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FACILITIES } from "@/mocks/facilities";
import { useScheduleStore } from "@/store/schedule-store";
import { useUiStore } from "@/store/ui-store";

type Props = {
  showAddAppointment?: boolean;
  showPrint?: boolean;
};

export function ScheduleToolbar({
  showAddAppointment = true,
  showPrint = false,
}: Props) {
  const selectedFacilityId = useScheduleStore((s) => s.selectedFacilityId);
  const setSelectedFacilityId = useScheduleStore((s) => s.setSelectedFacilityId);
  const toggleFilterRail = useUiStore((s) => s.toggleFilterRail);
  const openAppointmentModal = useUiStore((s) => s.openAppointmentModal);
  const refreshSchedule = useUiStore((s) => s.refreshSchedule);
  const scheduleRefreshing = useUiStore((s) => s.scheduleRefreshing);
  const showToast = useUiStore((s) => s.showToast);

  return (
    <div className="flex h-[var(--pf-toolbar-height)] items-center gap-2 border-b border-[var(--pf-border)] bg-white px-3">
      <Button
        variant="secondary"
        size="sm"
        className="h-[25.6px] text-[13px]"
        onClick={toggleFilterRail}
      >
        <SlidersHorizontal size={14} />
        Filter
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="h-[25.6px] text-[13px]"
        disabled={scheduleRefreshing}
        onClick={() => void refreshSchedule()}
      >
        <RefreshCw size={14} className={scheduleRefreshing ? "animate-spin" : undefined} />
        Refresh
      </Button>
      <select
        className="h-[25.6px] min-w-[200px] border border-[var(--pf-primary)] bg-white px-2 text-[13px] text-[var(--pf-text)]"
        value={selectedFacilityId}
        onChange={(e) => setSelectedFacilityId(e.target.value)}
        aria-label="Facility"
      >
        {FACILITIES.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      <div className="flex-1" />
      {showPrint ? (
        <Button
          variant="outline"
          size="sm"
          className="h-[25.6px] text-[13px]"
          onClick={() => showToast("Print is not implemented.", "info")}
        >
          Print
        </Button>
      ) : null}
      {showAddAppointment ? (
        <Button
          variant="orange"
          size="sm"
          className="h-[25.6px] text-[13px]"
          onClick={() => openAppointmentModal()}
        >
          + Add appointment
        </Button>
      ) : null}
    </div>
  );
}
