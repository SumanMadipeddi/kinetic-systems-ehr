import {
  addDays,
  addMinutes,
  format,
  parse,
  startOfWeek,
  isSameDay,
  startOfDay,
  differenceInMinutes,
  min as minDate,
  max as maxDate,
} from "date-fns";
import type { ScheduleEntry } from "@/types/schedule-entry";

/** Fixed demo calendar date for deterministic seed data and Playwright runs */
export const REFERENCE_TODAY = "2026-08-12";

export function parseDate(dateStr: string): Date {
  return parse(dateStr, "yyyy-MM-dd", new Date(2026, 0, 1));
}

export function parseDateTime(dateStr: string, timeStr: string): Date {
  return parse(`${dateStr} ${timeStr}`, "yyyy-MM-dd HH:mm", new Date(2026, 0, 1));
}

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatDisplayDate(dateStr: string): string {
  return format(parseDate(dateStr), "EEE, MMM d, yyyy");
}

export function formatWeekRange(dateStr: string): string {
  const weekStart = getWeekStart(dateStr);
  const weekEnd = addDays(weekStart, 6);
  return `${format(weekStart, "MMM d")} - ${format(weekEnd, "d, yyyy")}`;
}

export function formatTime12h(timeStr: string): string {
  const d = parse(timeStr, "HH:mm", new Date(2026, 0, 1));
  return format(d, "h:mm a");
}

export function getWeekStart(dateStr: string): Date {
  return startOfWeek(parseDate(dateStr), { weekStartsOn: 0 });
}

export function getWeekDays(dateStr: string): Date[] {
  const start = getWeekStart(dateStr);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function shiftDay(dateStr: string, delta: number): string {
  return formatDateKey(addDays(parseDate(dateStr), delta));
}

export function shiftWeek(dateStr: string, deltaWeeks: number): string {
  return formatDateKey(addDays(parseDate(dateStr), deltaWeeks * 7));
}

export function resolveEntryEnd(entry: ScheduleEntry): { endDate: string; endTime: string } {
  if (entry.endDate && entry.endTime) {
    return { endDate: entry.endDate, endTime: entry.endTime };
  }

  const duration = entry.durationMinutes ?? 30;
  const start = parseDateTime(entry.startDate, entry.startTime);
  const end = addMinutes(start, duration);
  return {
    endDate: formatDateKey(end),
    endTime: format(end, "HH:mm"),
  };
}

export function getEntryDurationMinutes(entry: ScheduleEntry): number {
  if (entry.durationMinutes != null) return entry.durationMinutes;
  const { endDate, endTime } = resolveEntryEnd(entry);
  return Math.max(
    15,
    differenceInMinutes(
      parseDateTime(endDate, endTime),
      parseDateTime(entry.startDate, entry.startTime),
    ),
  );
}

/**
 * Visible day segments for calendar rendering.
 * Multi-day block ranges become one segment per calendar day.
 */
export type DaySegment = {
  entryId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  continuesFromPrev: boolean;
  continuesToNext: boolean;
};

export function getVisibleSegmentsForDay(
  entry: ScheduleEntry,
  day: string,
): DaySegment[] {
  const rangeStart = parseDateTime(entry.startDate, entry.startTime);
  const { endDate, endTime } = resolveEntryEnd(entry);
  const rangeEnd = parseDateTime(endDate, endTime);

  const dayStart = startOfDay(parseDate(day));
  const nextDayStart = addDays(dayStart, 1);

  // No overlap with this calendar day
  if (rangeEnd <= dayStart || rangeStart >= nextDayStart) {
    return [];
  }

  const segStart = maxDate([rangeStart, dayStart]);
  const segEnd = minDate([rangeEnd, nextDayStart]);
  const durationMinutes = differenceInMinutes(segEnd, segStart);
  if (durationMinutes <= 0) return [];

  return [
    {
      entryId: entry.id,
      date: day,
      startTime: format(segStart, "HH:mm"),
      endTime: format(segEnd, "HH:mm") === "00:00" && !isSameDay(segEnd, segStart)
        ? "24:00"
        : format(segEnd, "HH:mm"),
      durationMinutes,
      continuesFromPrev: rangeStart < dayStart,
      continuesToNext: rangeEnd > nextDayStart,
    },
  ];
}

export function entriesForDay(entries: ScheduleEntry[], day: string): ScheduleEntry[] {
  return entries.filter((entry) => getVisibleSegmentsForDay(entry, day).length > 0);
}

export function timeToMinutes(timeStr: string): number {
  if (timeStr === "24:00") return 24 * 60;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(total: number): string {
  const clamped = Math.max(0, Math.min(total, 24 * 60 - 1));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function buildHourLabels(startHour = 0, endHour = 24): string[] {
  const labels: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    labels.push(minutesToTime(h * 60));
  }
  return labels;
}

export function addMinutesToTime(timeStr: string, delta: number): string {
  return minutesToTime(timeToMinutes(timeStr) + delta);
}
