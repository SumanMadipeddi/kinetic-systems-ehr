"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { PATIENTS } from "@/mocks/patients";
import { useUiStore } from "@/store/ui-store";
import { patientDisplayName } from "@/types/patient";
import { cn } from "@/lib/cn";

const RECIPIENTS = [
  { id: "prov-suman-ma", name: "Ma, suman" },
  { id: "prov-suman-madipeddi", name: "Madipeddi, Suman" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function NewMessageModal({ open, onClose }: Props) {
  const showToast = useUiStore((s) => s.showToast);
  const [toScope, setToScope] = useState("in-practice");
  const [recipientQuery, setRecipientQuery] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [showRecipients, setShowRecipients] = useState(false);
  const [patientQuery, setPatientQuery] = useState("");
  const [patientId, setPatientId] = useState("");
  const [showPatients, setShowPatients] = useState(false);
  const [addToChart, setAddToChart] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    if (!open) return;
    setToScope("in-practice");
    setRecipientQuery("");
    setRecipientId("");
    setShowRecipients(true);
    setPatientQuery("");
    setPatientId("");
    setShowPatients(false);
    setAddToChart(false);
    setSubject("");
    setMessage("");
    setUrgent(false);
  }, [open]);

  const recipientMatches = useMemo(() => {
    const q = recipientQuery.trim().toLowerCase();
    if (!q) return RECIPIENTS;
    return RECIPIENTS.filter((r) => r.name.toLowerCase().includes(q));
  }, [recipientQuery]);

  const patientMatches = useMemo(() => {
    const q = patientQuery.trim().toLowerCase();
    if (!q) return PATIENTS;
    return PATIENTS.filter((p) => {
      const hay = [
        p.firstName,
        p.lastName,
        patientDisplayName(p),
        p.phone,
        p.dateOfBirth,
        p.prn,
        p.last4Ssn,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [patientQuery]);

  const canSend = Boolean(recipientId && subject.trim() && message.trim());

  const send = () => {
    if (!canSend) return;
    showToast("Message sent.", "success");
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New Message"
      onClose={onClose}
      width={560}
      height={560}
      footer={
        <>
          <Button variant="pillOutline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-[12px] text-[var(--pf-text)]">
              <input
                type="checkbox"
                className="pf-filter-check h-4 w-4"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
              />
              Urgent
            </label>
            <Button
              variant="pill"
              disabled={!canSend}
              className={cn(!canSend && "border-[#d0d0d0] bg-[#e8e8e8] text-[#888]")}
              onClick={send}
            >
              Send
            </Button>
          </div>
        </>
      }
    >
      <form
        className="space-y-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <div>
          <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">
            To<span className="text-[var(--pf-required)]">*</span>
          </div>
          <div className="mb-2 flex items-center gap-3">
            <select
              className="h-8 min-w-[140px] border border-[var(--pf-border)] bg-white px-2 text-[13px]"
              value={toScope}
              onChange={(e) => setToScope(e.target.value)}
              aria-label="Recipient scope"
            >
              <option value="in-practice">In practice</option>
              <option value="outside">Outside practice</option>
            </select>
            <div className="flex-1" />
            <button
              type="button"
              className="text-[12px] text-[var(--pf-link)] hover:underline"
              onClick={() => {
                setRecipientId(RECIPIENTS[0].id);
                setRecipientQuery(RECIPIENTS[0].name);
                setShowRecipients(false);
                showToast("Sent to all in practice.", "info");
              }}
            >
              Send to all in practice
            </button>
          </div>
          <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
            <input
              className="h-8 w-full border border-[var(--pf-border)] px-2 pr-8 text-[13px] outline-none focus:border-[var(--pf-primary)]"
              placeholder="Search"
              value={recipientQuery}
              onChange={(e) => {
                setRecipientQuery(e.target.value);
                setRecipientId("");
                setShowRecipients(true);
              }}
              onFocus={() => setShowRecipients(true)}
              aria-label="Search recipients"
            />
            <Search
              size={14}
              className="pointer-events-none absolute right-2 top-2 text-[var(--pf-text-muted)]"
            />
            {showRecipients ? (
              <div className="absolute left-0 right-0 top-full z-10 mt-0 max-h-40 overflow-auto border border-t-0 border-[var(--pf-border)] bg-white shadow-md">
                {recipientMatches.length === 0 ? (
                  <div className="px-2 py-1.5 text-[12px] text-[var(--pf-text-muted)]">
                    No matches
                  </div>
                ) : (
                  recipientMatches.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={cn(
                        "flex w-full px-2 py-1.5 text-left text-[12px] hover:bg-[#e8f4fb]",
                        recipientId === r.id && "bg-[#e8f4fb]",
                      )}
                      onClick={() => {
                        setRecipientId(r.id);
                        setRecipientQuery(r.name);
                        setShowRecipients(false);
                      }}
                    >
                      {r.name}
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <div
            className="relative flex items-center gap-2"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="relative flex min-w-0 flex-1">
              <input
                className="h-8 min-w-0 flex-1 border border-[var(--pf-border)] px-2 text-[13px] outline-none focus:border-[var(--pf-primary)]"
                placeholder="Search patient name, record number, phone, DOB or SSN"
                value={patientQuery}
                onChange={(e) => {
                  setPatientQuery(e.target.value);
                  setPatientId("");
                  setShowPatients(true);
                }}
                onFocus={() => setShowPatients(true)}
                aria-label="Search patient"
              />
              <button
                type="button"
                aria-label="Search patients"
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-l-0 border-[var(--pf-border)] bg-[#f7f7f7] text-[var(--pf-text-muted)] hover:bg-[#efefef]"
                onClick={() => setShowPatients(true)}
              >
                <Search size={14} />
              </button>
              {showPatients ? (
                <div className="absolute left-0 right-0 top-full z-10 mt-0.5 max-h-32 overflow-auto border border-[var(--pf-border)] bg-white shadow-md">
                  {patientMatches.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between px-2 py-1.5 text-left text-[12px] hover:bg-[#f3f9fc]",
                        patientId === p.id && "bg-[var(--pf-tab-active-bg)]",
                      )}
                      onClick={() => {
                        setPatientId(p.id);
                        setPatientQuery(patientDisplayName(p));
                        setShowPatients(false);
                      }}
                    >
                      <span>{patientDisplayName(p)}</span>
                      <span className="text-[var(--pf-text-muted)]">{p.prn}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <label className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12px] text-[var(--pf-text)]">
              <input
                type="checkbox"
                className="pf-filter-check h-4 w-4"
                checked={addToChart}
                onChange={(e) => setAddToChart(e.target.checked)}
              />
              Add to chart
            </label>
          </div>
        </div>

        <div>
          <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">
            Subject<span className="text-[var(--pf-required)]">*</span>
          </div>
          <input
            className="h-8 w-full border border-[var(--pf-border)] px-2 text-[13px] outline-none focus:border-[var(--pf-primary)]"
            placeholder="Enter a subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-label="Subject"
          />
        </div>

        <div>
          <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">
            Message<span className="text-[var(--pf-required)]">*</span>
          </div>
          <textarea
            className="min-h-[140px] w-full resize-none border border-[var(--pf-border)] px-2 py-1.5 text-[13px] outline-none focus:border-[var(--pf-primary)]"
            placeholder="Enter a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Message"
          />
        </div>
      </form>
    </Modal>
  );
}
