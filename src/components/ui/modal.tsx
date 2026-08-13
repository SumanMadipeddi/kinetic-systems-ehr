"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  titleExtra?: ReactNode;
  className?: string;
  width?: number;
  height?: number;
};

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  titleExtra,
  className,
  width = 560,
  height,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-[var(--pf-overlay)]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "flex flex-col bg-white shadow-lg border border-[var(--pf-border)]",
          height ? "overflow-hidden" : "max-h-[calc(100vh-80px)]",
          className,
        )}
        style={{ width, height }}
      >
        <div className="flex h-10 shrink-0 items-center justify-between bg-[var(--pf-modal-header)] px-3">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[15px] font-normal text-white">{title}</h2>
            {titleExtra}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-white hover:opacity-80"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer ? (
          <div className="flex shrink-0 items-center justify-between border-t border-[var(--pf-border-light)] px-4 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
