"use client";

import { cn } from "@/lib/cn";
import type { SelectHTMLAttributes } from "react";

type Option = { value: string; label: string };

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  requiredMark?: boolean;
  error?: string;
  options: Option[];
  placeholder?: string;
};

export function Select({
  className,
  label,
  requiredMark,
  error,
  id,
  options,
  placeholder,
  ...props
}: Props) {
  return (
    <label className="flex flex-col gap-1 w-full" htmlFor={id}>
      {label ? (
        <span className="text-[11px] font-bold uppercase tracking-wide text-[#555]">
          {label}
          {requiredMark ? <span className="text-[var(--pf-required)] ml-0.5">*</span> : null}
        </span>
      ) : null}
      <select
        id={id}
        className={cn(
          "h-8 w-full border border-[var(--pf-border)] rounded-[var(--pf-input-radius)] px-2 text-[13px] text-[var(--pf-text)] bg-white outline-none focus:border-[var(--pf-primary)]",
          error && "border-red-500",
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-[11px] text-red-600">{error}</span> : null}
    </label>
  );
}
