"use client";

import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { usePracticeStore } from "@/store/practice-store";
import { useUiStore } from "@/store/ui-store";

export function PracticeInfoCard() {
  const router = useRouter();
  const practice = usePracticeStore((s) => s.practice);
  const completed = usePracticeStore((s) => s.completed);
  const openPracticeInfoTab = useUiStore((s) => s.openPracticeInfoTab);

  const openForm = () => {
    openPracticeInfoTab();
    router.push("/home/addpracticeinfo");
  };

  return (
    <button
      type="button"
      onClick={openForm}
      className="relative flex h-[212px] w-full flex-col overflow-hidden border border-[var(--pf-border)] bg-white p-4 text-left hover:bg-[#fafafa]"
      aria-label="Gather practice information"
    >
      {completed ? <div className="pf-complete-ribbon">Complete</div> : null}

      <div className="mb-2 flex items-start gap-2 pr-10">
        <Stethoscope className="mt-0.5 text-[var(--pf-primary-dark)]" size={20} />
        <h3 className="text-[15px] font-semibold text-[var(--pf-primary-dark)]">
          Gather practice information
        </h3>
      </div>

      <p className="flex-1 whitespace-pre-line text-[12px] leading-snug text-[var(--pf-text)]">
        {`${practice.practiceName}\n${practice.addressLine1}\n${practice.city}, ${practice.state} ${practice.zip}`}
      </p>
    </button>
  );
}
