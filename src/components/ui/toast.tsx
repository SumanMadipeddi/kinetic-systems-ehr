"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { useUiStore } from "@/store/ui-store";

export function ToastHost() {
  const toast = useUiStore((s) => s.toast);
  const clearToast = useUiStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => clearToast(), 2800);
    return () => window.clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  if (toast.tone === "success" || !toast.tone) {
    return (
      <div
        className="fixed left-1/2 top-1/2 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 border border-[#a8d5a2] bg-[#e8f5e9]/95 px-4 py-3 text-[13px] text-[#4a4a4a] shadow-[0_2px_12px_rgba(0,0,0,0.12)] backdrop-blur-[1px]"
        role="status"
      >
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#43a047] text-white">
          <Check size={12} strokeWidth={3} />
        </span>
        {toast.message}
      </div>
    );
  }

  const bg = toast.tone === "error" ? "#b91c1c" : "var(--pf-primary-dark)";

  return (
    <div
      className="fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 px-4 py-2 text-[13px] text-white shadow"
      style={{ background: bg }}
      role="status"
    >
      {toast.message}
    </div>
  );
}
