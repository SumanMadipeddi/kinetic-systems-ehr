"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  requiredMark?: boolean;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, requiredMark, error, id, ...props },
  ref,
) {
  return (
    <label className="flex w-full flex-col gap-1" htmlFor={id}>
      {label ? (
        <span className="text-[11px] font-bold uppercase tracking-wide text-[#555]">
          {label}
          {requiredMark ? <span className="ml-0.5 text-[var(--pf-required)]">*</span> : null}
        </span>
      ) : null}
      <input
        id={id}
        ref={ref}
        className={cn(
          "h-8 w-full rounded-[var(--pf-input-radius)] border border-[var(--pf-border)] bg-white px-2 text-[13px] text-[var(--pf-text)] outline-none focus:border-[var(--pf-primary)]",
          error && "border-red-500",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <span className="text-[11px] text-red-600">{error}</span> : null}
    </label>
  );
});
