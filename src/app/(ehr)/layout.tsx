import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { RightPromoRail } from "@/components/layout/right-promo-rail";
import { KnowledgeCenter } from "@/components/layout/knowledge-center";
import { ToastHost } from "@/components/ui/toast";

export default function EhrLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black">
      <Sidebar />
      {/* TopNav ends at the promo rail; ad column is full viewport height */}
      <div className="flex min-w-0 flex-1 flex-col bg-[var(--pf-page-background)]">
        <TopNav />
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>
      <RightPromoRail />
      <KnowledgeCenter />
      <ToastHost />
    </div>
  );
}
