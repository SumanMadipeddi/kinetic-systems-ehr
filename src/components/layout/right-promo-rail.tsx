"use client";

import { usePathname } from "next/navigation";
import { useUiStore } from "@/store/ui-store";

type PromoVariant = "home" | "schedule" | "tasks" | "charts" | "settings" | "default";

function resolveVariant(pathname: string): PromoVariant {
  if (pathname.startsWith("/home")) return "home";
  if (pathname.startsWith("/schedule")) return "schedule";
  if (pathname.startsWith("/tasks")) return "tasks";
  if (pathname.startsWith("/charts")) return "charts";
  if (pathname.startsWith("/settings")) return "settings";
  return "default";
}

const COPY: Record<
  PromoVariant,
  { title: string; body: string; cta: string }
> = {
  home: {
    title: "Did you know?",
    body: "Practice Fusion offers EPCS in all 50 states. ePrescribing controlled substances saves time and keeps your workflow in one place.",
    cta: "Learn more now",
  },
  schedule: {
    title: "Streamline Check-In",
    body: "Reduce paperwork and speed up patient arrival with digital check-in tools.",
    cta: "Learn More",
  },
  tasks: {
    title: "Stay connected",
    body: "Keep up on digital health. Follow Practice Fusion on LinkedIn.",
    cta: "Follow us",
  },
  charts: {
    title: "Did you know?",
    body: "Practice Fusion offers EPCS in all 50 states. ePrescribing controlled substances saves time.",
    cta: "Learn more now",
  },
  settings: {
    title: "Brand / DAW",
    body: "Select 'Brand Medically Necessary / DAW' to ensure the prescription is filled as written.",
    cta: "Learn more",
  },
  default: {
    title: "What's new",
    body: "A better document experience is here.",
    cta: "See what's new",
  },
};

export function RightPromoRail() {
  const pathname = usePathname();
  const showToast = useUiStore((s) => s.showToast);
  const variant = resolveVariant(pathname);
  const promo = COPY[variant];

  return (
    <aside
      className="relative flex h-full w-[160px] min-w-[170px] max-w-[170px] shrink-0 flex-col overflow-y-auto border-l border-[var(--pf-border)] bg-[#fafafa]"
      aria-label="Advertisement"
    >
      <div className="ad-label mb-[2px] px-5 pt-3 text-[11px] leading-[13px] text-[#666]">
        Advertisement
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
        <h2 className="mb-3 font-serif text-[22px] font-normal leading-tight text-[#333]">
          {promo.title}
        </h2>
        <p className="mb-6 text-[13px] leading-relaxed text-[#555]">{promo.body}</p>
        <button
          type="button"
          className="h-9 rounded bg-[var(--pf-orange)] px-4 text-[13px] font-semibold text-white"
          onClick={() => showToast("Promotional links are unavailable.", "info")}
        >
          {promo.cta}
        </button>
      </div>
    </aside>
  );
}
