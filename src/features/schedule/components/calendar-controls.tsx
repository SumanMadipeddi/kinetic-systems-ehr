"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
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

const ctrlBtn =
  "inline-flex h-[30px] items-center justify-center border border-[#9dc8e8] bg-white text-[#1e4d72] hover:bg-[#f3f9fd]";

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
        className={cn(
          ctrlBtn,
          "min-w-[120px] justify-between gap-2 px-2.5 text-[12px] text-[var(--pf-text)]",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Slot size"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{slotSize} min slots</span>
        <ChevronDown size={12} strokeWidth={2} className="text-[#1e4d72]" />
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
                  "flex w-full px-3 py-1.5 text-left text-[12px] text-[var(--pf-text)]",
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

function NavTriangle({ direction }: { direction: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block border-y-[5px] border-y-transparent",
        direction === "left"
          ? "border-r-[7px] border-r-[#1e4d72]"
          : "border-l-[7px] border-l-[#1e4d72]",
      )}
    />
  );
}

export function CalendarControls({ mode }: Props) {
  const selectedDate = useScheduleStore((s) => s.selectedDate);
  const setSelectedDate = useScheduleStore((s) => s.setSelectedDate);
  const slotSize = useScheduleStore((s) => s.slotSize);
  const setSlotSize = useScheduleStore((s) => s.setSlotSize);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const label = mode === "day" ? formatDisplayDate(selectedDate) : formatWeekRange(selectedDate);

  return (
    <div className="flex h-[42px] items-center justify-between border-b border-[var(--pf-border)] bg-white px-2">
      <div className="text-[13px] font-bold text-[#1e4d72]">{label}</div>

      <div className="flex items-center gap-2">
        {/* Nav: calendar | ◀ | ▶ | Today — one joined group */}
        <div className="flex items-center">
          <button
            type="button"
            className={cn(ctrlBtn, "relative w-[30px] text-[#666]")}
            aria-label="Pick date"
            onClick={() => {
              const input = dateInputRef.current;
              if (!input) return;
              if (typeof input.showPicker === "function") {
                input.showPicker();
              } else {
                input.click();
              }
            }}
          >
            <CalendarDays size={15} strokeWidth={1.75} />
            <input
              ref={dateInputRef}
              type="date"
              className="pointer-events-none absolute inset-0 opacity-0"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) setSelectedDate(e.target.value);
              }}
              tabIndex={-1}
              aria-hidden
            />
          </button>
          <button
            type="button"
            className={cn(ctrlBtn, "-ml-px w-[30px]")}
            aria-label="Previous"
            onClick={() =>
              setSelectedDate(
                mode === "day" ? shiftDay(selectedDate, -1) : shiftWeek(selectedDate, -1),
              )
            }
          >
            <NavTriangle direction="left" />
          </button>
          <button
            type="button"
            className={cn(ctrlBtn, "-ml-px w-[30px]")}
            aria-label="Next"
            onClick={() =>
              setSelectedDate(
                mode === "day" ? shiftDay(selectedDate, 1) : shiftWeek(selectedDate, 1),
              )
            }
          >
            <NavTriangle direction="right" />
          </button>
          <button
            type="button"
            className={cn(ctrlBtn, "-ml-px px-3.5 text-[13px]")}
            onClick={() => setSelectedDate(REFERENCE_TODAY)}
          >
            Today
          </button>
        </div>

        {/* Zoom: − | + */}
        <div className="flex items-center">
          <button
            type="button"
            className={cn(ctrlBtn, "w-[30px]")}
            aria-label="Zoom out"
            onClick={() => {
              const idx = SLOT_SIZES.indexOf(slotSize);
              setSlotSize(SLOT_SIZES[Math.min(SLOT_SIZES.length - 1, idx + 1)]);
            }}
          >
            <ZoomOut size={15} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={cn(ctrlBtn, "-ml-px w-[30px]")}
            aria-label="Zoom in"
            onClick={() => {
              const idx = SLOT_SIZES.indexOf(slotSize);
              setSlotSize(SLOT_SIZES[Math.max(0, idx - 1)]);
            }}
          >
            <ZoomIn size={15} strokeWidth={2} />
          </button>
        </div>

        <SlotSizeSelect />
      </div>
    </div>
  );
}
