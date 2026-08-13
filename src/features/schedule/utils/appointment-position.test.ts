import { describe, expect, it } from "vitest";
import { clipSegmentToHourWindow, segmentToPosition } from "./appointment-position";
import { getVisibleSegmentsForDay } from "./calendar";
import type { ScheduleEntry } from "@/types/schedule-entry";

describe("segmentToPosition", () => {
  it("places a 9:00 AM 30-minute visit correctly", () => {
    const pos = segmentToPosition("09:00", 30, 48, 0);
    expect(pos.top).toBe(9 * 48);
    expect(pos.height).toBe(24);
  });

  it("rebases against a business-hours start", () => {
    const pos = segmentToPosition("09:00", 30, 48, 7);
    expect(pos.top).toBe(2 * 48);
  });
});

describe("getVisibleSegmentsForDay", () => {
  it("splits a multi-day block into day segments", () => {
    const entry: ScheduleEntry = {
      id: "r1",
      kind: "block-range",
      providerId: "p1",
      facilityId: "f1",
      startDate: "2026-08-12",
      startTime: "16:00",
      endDate: "2026-08-13",
      endTime: "10:00",
      status: "tentative",
    };

    const day1 = getVisibleSegmentsForDay(entry, "2026-08-12");
    const day2 = getVisibleSegmentsForDay(entry, "2026-08-13");

    expect(day1).toHaveLength(1);
    expect(day1[0].startTime).toBe("16:00");
    expect(day1[0].continuesToNext).toBe(true);

    expect(day2).toHaveLength(1);
    expect(day2[0].startTime).toBe("00:00");
    expect(day2[0].endTime).toBe("10:00");
    expect(day2[0].continuesFromPrev).toBe(true);
  });
});

describe("clipSegmentToHourWindow", () => {
  it("clips segments outside the visible window", () => {
    expect(clipSegmentToHourWindow("06:00", 60, 7, 19)).toBeNull();
    const clipped = clipSegmentToHourWindow("06:30", 60, 7, 19);
    expect(clipped?.startTime).toBe("07:00");
    expect(clipped?.durationMinutes).toBe(30);
  });
});
