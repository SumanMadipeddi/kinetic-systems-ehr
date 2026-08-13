"use client";

import { useUiStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function ShallowPage({ title, description, actionLabel = "Actions" }: Props) {
  const showToast = useUiStore((s) => s.showToast);

  return (
    <div className="flex h-full flex-col overflow-auto bg-white">
      <div className="flex min-h-[64px] items-center justify-between bg-[var(--pf-primary)] px-4">
        <h1 className="text-[var(--pf-font-lg)] font-normal text-white">{title}</h1>
        <Button
          variant="secondary"
          className="border-white text-white bg-transparent hover:bg-white/10"
          onClick={() => showToast(`${title} actions are a placeholder.`, "info")}
        >
          {actionLabel}
        </Button>
      </div>
      <div className="p-6">
        <div className="border border-[var(--pf-border)] bg-[var(--pf-table-header)] px-3 py-2 text-[12px] font-semibold uppercase">
          {title}
        </div>
        <div className="border border-t-0 border-[var(--pf-border)] px-4 py-16 text-center text-[13px] text-[var(--pf-text-muted)]">
          {description}
        </div>
      </div>
    </div>
  );
}
