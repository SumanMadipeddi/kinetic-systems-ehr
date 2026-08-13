"use client";

import { useEffect, useMemo, useRef } from "react";
import { format } from "date-fns";
import { useScheduleStore } from "@/store/schedule-store";
import { useUiStore } from "@/store/ui-store";
import { useFilteredEntries } from "../hooks/use-filtered-entries";
import {
  buildHourLabels,
  formatDateKey,
  getVisibleSegmentsForDay,
  getWeekDays,
  REFERENCE_TODAY,
} from "../utils/calendar";
import {
  clickYToTime,
  clipSegmentToHourWindow,
  getHourHeight,
} from "../utils/appointment-position";
import { AppointmentBlock } from "./appointment-block";
import { CalendarControls } from "./calendar-controls";
import { TimeColumn } from "./time-column";

export function WeekView() {
  const selectedDate = useScheduleStore((s) => s.selectedDate);
  const showWeekends = useScheduleStore((s) => s.showWeekends);
  const showNonBusinessHours = useScheduleStore((s) => s.showNonBusinessHours);
  const slotSize = useScheduleStore((s) => s.slotSize);
  const selectedProviderIds = useScheduleStore((s) => s.selectedProviderIds);
  const entries = useFilteredEntries();
  const showToast = useUiStore((s) => s.showToast);
  const openAppointmentModal = useUiStore((s) => s.openAppointmentModal);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const hourHeight = getHourHeight(slotSize);
  const startHour = showNonBusinessHours ? 0 : 7;
  const endHour = showNonBusinessHours ? 24 : 19;
  const hours = useMemo(
    () => buildHourLabels(startHour, endHour),
    [startHour, endHour],
  );

  const days = useMemo(() => {
    const all = getWeekDays(selectedDate);
    return showWeekends ? all : all.filter((d) => d.getDay() !== 0 && d.getDay() !== 6);
  }, [selectedDate, showWeekends]);

  useEffect(() => {
    if (!scrollerRef.current) return;
    const offsetHours = Math.max(0, 8 - startHour);
    scrollerRef.current.scrollTop = offsetHours * hourHeight - 8;
  }, [selectedDate, hourHeight, startHour]);

  const openAtClick = (
    event: React.MouseEvent<HTMLElement>,
    dateKey: string,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const time = clickYToTime(
      event.clientY,
      rect.top,
      hourHeight,
      startHour,
      slotSize,
    );
    openAppointmentModal({
      date: dateKey,
      time,
      providerId: selectedProviderIds[0],
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <CalendarControls mode="week" />
      <div ref={scrollerRef} className="min-h-0 flex-1 overflow-auto">
        <div className="sticky top-0 z-20 flex min-w-full border-b border-[var(--pf-border)] bg-[#fafafa]">
          <div className="h-8 w-[var(--pf-time-column-width)] shrink-0 border-r border-[var(--pf-border)] bg-white" />
          <div className="flex min-w-0 flex-1">
            {days.map((day) => {
              const key = formatDateKey(day);
              const isToday = key === REFERENCE_TODAY;
              return (
                <div
                  key={key}
                  className="flex h-8 min-w-[110px] flex-1 items-center justify-center border-r border-[var(--pf-border-light)] text-[13px] font-semibold"
                  style={{ background: isToday ? "var(--pf-current-day-bg)" : undefined }}
                >
                  {format(day, "EEE M/dd")}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex min-w-full">
          <div
            className="cursor-pointer"
            onClick={(e) => openAtClick(e, selectedDate)}
            role="presentation"
          >
            <TimeColumn hours={hours} hourHeight={hourHeight} showHeaderSpacer={false} />
          </div>
          <div className="flex min-w-0 flex-1">
            {days.map((day) => {
              const key = formatDateKey(day);
              const isToday = key === REFERENCE_TODAY;
              return (
                <div
                  key={key}
                  className="relative min-w-[110px] flex-1 cursor-pointer border-r border-[var(--pf-border-light)]"
                  style={{ background: isToday ? "var(--pf-current-day-bg)" : undefined }}
                  onClick={(e) => openAtClick(e, key)}
                  role="presentation"
                >
                  <div
                    className="relative"
                    style={{ height: hours.length * hourHeight }}
                  >
                    {hours.map((hour, idx) => (
                      <div
                        key={hour}
                        className="absolute left-0 right-0 border-b border-[var(--pf-border-light)]"
                        style={{ top: idx * hourHeight, height: hourHeight }}
                      >
                        <div
                          className="absolute left-0 right-0 border-b border-dashed border-[#ececec]"
                          style={{ top: hourHeight / 2 }}
                        />
                      </div>
                    ))}

                    {entries.flatMap((entry) =>
                      getVisibleSegmentsForDay(entry, key).map((segment) => {
                        const clipped = clipSegmentToHourWindow(
                          segment.startTime,
                          segment.durationMinutes,
                          startHour,
                          endHour,
                        );
                        if (!clipped) return null;
                        return (
                          <AppointmentBlock
                            key={`${entry.id}-${key}-${segment.startTime}`}
                            entry={entry}
                            segment={{
                              ...segment,
                              startTime: clipped.startTime,
                              durationMinutes: clipped.durationMinutes,
                            }}
                            hourHeight={hourHeight}
                            dayStartHour={startHour}
                            onClick={(e) =>
                              showToast(
                                e.kind === "patient"
                                  ? `${e.patientName}`
                                  : `${e.reason ?? "Blocked"}`,
                                "info",
                              )
                            }
                          />
                        );
                      }),
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
