"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { addDays, addMonths, addYears, format, parse } from "date-fns";
import { Calendar, Info, Search } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { PATIENTS } from "@/mocks/patients";
import { PROVIDERS } from "@/mocks/providers";
import { useUiStore } from "@/store/ui-store";
import { patientDisplayName } from "@/types/patient";
import { REFERENCE_TODAY } from "@/features/schedule/utils/calendar";
import { cn } from "@/lib/cn";

const DETAILS_MAX = 255;
const AUTHOR_NAME = "suman Ma";
const CURRENT_USER_PROVIDER_ID = "prov-suman-ma";

function isoToDisplay(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

function displayToIso(mmddyyyy: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(mmddyyyy);
  if (!m) return null;
  return `${m[3]}-${m[1]}-${m[2]}`;
}

function shiftReminder(iso: string, kind: "today" | "d" | "w" | "m" | "y"): string {
  if (kind === "today") return REFERENCE_TODAY;
  const base = parse(iso, "yyyy-MM-dd", new Date(2026, 0, 1));
  if (kind === "d") return format(addDays(base, 1), "yyyy-MM-dd");
  if (kind === "w") return format(addDays(base, 7), "yyyy-MM-dd");
  if (kind === "m") return format(addMonths(base, 1), "yyyy-MM-dd");
  return format(addYears(base, 1), "yyyy-MM-dd");
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TaskModal({ open, onClose }: Props) {
  const showToast = useUiStore((s) => s.showToast);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [details, setDetails] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [assigneeQuery, setAssigneeQuery] = useState("");
  const [showAssigneeResults, setShowAssigneeResults] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [patientQuery, setPatientQuery] = useState("");
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [reminderIso, setReminderIso] = useState(REFERENCE_TODAY);
  const [dateText, setDateText] = useState(isoToDisplay(REFERENCE_TODAY));
  const [activeShortcut, setActiveShortcut] = useState<"today" | "d" | "w" | "m" | "y" | null>(
    "today",
  );
  const [detailsError, setDetailsError] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDetails("");
    setAssigneeId("");
    setAssigneeQuery("");
    setShowAssigneeResults(false);
    setPatientId("");
    setPatientQuery("");
    setShowPatientResults(false);
    setReminderIso(REFERENCE_TODAY);
    setDateText(isoToDisplay(REFERENCE_TODAY));
    setActiveShortcut("today");
    setDetailsError(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = () => {
      setShowAssigneeResults(false);
      setShowPatientResults(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const assigneeMatches = useMemo(() => {
    const q = assigneeQuery.trim().toLowerCase();
    if (!q) return PROVIDERS;
    return PROVIDERS.filter((p) => p.displayName.toLowerCase().includes(q));
  }, [assigneeQuery]);

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

  const applyReminder = (kind: "today" | "d" | "w" | "m" | "y") => {
    const next = shiftReminder(reminderIso, kind);
    setReminderIso(next);
    setDateText(isoToDisplay(next));
    setActiveShortcut(kind);
  };

  const save = () => {
    const trimmed = details.trim();
    if (!trimmed) {
      setDetailsError(true);
      return;
    }
    showToast("Task created.", "success");
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New Task"
      onClose={onClose}
      width={520}
      height={520}
      titleExtra={
        <button
          type="button"
          aria-label="Task help"
          className="text-white/90 hover:text-white"
          onClick={() => showToast("Create a reminder task for yourself or a colleague.", "info")}
        >
          <Info size={15} />
        </button>
      }
      footer={
        <>
          <Button variant="pillOutline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="pill" onClick={save}>
            Save
          </Button>
        </>
      }
    >
      <form
        className="space-y-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div>
          <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">
            Details<span className="text-[var(--pf-required)]">*</span>
          </div>
          <div className="relative">
            <textarea
              className={cn(
                "min-h-[88px] w-full resize-none border border-[var(--pf-border)] px-2 py-1.5 pr-12 text-[13px] outline-none focus:border-[var(--pf-primary)]",
                detailsError && "border-red-500",
              )}
              placeholder="Enter task details"
              maxLength={DETAILS_MAX}
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                if (detailsError && e.target.value.trim()) setDetailsError(false);
              }}
              aria-label="Task details"
            />
            <span className="pointer-events-none absolute bottom-2 right-2 text-[11px] text-[var(--pf-text-muted)]">
              {details.length}/{DETAILS_MAX}
            </span>
          </div>
          {detailsError ? (
            <p className="mt-1 text-[11px] text-red-600">Details are required.</p>
          ) : null}
        </div>

        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase text-[#555]">Assign to</span>
            <button
              type="button"
              className="text-[12px] text-[var(--pf-link)] hover:underline"
              onClick={() => {
                const me = PROVIDERS.find((p) => p.id === CURRENT_USER_PROVIDER_ID);
                if (!me) return;
                setAssigneeId(me.id);
                setAssigneeQuery(AUTHOR_NAME);
                setShowAssigneeResults(false);
              }}
            >
              Assign to me
            </button>
          </div>
          <div
            className="relative"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <input
              className="h-8 w-full border border-[var(--pf-border)] px-2 pr-8 text-[13px] outline-none focus:border-[var(--pf-primary)]"
              placeholder="Search"
              value={assigneeQuery}
              onChange={(e) => {
                setAssigneeQuery(e.target.value);
                setAssigneeId("");
                setShowAssigneeResults(true);
              }}
              onFocus={() => setShowAssigneeResults(true)}
              aria-label="Assign to"
            />
            <Search
              size={14}
              className="pointer-events-none absolute right-2 top-2 text-[var(--pf-text-muted)]"
            />
            {showAssigneeResults ? (
              <div className="absolute left-0 right-0 top-full z-10 mt-0.5 max-h-32 overflow-auto border border-[var(--pf-border)] bg-white shadow-md">
                {assigneeMatches.length === 0 ? (
                  <div className="px-2 py-1.5 text-[12px] text-[var(--pf-text-muted)]">
                    No matches
                  </div>
                ) : (
                  assigneeMatches.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={cn(
                        "flex w-full px-2 py-1.5 text-left text-[12px] hover:bg-[#f3f9fc]",
                        assigneeId === p.id && "bg-[var(--pf-tab-active-bg)]",
                      )}
                      onClick={() => {
                        setAssigneeId(p.id);
                        setAssigneeQuery(
                          p.id === CURRENT_USER_PROVIDER_ID ? AUTHOR_NAME : p.displayName,
                        );
                        setShowAssigneeResults(false);
                      }}
                    >
                      {p.id === CURRENT_USER_PROVIDER_ID ? AUTHOR_NAME : p.displayName}
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">
            Regarding patient
          </div>
          <div
            className="relative flex"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <input
              className="h-8 min-w-0 flex-1 border border-[var(--pf-border)] px-2 text-[13px] outline-none focus:border-[var(--pf-primary)]"
              placeholder="Search patient name, record number, phone, DOB or SSN"
              value={patientQuery}
              onChange={(e) => {
                setPatientQuery(e.target.value);
                setPatientId("");
                setShowPatientResults(true);
              }}
              onFocus={() => setShowPatientResults(true)}
              aria-label="Regarding patient"
            />
            <button
              type="button"
              aria-label="Search patients"
              className="flex h-8 w-8 shrink-0 items-center justify-center border border-l-0 border-[var(--pf-border)] bg-[#f7f7f7] text-[var(--pf-text-muted)] hover:bg-[#efefef]"
              onClick={() => setShowPatientResults(true)}
            >
              <Search size={14} />
            </button>
            {showPatientResults ? (
              <div className="absolute left-0 right-0 top-full z-10 mt-0.5 max-h-32 overflow-auto border border-[var(--pf-border)] bg-white shadow-md">
                {patientMatches.length === 0 ? (
                  <div className="px-2 py-1.5 text-[12px] text-[var(--pf-text-muted)]">
                    No matches
                  </div>
                ) : (
                  patientMatches.map((p) => (
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
                        setShowPatientResults(false);
                      }}
                    >
                      <span>{patientDisplayName(p)}</span>
                      <span className="text-[var(--pf-text-muted)]">{p.prn}</span>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">Reminder date</div>
          <div className="relative">
            <input
              className="h-8 w-full border border-[var(--pf-border)] px-2 pr-8 text-[13px] outline-none focus:border-[var(--pf-primary)]"
              value={dateText}
              onChange={(e) => {
                setDateText(e.target.value);
                setActiveShortcut(null);
                const iso = displayToIso(e.target.value);
                if (iso) setReminderIso(iso);
              }}
              onBlur={() => {
                const iso = displayToIso(dateText);
                if (iso) {
                  setReminderIso(iso);
                  setDateText(isoToDisplay(iso));
                } else {
                  setDateText(isoToDisplay(reminderIso));
                }
              }}
              aria-label="Reminder date"
            />
            <button
              type="button"
              aria-label="Open calendar"
              className="absolute right-1.5 top-1.5 text-[var(--pf-text-muted)] hover:text-[var(--pf-text)]"
              onClick={() => dateInputRef.current?.showPicker?.()}
            >
              <Calendar size={15} />
            </button>
            <input
              ref={dateInputRef}
              type="date"
              className="sr-only"
              value={reminderIso}
              onChange={(e) => {
                const iso = e.target.value;
                if (!iso) return;
                setReminderIso(iso);
                setDateText(isoToDisplay(iso));
                setActiveShortcut(iso === REFERENCE_TODAY ? "today" : null);
              }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(
              [
                ["today", "Today"],
                ["d", "+1 d"],
                ["w", "+1 w"],
                ["m", "+1 m"],
                ["y", "+1 y"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={cn(
                  "h-7 min-w-[52px] border px-2 text-[12px]",
                  activeShortcut === key
                    ? "border-[var(--pf-primary-dark)] text-[var(--pf-primary-dark)]"
                    : "border-[var(--pf-primary)] text-[var(--pf-primary)] hover:bg-[#f5fbfe]",
                )}
                onClick={() => applyReminder(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">Author</div>
          <div className="text-[13px] text-[var(--pf-text)]">
            <span className="mr-1.5">•</span>
            {AUTHOR_NAME}
          </div>
        </div>

        <div>
          <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">Task type</div>
          <div className="text-[13px] text-[var(--pf-text)]">
            <span className="mr-1.5">•</span>
            Reminder
          </div>
        </div>
      </form>
    </Modal>
  );
}
