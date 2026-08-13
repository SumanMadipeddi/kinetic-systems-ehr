import { minutesToTime, timeToMinutes } from "./calendar";

export type PositionStyle = {
  top: number;
  height: number;
};

/**
 * Convert a day's segment into pixel offsets relative to the visible day start.
 * hourHeight = pixels for 60 minutes.
 * dayStartHour = first visible hour (0 for midnight-based full day).
 */
export function segmentToPosition(
  startTime: string,
  durationMinutes: number,
  hourHeight: number,
  dayStartHour = 0,
): PositionStyle {
  const startMinutes = timeToMinutes(startTime) - dayStartHour * 60;
  const top = (startMinutes / 60) * hourHeight;
  const height = Math.max((durationMinutes / 60) * hourHeight, hourHeight / 4);
  return { top, height };
}

export function getHourHeight(slotMinutes: number, baseHourHeight = 36.8): number {
  // 30-minute slots use the base hour height; smaller slots zoom in.
  return Math.max(24, baseHourHeight * (30 / slotMinutes));
}

/** Map a click Y position within a day grid to a slot-snapped HH:mm time. */
export function clickYToTime(
  clientY: number,
  gridTop: number,
  hourHeight: number,
  startHour: number,
  slotMinutes: number,
): string {
  const y = Math.max(0, clientY - gridTop);
  const totalMinutes = startHour * 60 + (y / hourHeight) * 60;
  const snapped = Math.floor(totalMinutes / slotMinutes) * slotMinutes;
  return minutesToTime(Math.max(0, Math.min(23 * 60 + 59, snapped)));
}

export function clipSegmentToHourWindow(
  startTime: string,
  durationMinutes: number,
  startHour: number,
  endHour: number,
): { startTime: string; durationMinutes: number } | null {
  const start = timeToMinutes(startTime);
  const end = start + durationMinutes;
  const windowStart = startHour * 60;
  const windowEnd = endHour * 60;
  const clippedStart = Math.max(start, windowStart);
  const clippedEnd = Math.min(end, windowEnd);
  if (clippedEnd <= clippedStart) return null;
  const h = Math.floor(clippedStart / 60);
  const m = clippedStart % 60;
  return {
    startTime: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    durationMinutes: clippedEnd - clippedStart,
  };
}
