"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type FilterOption = {
  value: string;
  label: string;
  secondary?: string;
};

type Props = {
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
  menuClassName?: string;
  renderTrigger?: (selected: FilterOption | undefined, open: boolean) => ReactNode;
};

export function FilterDropdown({
  value,
  options,
  onChange,
  ariaLabel,
  className,
  menuClassName,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex h-8 min-w-[110px] items-center justify-between gap-2 border bg-white px-2 text-left text-[12px] text-[var(--pf-text)] hover:bg-[#fafafa]",
          open ? "border-[var(--pf-primary)]" : "border-[var(--pf-border)]",
          className,
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown size={13} className="shrink-0 text-[#666]" />
      </button>
      {open ? (
        <div
          role="listbox"
          className={cn(
            "absolute left-0 top-full z-40 mt-0.5 min-w-full border border-[var(--pf-border)] bg-white py-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.16)]",
            menuClassName,
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={cn(
                "flex w-full flex-col px-3 py-1.5 text-left text-[12px] text-[#222] hover:bg-[#e8f4fb]",
                option.value === value && "bg-[#e8f4fb]",
              )}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span>{option.label}</span>
              {option.secondary ? (
                <span className="text-[11px] text-[#555]">{option.secondary}</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
