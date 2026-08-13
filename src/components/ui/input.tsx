"use client";

import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  requiredMark?: boolean;
  error?: string;
};

export function Input({ className, label, requiredMark, error, id, ...props }: Props) {
  return (
    <label className="flex flex-col gap-1 w-full" htmlFor={id}>
      {label ? (
        <span className="text-[11px] font-bold uppercase tracking-wide text-[#555]">
          {label}
          {requiredMark ? <span className="text-[var(--pf-required)] ml-0.5">*</span> : null}
        </span>
      ) : null}
      <input
        id={id}
        className={cn(
          "h-8 w-full border border-[var(--pf-border)] rounded-[var(--pf-input-radius)] px-2 text-[13px] text-[var(--pf-text)] bg-white outline-none focus:border-[var(--pf-primary)]",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-[11px] text-red-600">{error}</span> : null}
    </label>
  );
}
