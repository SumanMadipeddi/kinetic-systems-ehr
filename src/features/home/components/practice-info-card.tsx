"use client";

import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePracticeStore } from "@/store/practice-store";
import { useUiStore } from "@/store/ui-store";

export function PracticeInfoCard() {
  const router = useRouter();
  const practice = usePracticeStore((s) => s.practice);
  const completed = usePracticeStore((s) => s.completed);
  const openPracticeInfoTab = useUiStore((s) => s.openPracticeInfoTab);

  const openForm = () => {
    openPracticeInfoTab();
    router.push("/home/practice-info");
  };

  return (
    <article className="relative flex h-[212px] flex-col overflow-hidden border border-[var(--pf-border)] bg-white p-4">
      {completed ? <div className="pf-complete-ribbon">Complete</div> : null}

      <button
        type="button"
        className="mb-2 flex items-start gap-2 pr-10 text-left"
        onClick={openForm}
      >
        <Stethoscope className="mt-0.5 text-[var(--pf-primary-dark)]" size={20} />
        <h3 className="text-[15px] font-semibold text-[var(--pf-primary-dark)] hover:underline">
          Gather practice information
        </h3>
      </button>

      <button
        type="button"
        className="mb-3 flex-1 whitespace-pre-line text-left text-[12px] leading-snug text-[var(--pf-text)] hover:underline"
        onClick={openForm}
      >
        {`${practice.practiceName}\n${practice.addressLine1}\n${practice.city}, ${practice.state} ${practice.zip}`}
      </button>

      <Button variant="primary" className="w-full" onClick={openForm}>
        View
      </Button>
    </article>
  );
}
