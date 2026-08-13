"use client";

import { useEffect, useMemo, useRef } from "react";
import { PROVIDERS } from "@/mocks/providers";
import { useScheduleStore } from "@/store/schedule-store";
import { useUiStore } from "@/store/ui-store";
import { useFilteredEntries } from "../hooks/use-filtered-entries";
import { buildHourLabels, getVisibleSegmentsForDay } from "../utils/calendar";
import {
  clickYToTime,
  clipSegmentToHourWindow,
  getHourHeight,
} from "../utils/appointment-position";
import { AppointmentBlock } from "./appointment-block";
import { CalendarControls } from "./calendar-controls";
import { TimeColumn } from "./time-column";

export function DayView() {
  const selectedDate = useScheduleStore((s) => s.selectedDate);
  const selectedProviderIds = useScheduleStore((s) => s.selectedProviderIds);
  const showNonBusinessHours = useScheduleStore((s) => s.showNonBusinessHours);
  const slotSize = useScheduleStore((s) => s.slotSize);
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

  const providers = PROVIDERS.filter(
    (p) => selectedProviderIds.length === 0 || selectedProviderIds.includes(p.id),
  );

  useEffect(() => {
    if (!scrollerRef.current) return;
    const targetHour = 8;
    const offsetHours = Math.max(0, targetHour - startHour);
    scrollerRef.current.scrollTop = offsetHours * hourHeight - 8;
  }, [selectedDate, hourHeight, startHour]);

  const openAtClick = (
    event: React.MouseEvent<HTMLElement>,
    providerId?: string,
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
      date: selectedDate,
      time,
      providerId: providerId ?? providers[0]?.id,
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <CalendarControls mode="day" />
      <div ref={scrollerRef} className="min-h-0 flex-1 overflow-auto">
        {/* Provider header stays pinned; times scroll below it */}
        <div className="sticky top-0 z-20 flex min-w-full border-b border-[var(--pf-border)] bg-[#fafafa]">
          <div className="h-8 w-[var(--pf-time-column-width)] shrink-0 bg-white" />
          <div className="flex min-w-0 flex-1">
            {providers.length === 0 ? (
              <div className="flex h-8 flex-1 items-center px-2 text-[13px] text-[var(--pf-text-muted)]">
                Select at least one provider in Filters.
              </div>
            ) : (
              providers.map((provider) => (
                <div
                  key={provider.id}
                  className="flex h-8 min-w-[220px] flex-1 items-center border-r border-[var(--pf-border-light)] px-2 text-[13px] font-semibold"
                >
                  {provider.displayName}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex min-w-full">
          <div
            className="cursor-pointer"
            onClick={(e) => openAtClick(e)}
            role="presentation"
          >
            <TimeColumn hours={hours} hourHeight={hourHeight} showHeaderSpacer={false} />
          </div>
          <div className="flex min-w-0 flex-1">
            {providers.map((provider) => {
              const providerEntries = entries.filter(
                (e) => e.providerId === provider.id,
              );
              return (
                <div
                  key={provider.id}
                  className="relative min-w-[220px] flex-1 cursor-pointer border-r border-[var(--pf-border-light)]"
                  onClick={(e) => openAtClick(e, provider.id)}
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

                    {providerEntries.flatMap((entry) =>
                      getVisibleSegmentsForDay(entry, selectedDate).map((segment) => {
                        const clipped = clipSegmentToHourWindow(
                          segment.startTime,
                          segment.durationMinutes,
                          startHour,
                          endHour,
                        );
                        if (!clipped) return null;
                        const visibleSegment = {
                          ...segment,
                          startTime: clipped.startTime,
                          durationMinutes: clipped.durationMinutes,
                        };
                        return (
                          <AppointmentBlock
                            key={`${entry.id}-${segment.date}-${segment.startTime}`}
                            entry={entry}
                            segment={visibleSegment}
                            hourHeight={hourHeight}
                            dayStartHour={startHour}
                            onClick={(e) =>
                              showToast(
                                e.kind === "patient"
                                  ? `${e.patientName} · ${e.chiefComplaint ?? e.appointmentType}`
                                  : `${e.reason ?? "Blocked time"}`,
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
