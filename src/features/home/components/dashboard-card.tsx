"use client";

import {
  Wallet,
  Users,
  FlaskConical,
  Film,
  Pill,
  FileText,
  Receipt,
  ShieldCheck,
  Settings,
} from "lucide-react";
import type { DashboardItem } from "../data/dashboard-items";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import { useRouter } from "next/navigation";

const ICONS = {
  wallet: Wallet,
  users: Users,
  labs: FlaskConical,
  imaging: Film,
  rx: Pill,
  cpt: FileText,
  billing: Receipt,
  insurance: ShieldCheck,
  settings: Settings,
};

export function DashboardCard({ item }: { item: DashboardItem }) {
  const showToast = useUiStore((s) => s.showToast);
  const router = useRouter();
  const Icon = ICONS[item.icon];

  return (
    <article className="relative flex h-[212px] flex-col overflow-hidden border border-[var(--pf-border)] bg-white p-4">
      {item.status === "incomplete" ? (
        <div className="pf-incomplete-ribbon">Incomplete</div>
      ) : null}
      {item.status === "complete" ? (
        <div className="pf-complete-ribbon">Complete</div>
      ) : null}

      <div className="mb-2 flex items-start gap-2 pr-10">
        <Icon className="mt-0.5 text-[var(--pf-primary-dark)]" size={20} />
        <h3 className="text-[15px] font-semibold text-[var(--pf-primary-dark)]">{item.title}</h3>
      </div>
      <p className="mb-3 whitespace-pre-line text-[12px] leading-snug text-[var(--pf-text)] flex-1">
        {item.description}
      </p>
      {item.linkLabel ? (
        <button
          type="button"
          className="mb-2 self-start text-[12px] text-[var(--pf-link)] hover:underline"
          onClick={() => showToast("Tutorials are not included in this assessment.", "info")}
        >
          {item.linkLabel}
        </button>
      ) : null}
      <Button
        variant={item.actionTone === "orange" ? "orange" : "primary"}
        className="w-full"
        onClick={() => {
          if (item.id === "settings") {
            router.push("/settings");
            return;
          }
          showToast(`${item.actionLabel} is a placeholder action.`, "info");
        }}
      >
        {item.actionLabel}
      </Button>
    </article>
  );
}
