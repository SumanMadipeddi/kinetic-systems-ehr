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
    <article className="relative flex h-[212px] flex-col overflow-hidden border border-[var(--pf-border)] bg-white px-4 pb-4 pt-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      {item.status === "incomplete" ? (
        <>
          <svg
            className="pf-card-corner-wrench"
            viewBox="0 0 24 24"
            width={20}
            height={20}
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M22.7 19.3 19.3 22.7c-.4.4-1 .4-1.4 0l-6.1-6.1c-1.5.7-3.2.8-4.8.2-1.9-.7-3.4-2.3-4-4.3-.5-1.6-.3-3.3.5-4.7l3.4 3.4c.4.4 1 .4 1.4 0l2.1-2.1c.4-.4.4-1 0-1.4L7 4.3C8.4 3.5 10.1 3.3 11.7 3.8c2 .6 3.6 2.1 4.3 4 .6 1.6.5 3.3-.2 4.8l6.1 6.1c.4.4.4 1 0 1.4z"
            />
          </svg>
          <div className="pf-incomplete-ribbon">Incomplete</div>
        </>
      ) : null}
      {item.status === "complete" ? (
        <div className="pf-complete-ribbon">Complete</div>
      ) : null}

      <div className="mb-2 flex items-start gap-2 pr-10">
        <Icon className="mt-0.5 text-[var(--pf-primary-dark)]" size={20} />
        <h3 className="text-[15px] font-semibold text-[var(--pf-primary-dark)]">{item.title}</h3>
      </div>
      <p className="mb-3 flex-1 whitespace-pre-line text-[12px] leading-snug text-[var(--pf-text)]">
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
          if (item.id === "users") {
            router.push("/home/users");
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
