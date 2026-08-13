"use client";

import { EhrSessionGuard } from "@/components/layout/ehr-session-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { RightPromoRail } from "@/components/layout/right-promo-rail";
import { KnowledgeCenter } from "@/components/layout/knowledge-center";
import { ToastHost } from "@/components/ui/toast";

export default function EhrLayout({ children }: { children: React.ReactNode }) {
  return (
    <EhrSessionGuard>
      <div className="flex h-screen w-screen overflow-hidden bg-black">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col bg-[var(--pf-page-background)]">
          <TopNav />
          <main className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>
        </div>
        <RightPromoRail />
        <KnowledgeCenter />
        <ToastHost />
      </div>
    </EhrSessionGuard>
  );
}
