"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useScheduleStore, SLOT_SIZES } from "@/store/schedule-store";
import {
  formatDisplayDate,
  formatWeekRange,
  REFERENCE_TODAY,
  shiftDay,
  shiftWeek,
} from "../utils/calendar";

type Props = {
  mode: "day" | "week";
};

function SlotSizeSelect() {
  const slotSize = useScheduleStore((s) => s.slotSize);
  const setSlotSize = useScheduleStore((s) => s.setSlotSize);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex h-[25.6px] min-w-[112px] items-center justify-between gap-2 border border-[#5a6a7a] bg-white px-2 text-[13px] text-[var(--pf-text)]"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Slot size"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{slotSize} min slots</span>
        <ChevronDown size={12} className="text-[#666]" />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-0.5 min-w-full border border-[var(--pf-border)] bg-white py-0.5 shadow-[2px_2px_6px_rgba(0,0,0,0.18)]"
        >
          {SLOT_SIZES.map((size) => (
            <li key={size} role="option" aria-selected={size === slotSize}>
              <button
                type="button"
                className={cn(
                  "flex w-full px-3 py-1.5 text-left text-[13px] text-[var(--pf-text)]",
                  size === slotSize ? "bg-[#bae0ff]" : "hover:bg-[#bae0ff]",
                )}
                onClick={() => {
                  setSlotSize(size);
                  setOpen(false);
                }}
              >
                {size} min slots
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function CalendarControls({ mode }: Props) {
  const selectedDate = useScheduleStore((s) => s.selectedDate);
  const setSelectedDate = useScheduleStore((s) => s.setSelectedDate);
  const slotSize = useScheduleStore((s) => s.slotSize);
  const setSlotSize = useScheduleStore((s) => s.setSlotSize);

  const label = mode === "day" ? formatDisplayDate(selectedDate) : formatWeekRange(selectedDate);

  return (
    <div className="flex h-9 items-center justify-between border-b border-[var(--pf-border)] bg-white px-2">
      <div className="text-[16px] font-bold text-[var(--pf-text)]">{label}</div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-[26px] w-[26px] px-0"
          aria-label="Previous"
          onClick={() =>
            setSelectedDate(mode === "day" ? shiftDay(selectedDate, -1) : shiftWeek(selectedDate, -1))
          }
        >
          <ChevronLeft size={14} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[26px] w-[26px] px-0"
          aria-label="Next"
          onClick={() =>
            setSelectedDate(mode === "day" ? shiftDay(selectedDate, 1) : shiftWeek(selectedDate, 1))
          }
        >
          <ChevronRight size={14} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[26px] text-[13px]"
          onClick={() => setSelectedDate(REFERENCE_TODAY)}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[26px] w-[26px] px-0 text-[var(--pf-primary-dark)] border-[var(--pf-primary)]"
          aria-label="Zoom out"
          onClick={() => {
            const idx = SLOT_SIZES.indexOf(slotSize);
            setSlotSize(SLOT_SIZES[Math.min(SLOT_SIZES.length - 1, idx + 1)]);
          }}
        >
          <ZoomOut size={20} strokeWidth={2.25} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[26px] w-[26px] px-0 text-[var(--pf-primary-dark)] border-[var(--pf-primary)]"
          aria-label="Zoom in"
          onClick={() => {
            const idx = SLOT_SIZES.indexOf(slotSize);
            setSlotSize(SLOT_SIZES[Math.max(0, idx - 1)]);
          }}
        >
          <ZoomIn size={20} strokeWidth={2.25} />
        </Button>
        <SlotSizeSelect />
      </div>
    </div>
  );
}
