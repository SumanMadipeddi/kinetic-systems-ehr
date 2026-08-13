"use client";

import { useEffect } from "react";
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

  const bg =
    toast.tone === "error"
      ? "#b91c1c"
      : toast.tone === "info"
        ? "var(--pf-primary-dark)"
        : "var(--pf-success)";

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 px-4 py-2 text-white text-[13px] shadow"
      style={{ background: bg }}
      role="status"
    >
      {toast.message}
    </div>
  );
}
