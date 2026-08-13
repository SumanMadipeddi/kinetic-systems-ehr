"use client";

import { useScheduleStore } from "@/store/schedule-store";
import { useFilteredEntries } from "../hooks/use-filtered-entries";
import {
  entriesForDay,
  formatDisplayDate,
  formatTime12h,
  getEntryDurationMinutes,
  REFERENCE_TODAY,
  shiftDay,
} from "../utils/calendar";
import { PROVIDERS } from "@/mocks/providers";
import { getAppointmentTypeMeta } from "@/mocks/appointment-types";
import { Button } from "@/components/ui/button";
import { CalendarControls } from "./calendar-controls";

export function AppointmentsTable() {
  const selectedDate = useScheduleStore((s) => s.selectedDate);
  const setSelectedDate = useScheduleStore((s) => s.setSelectedDate);
  const entries = useFilteredEntries();
  const dayEntries = entriesForDay(entries, selectedDate).sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex h-8 items-center justify-between border-b border-[var(--pf-border)] px-2">
        <div className="text-[16px] font-bold">{formatDisplayDate(selectedDate)}</div>
        <div className="flex items-center gap-2">
          <select className="h-7 border border-[var(--pf-border)] px-2 text-[13px]" defaultValue="standard">
            <option value="standard">Standard view</option>
          </select>
          <Button variant="outline" size="sm" className="text-[13px]" onClick={() => setSelectedDate(shiftDay(selectedDate, -1))}>
            ‹
          </Button>
          <Button variant="outline" size="sm" className="text-[13px]" onClick={() => setSelectedDate(REFERENCE_TODAY)}>
            Today
          </Button>
          <Button variant="outline" size="sm" className="text-[13px]" onClick={() => setSelectedDate(shiftDay(selectedDate, 1))}>
            ›
          </Button>
        </div>
      </div>
      {/* Keep slot controls available for consistency */}
      <div className="hidden">
        <CalendarControls mode="day" />
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead className="sticky top-0 bg-[var(--pf-table-header)]">
            <tr className="border-b border-[var(--pf-border)] text-left uppercase text-[13px] text-[#555]">
              <th className="px-2 py-2 font-semibold">Note</th>
              <th className="px-2 py-2 font-semibold">Status</th>
              <th className="px-2 py-2 font-semibold">Patient</th>
              <th className="px-2 py-2 font-semibold">Time ↑</th>
              <th className="px-2 py-2 font-semibold">Provider</th>
              <th className="px-2 py-2 font-semibold">Type</th>
              <th className="px-2 py-2 font-semibold">Chief Complaint</th>
            </tr>
          </thead>
          <tbody>
            {dayEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-2 py-16 text-center text-[13px] text-[var(--pf-text-muted)]">
                  No appointments scheduled for the day.
                </td>
              </tr>
            ) : (
              dayEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-[var(--pf-border-light)] hover:bg-[#f7fbfe]">
                  <td className="px-2 py-2">{entry.notes ? "•" : ""}</td>
                  <td className="px-2 py-2 capitalize">{entry.status.replace("-", " ")}</td>
                  <td className="px-2 py-2">
                    {entry.kind === "patient" ? entry.patientName : entry.reason ?? "Blocked"}
                  </td>
                  <td className="px-2 py-2">
                    {formatTime12h(entry.startTime)} ({getEntryDurationMinutes(entry)}m)
                  </td>
                  <td className="px-2 py-2">
                    {PROVIDERS.find((p) => p.id === entry.providerId)?.displayName}
                  </td>
                  <td className="px-2 py-2">
                    {entry.kind === "patient"
                      ? getAppointmentTypeMeta(entry.appointmentType)?.label
                      : entry.kind}
                  </td>
                  <td className="px-2 py-2">{entry.chiefComplaint ?? entry.description ?? ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
