"use client";

import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "orange" | "ghost" | "outline" | "pill" | "pillOutline";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md";
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--pf-primary-dark)] text-white border border-[var(--pf-primary-dark)] hover:brightness-95",
  secondary:
    "bg-white text-[var(--pf-primary)] border border-[var(--pf-primary)] hover:bg-[#f5fbfe]",
  orange:
    "bg-[var(--pf-orange)] text-white border border-[var(--pf-orange)] hover:brightness-95",
  ghost: "bg-transparent text-[var(--pf-text)] border border-transparent hover:bg-black/5",
  outline:
    "bg-white text-[var(--pf-text)] border border-[var(--pf-border)] hover:bg-[#fafafa]",
  pill:
    "bg-[var(--pf-modal-header)] text-white border border-[var(--pf-modal-header)] rounded-[var(--pf-pill-radius)] px-6",
  pillOutline:
    "bg-white text-[var(--pf-modal-header)] border border-[var(--pf-modal-header)] rounded-[var(--pf-pill-radius)] px-6",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-normal cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "h-7 px-2.5 text-[12px]" : "h-8 px-3 text-[13px]",
        variant !== "pill" && variant !== "pillOutline" ? "rounded-[2px]" : "",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
