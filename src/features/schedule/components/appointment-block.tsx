"use client";

import type { ScheduleEntry } from "@/types/schedule-entry";
import type { DaySegment } from "../utils/calendar";
import { formatTime12h } from "../utils/calendar";
import { segmentToPosition } from "../utils/appointment-position";
import { getAppointmentTypeMeta } from "@/mocks/appointment-types";
import { cn } from "@/lib/cn";

type Props = {
  entry: ScheduleEntry;
  segment: DaySegment;
  hourHeight: number;
  dayStartHour?: number;
  onClick?: (entry: ScheduleEntry) => void;
};

function blockColor(entry: ScheduleEntry): string {
  if (entry.kind !== "patient") return "var(--pf-type-block)";
  return getAppointmentTypeMeta(entry.appointmentType)?.colorVar ?? "var(--pf-primary)";
}

export function AppointmentBlock({
  entry,
  segment,
  hourHeight,
  dayStartHour = 0,
  onClick,
}: Props) {
  const { top, height } = segmentToPosition(
    segment.startTime,
    segment.durationMinutes,
    hourHeight,
    dayStartHour,
  );
  const label =
    entry.kind === "patient"
      ? entry.patientName ?? "Patient"
      : entry.reason ?? (entry.kind === "block-range" ? "Block range" : "Blocked");

  return (
    <button
      type="button"
      className={cn(
        "absolute left-1 right-1 overflow-hidden border border-black/10 px-1 py-0.5 text-left text-[11px] leading-tight text-white",
        "hover:brightness-105 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-white",
      )}
      style={{
        top,
        height,
        background: blockColor(entry),
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(entry);
      }}
      title={`${label} (${formatTime12h(segment.startTime)})`}
      data-entry-id={entry.id}
    >
      <div className="truncate font-semibold">{label}</div>
      <div className="truncate opacity-90">{formatTime12h(segment.startTime)}</div>
    </button>
  );
}
