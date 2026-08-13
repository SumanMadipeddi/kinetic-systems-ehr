"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRACTICE_ACCESS_CODE } from "@/store/users-store";

type Props = {
  open: boolean;
  fullName: string;
  email: string;
  onClose: () => void;
};

export function UserAddedModal({ open, fullName, email, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[var(--pf-overlay)] pt-16"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="User has been added"
        className="w-[520px] border border-[var(--pf-border)] bg-white shadow-lg"
      >
        <div className="flex items-center justify-between bg-[#e8f5e9] px-4 py-3">
          <div className="flex items-center gap-2 text-[#2e7d32]">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#43a047] text-white">
              <Check size={14} strokeWidth={3} />
            </span>
            <h2 className="text-[15px] font-semibold text-[#333]">User has been added</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="text-[#777] hover:text-[#333]"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 px-4 py-4 text-[13px] leading-relaxed text-[var(--pf-text)]">
          <p>
            Invitation to <strong>{fullName}</strong> has been sent to:{" "}
            <strong>{email}</strong>
          </p>
          <p>New users will need to enter Practice access code to activate accounts.</p>
          <p>
            Your practice access code is <strong>{PRACTICE_ACCESS_CODE}</strong>
          </p>
          <p>
            For security measures, it is recommended that the administrator does not share
            this code electronically with the new user.
          </p>
        </div>

        <div className="flex justify-end border-t border-[var(--pf-border-light)] px-4 py-3">
          <Button type="button" variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
