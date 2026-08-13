"use client";

import { useScheduleStore } from "@/store/schedule-store";
import { useFilteredEntries } from "../hooks/use-filtered-entries";
import {
  entriesForDay,
  formatTime12h,
  getEntryDurationMinutes,
} from "../utils/calendar";
import { PROVIDERS } from "@/mocks/providers";
import { getAppointmentTypeMeta } from "@/mocks/appointment-types";
import { CalendarControls } from "./calendar-controls";

function formatStatus(status: string): string {
  return status
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AppointmentsTable() {
  const selectedDate = useScheduleStore((s) => s.selectedDate);
  const entries = useFilteredEntries();
  const dayEntries = entriesForDay(entries, selectedDate).sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <CalendarControls mode="day" />
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
        <table className="min-w-[1100px] w-full border-collapse text-[13px]">
          <thead className="sticky top-0 z-10 bg-[var(--pf-table-header)]">
            <tr className="border-b border-[var(--pf-border)] text-left uppercase text-[13px] text-[#555]">
              <th className="whitespace-nowrap px-2 py-2 font-semibold">Note</th>
              <th className="whitespace-nowrap px-2 py-2 font-semibold">Status</th>
              <th className="whitespace-nowrap px-2 py-2 font-semibold">Patient</th>
              <th className="whitespace-nowrap px-2 py-2 font-semibold">Time ↑</th>
              <th className="whitespace-nowrap px-2 py-2 font-semibold">Provider</th>
              <th className="whitespace-nowrap px-2 py-2 font-semibold">Type</th>
              <th className="whitespace-nowrap px-2 py-2 font-semibold">Chief Complaint</th>
              <th className="whitespace-nowrap px-2 py-2 font-semibold">Confirmation</th>
              <th className="whitespace-nowrap px-2 py-2 font-semibold">Copay</th>
              <th className="whitespace-nowrap px-2 py-2 font-semibold">Eligibility</th>
            </tr>
          </thead>
          <tbody>
            {dayEntries.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-2 py-16 text-center text-[13px] text-[var(--pf-text-muted)]">
                  No appointments scheduled for the day.
                </td>
              </tr>
            ) : (
              dayEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-[var(--pf-border-light)] hover:bg-[#f7fbfe]">
                  <td className="whitespace-nowrap px-2 py-2">{entry.notes ? "•" : ""}</td>
                  <td className="whitespace-nowrap px-2 py-2">{formatStatus(entry.status)}</td>
                  <td className="whitespace-nowrap px-2 py-2">
                    {entry.kind === "patient" ? entry.patientName : entry.reason ?? "Blocked"}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2">
                    {formatTime12h(entry.startTime)} ({getEntryDurationMinutes(entry)}m)
                  </td>
                  <td className="whitespace-nowrap px-2 py-2">
                    {PROVIDERS.find((p) => p.id === entry.providerId)?.displayName}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2">
                    {entry.kind === "patient"
                      ? getAppointmentTypeMeta(entry.appointmentType)?.label
                      : entry.kind}
                  </td>
                  <td className="min-w-[140px] px-2 py-2">
                    {entry.chiefComplaint ?? entry.description ?? ""}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2">
                    {entry.kind === "patient" ? (entry.confirmation ?? "Unconfirmed") : ""}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2">
                    {entry.kind === "patient"
                      ? entry.copay != null
                        ? `$${Number(entry.copay).toFixed(2)}`
                        : "—"
                      : ""}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2">
                    {entry.kind === "patient" ? (entry.eligibility ?? "Unknown") : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
