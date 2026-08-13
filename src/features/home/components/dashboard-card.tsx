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
  BookOpen,
  MessagesSquare,
  Files,
  Store,
  CreditCard,
  Video,
} from "lucide-react";
import type { DashboardFooterBrand, DashboardItem } from "../data/dashboard-items";
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
  book: BookOpen,
  messages: MessagesSquare,
  templates: Files,
  marketplace: Store,
  payments: CreditCard,
  telehealth: Video,
};

function FooterBrand({ brand }: { brand: DashboardFooterBrand }) {
  if (brand === "veradigm") {
    return (
      <div className="mt-auto flex items-end justify-end pt-2" aria-label="Veradigm">
        <span className="text-[15px] font-semibold tracking-tight">
          <span className="text-[#0072bc]"> veradigm</span>
        </span>
      </div>
    );
  }
  if (brand === "trustcommerce") {
    return (
      <div className="mt-auto flex items-end justify-end pt-2" aria-label="TrustCommerce">
        <span className="text-[12px] font-bold text-[#0b3d66]">TrustCommerce</span>
      </div>
    );
  }
  return (
    <div className="mt-auto flex items-end justify-end pt-2" aria-label="Updox">
      <span className="text-[13px] font-bold text-[#0a6aa8]">updox</span>
    </div>
  );
}

export function DashboardCard({ item }: { item: DashboardItem }) {
  const showToast = useUiStore((s) => s.showToast);
  const router = useRouter();
  const Icon = ICONS[item.icon];
  const iconPlacement = item.iconPlacement ?? "title";
  const showTitleIcon = iconPlacement === "title";
  const showFooterIcon = iconPlacement === "footer";

  const onAction = () => {
    if (item.id === "settings") {
      router.push("/settings");
      return;
    }
    if (item.id === "users") {
      router.push("/home/users");
      return;
    }
    showToast(`${item.actionLabel ?? item.title} is unavailable.`, "info");
  };

  const clickableCard = item.id === "users" && item.status === "complete";

  return (
    <article
      className={`relative flex h-[212px] flex-col overflow-hidden border border-[var(--pf-border)] bg-white px-4 pb-4 pt-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ${
        clickableCard ? "cursor-pointer hover:bg-[#fafafa]" : ""
      }`}
      onClick={clickableCard ? onAction : undefined}
      onKeyDown={
        clickableCard
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onAction();
              }
            }
          : undefined
      }
      role={clickableCard ? "button" : undefined}
      tabIndex={clickableCard ? 0 : undefined}
    >      {item.status === "incomplete" ? (
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

      <div className={`mb-2 flex items-start gap-2 ${item.status ? "pr-10" : ""}`}>
        {showTitleIcon ? (
          <Icon className="mt-0.5 shrink-0 text-[var(--pf-primary-dark)]" size={20} />
        ) : null}
        <h3 className="text-[15px] font-semibold text-[var(--pf-primary-dark)]">{item.title}</h3>
      </div>

      <div className="mb-3 flex min-h-0 flex-1 flex-col">
        <p className="whitespace-pre-line text-[12px] leading-snug text-[var(--pf-text)]">
          {item.description}
        </p>

        {item.linkLabel ? (
          <button
            type="button"
            className="mt-1 self-start text-[12px] text-[var(--pf-link)] hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              showToast("Video tutorials are unavailable.", "info");
            }}
          >
            {item.linkLabel}
          </button>
        ) : null}
      </div>

      {item.actionLabel ? (
        <Button
          variant={item.actionTone === "orange" ? "orange" : "primary"}
          className="mt-auto w-full"
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
        >
          {item.actionLabel}
        </Button>
      ) : null}

      {showFooterIcon ? (
        <div className="mt-auto flex justify-end pt-2">
          <Icon className="text-[var(--pf-primary-dark)]" size={36} strokeWidth={1.5} />
        </div>
      ) : null}

      {item.footerBrand ? <FooterBrand brand={item.footerBrand} /> : null}
    </article>
  );
}
