"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PATIENTS } from "@/mocks/patients";
import { PROVIDERS } from "@/mocks/providers";
import { FACILITIES } from "@/mocks/facilities";
import { APPOINTMENT_TYPES } from "@/mocks/appointment-types";
import { useScheduleStore } from "@/store/schedule-store";
import { useUiStore } from "@/store/ui-store";
import { patientDisplayName } from "@/types/patient";
import { addMinutesToTime, formatTime12h } from "../utils/calendar";
import {
  blockTimeSchema,
  patientAppointmentSchema,
  type BlockTimeFormValues,
  type PatientAppointmentFormValues,
} from "../schemas/appointment.schema";
import { cn } from "@/lib/cn";

type ModalTab = "with-patient" | "block-time" | "block-range";

function displayDateToIso(mmddyyyy: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(mmddyyyy);
  if (!m) return null;
  return `${m[3]}-${m[1]}-${m[2]}`;
}

function isoToDisplay(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

function parseTimeInput(value: string): string | null {
  const trimmed = value.trim();
  const m24 = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (m24) {
    const h = Number(m24[1]);
    const min = Number(m24[2]);
    if (h >= 0 && h <= 23 && min >= 0 && min <= 59) {
      return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    }
  }
  const m12 = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(trimmed);
  if (m12) {
    let h = Number(m12[1]);
    const min = Number(m12[2]);
    const ampm = m12[3].toUpperCase();
    if (h < 1 || h > 12 || min < 0 || min > 59) return null;
    if (ampm === "AM") {
      if (h === 12) h = 0;
    } else if (h !== 12) {
      h += 12;
    }
    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  }
  return null;
}

export function AppointmentModal() {
  const open = useUiStore((s) => s.appointmentModalOpen);
  const draft = useUiStore((s) => s.appointmentDraft);
  const close = useUiStore((s) => s.closeAppointmentModal);
  const showToast = useUiStore((s) => s.showToast);
  const selectedDate = useScheduleStore((s) => s.selectedDate);
  const selectedFacilityId = useScheduleStore((s) => s.selectedFacilityId);
  const selectedProviderIds = useScheduleStore((s) => s.selectedProviderIds);
  const addPatientAppointment = useScheduleStore((s) => s.addPatientAppointment);
  const addBlockTime = useScheduleStore((s) => s.addBlockTime);

  const [tab, setTab] = useState<ModalTab>("with-patient");
  const [query, setQuery] = useState("");
  const [dateText, setDateText] = useState(isoToDisplay(selectedDate));
  const [blockDateText, setBlockDateText] = useState(isoToDisplay(selectedDate));
  const [blockTimeText, setBlockTimeText] = useState("09:00 AM");

  const defaultProvider = selectedProviderIds[0] ?? PROVIDERS[0]?.id ?? "";

  const form = useForm<PatientAppointmentFormValues>({
    resolver: zodResolver(patientAppointmentSchema),
    defaultValues: {
      patientId: "",
      patientName: "",
      providerId: defaultProvider,
      facilityId: selectedFacilityId,
      appointmentType: "follow-up",
      startDate: selectedDate,
      startTime: "09:00",
      durationMinutes: 30,
      chiefComplaint: "",
      notes: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const blockForm = useForm<BlockTimeFormValues>({
    resolver: zodResolver(blockTimeSchema),
    defaultValues: {
      providerId: defaultProvider,
      facilityId: selectedFacilityId,
      startDate: selectedDate,
      startTime: "09:00",
      durationMinutes: 30,
      reason: "",
      description: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const selectedPatientId = form.watch("patientId");
  const startTime = form.watch("startTime");
  const durationMinutes = form.watch("durationMinutes");
  const blockDescription = blockForm.watch("description") ?? "";
  const selectedPatient = PATIENTS.find((p) => p.id === selectedPatientId);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
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
  }, [query]);

  const endTimeLabel = formatTime12h(
    addMinutesToTime(startTime || "09:00", Number(durationMinutes) || 30),
  );

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) {
      const startDate = draft?.date ?? selectedDate;
      const nextStartTime = draft?.time ?? "09:00";
      const providerId = draft?.providerId ?? defaultProvider;
      form.reset({
        patientId: "",
        patientName: "",
        providerId,
        facilityId: selectedFacilityId,
        appointmentType: "follow-up",
        startDate,
        startTime: nextStartTime,
        durationMinutes: 30,
        chiefComplaint: "",
        notes: "",
      });
      blockForm.reset({
        providerId,
        facilityId: selectedFacilityId,
        startDate,
        startTime: "09:00",
        durationMinutes: 30,
        reason: "",
        description: "",
      });
      setDateText(isoToDisplay(startDate));
      setBlockDateText(isoToDisplay(startDate));
      setBlockTimeText("09:00 AM");
      setQuery("");
      setTab("with-patient");
    }
    wasOpen.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSavePatient = form.handleSubmit((data) => {
    const entry = addPatientAppointment(data);
    showToast(`Appointment saved for ${entry.patientName}.`, "success");
    close();
  });

  const onSaveBlockTime = blockForm.handleSubmit((data) => {
    addBlockTime({
      ...data,
      description: data.description?.trim() || undefined,
    });
    showToast("Block time saved.", "success");
    close();
  });

  const onSave = () => {
    if (tab === "with-patient") {
      void onSavePatient();
      return;
    }
    if (tab === "block-time") {
      void onSaveBlockTime();
      return;
    }
    showToast("Block range cannot be saved from this dialog.", "info");
  };

  const stepTime = (delta: number) => {
    const next = addMinutesToTime(form.getValues("startTime"), delta);
    form.setValue("startTime", next, { shouldValidate: true });
  };

  return (
    <Modal
      open={open}
      title="New appointment"
      onClose={close}
      width={480}
      height={480}
      footer={
        <>
          <Button variant="pillOutline" onClick={close}>
            Cancel
          </Button>
          <Button variant="pill" data-testid="save-appointment" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <div className="border-b border-[var(--pf-border-light)] px-2">
        {(
          [
            ["with-patient", "With patient"],
            ["block-time", "Block time"],
            ["block-range", "Block range"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn(
              "px-4 py-2 text-[13px] text-[var(--pf-modal-header)]",
              tab === id &&
                "border-b-2 border-[var(--pf-modal-header)] bg-[var(--pf-tab-active-bg)]",
            )}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "with-patient" ? (
        <form
          className="space-y-3 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void onSavePatient();
          }}
        >
          <input type="hidden" data-testid="patient-id" value={selectedPatientId} readOnly />
          <div>
            <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">
              Patient <span className="text-[var(--pf-required)]">*</span>
            </div>
            <div className="relative">
              <input
                className="h-8 w-full border border-[var(--pf-border)] px-2 pr-8 text-[13px]"
                placeholder="Search patient name, record number, phone, DOB or SSN"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search patients"
              />
              <Search
                size={14}
                className="pointer-events-none absolute right-2 top-2 text-[var(--pf-text-muted)]"
              />
            </div>
            {form.formState.errors.patientId ? (
              <p className="mt-1 text-[11px] text-red-600" data-testid="patient-error">
                {form.formState.errors.patientId.message}
              </p>
            ) : null}

            <div className="mt-2 max-h-28 overflow-auto border border-[var(--pf-border-light)]">
              {matches.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between px-2 py-1.5 text-left text-[12px] hover:bg-[#f3f9fc]",
                    selectedPatientId === p.id && "bg-[var(--pf-tab-active-bg)]",
                  )}
                  data-testid={`patient-option-${p.id}`}
                  onClick={() => {
                    form.setValue("patientId", p.id, { shouldValidate: true });
                    form.setValue("patientName", patientDisplayName(p), {
                      shouldValidate: true,
                    });
                    setQuery(patientDisplayName(p));
                  }}
                >
                  <span>{patientDisplayName(p)}</span>
                  <span className="text-[var(--pf-text-muted)]">{p.prn}</span>
                </button>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-5 gap-2 border border-[var(--pf-border-light)] bg-[#fafafa] p-2 text-[11px]">
              <div>
                <div className="text-[var(--pf-text-muted)]">Name</div>
                <div>{selectedPatient ? patientDisplayName(selectedPatient) : "First Last"}</div>
              </div>
              <div>
                <div className="text-[var(--pf-text-muted)]">Phone</div>
                <div>{selectedPatient?.phone ?? "###-###-####"}</div>
              </div>
              <div>
                <div className="text-[var(--pf-text-muted)]">DOB</div>
                <div>{selectedPatient?.dateOfBirth ?? "MM/DD/YYYY"}</div>
              </div>
              <div>
                <div className="text-[var(--pf-text-muted)]">Last 4 SSN</div>
                <div>
                  {selectedPatient ? `###-##-${selectedPatient.last4Ssn}` : "###-##-####"}
                </div>
              </div>
              <div>
                <div className="text-[var(--pf-text-muted)]">PRN</div>
                <div>{selectedPatient?.prn ?? "AA123456"}</div>
              </div>
            </div>
            <button
              type="button"
              className="mt-1 cursor-default text-[12px] text-[var(--pf-text-muted)]"
              disabled
              title="Adding patients is unavailable"
            >
              Add new patient
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select
              id="appointmentType"
              label="Type"
              requiredMark
              options={APPOINTMENT_TYPES.map((t) => ({ value: t.id, label: t.label }))}
              error={form.formState.errors.appointmentType?.message}
              {...form.register("appointmentType")}
            />
            <Input
              id="duration"
              label="Duration"
              requiredMark
              type="number"
              error={form.formState.errors.durationMinutes?.message}
              {...form.register("durationMinutes", { valueAsNumber: true })}
            />
            <Select
              id="providerId"
              label="Provider"
              requiredMark
              options={PROVIDERS.map((p) => ({ value: p.id, label: p.displayName }))}
              error={form.formState.errors.providerId?.message}
              {...form.register("providerId")}
            />
          </div>

          <div className="grid grid-cols-4 gap-3 items-end">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase text-[#555]">
                Date <span className="text-[var(--pf-required)]">*</span>
              </span>
              <input
                className="h-8 border border-[var(--pf-border)] px-2 text-[13px]"
                value={dateText}
                onChange={(e) => {
                  setDateText(e.target.value);
                  const iso = displayDateToIso(e.target.value);
                  if (iso) form.setValue("startDate", iso, { shouldValidate: true });
                }}
                onBlur={() => {
                  const iso = displayDateToIso(dateText);
                  if (!iso) {
                    setDateText(isoToDisplay(form.getValues("startDate")));
                  }
                }}
              />
              <input
                type="date"
                className="sr-only"
                value={form.watch("startDate")}
                onChange={(e) => {
                  form.setValue("startDate", e.target.value, { shouldValidate: true });
                  setDateText(isoToDisplay(e.target.value));
                }}
              />
              {form.formState.errors.startDate ? (
                <span className="text-[11px] text-red-600">
                  {form.formState.errors.startDate.message}
                </span>
              ) : null}
            </label>

            <div>
              <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">
                Time <span className="text-[var(--pf-required)]">*</span>
              </div>
              <div className="flex h-8 items-stretch border border-[var(--pf-border)]">
                <button
                  type="button"
                  className="w-8 border-r border-[var(--pf-border)]"
                  onClick={() => stepTime(-15)}
                >
                  -
                </button>
                <div
                  className="flex flex-1 items-center justify-center text-[13px]"
                  data-testid="appointment-time"
                >
                  {formatTime12h(startTime || "09:00")}
                </div>
                <button
                  type="button"
                  className="w-8 border-l border-[var(--pf-border)]"
                  data-testid="time-plus"
                  onClick={() => stepTime(15)}
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <div className="mb-1 text-[11px] font-bold uppercase text-[#555]">End time</div>
              <div className="flex h-8 items-center border border-[var(--pf-border)] bg-[#f7f7f7] px-2 text-[13px]">
                {endTimeLabel}
              </div>
            </div>

            <label className="mb-1 flex items-center gap-2 text-[12px]">
              <input type="checkbox" />
              Repeat
            </label>
          </div>

          <Select
            id="facilityId"
            label="Facility"
            requiredMark
            options={FACILITIES.map((f) => ({ value: f.id, label: f.name }))}
            error={form.formState.errors.facilityId?.message}
            {...form.register("facilityId")}
          />

          <Input
            id="chiefComplaint"
            label="Chief complaint"
            {...form.register("chiefComplaint")}
          />
        </form>
      ) : tab === "block-time" ? (
        <form
          className="space-y-3 p-4 text-[13px]"
          onSubmit={(e) => {
            e.preventDefault();
            void onSaveBlockTime();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Block time for"
              requiredMark
              options={PROVIDERS.map((p) => ({ value: p.id, label: p.displayName }))}
              error={blockForm.formState.errors.providerId?.message}
              {...blockForm.register("providerId")}
            />
            <Select
              label="Facility"
              requiredMark
              options={FACILITIES.map((f) => ({ value: f.id, label: f.name }))}
              error={blockForm.formState.errors.facilityId?.message}
              {...blockForm.register("facilityId")}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase text-[#555]">
                Date <span className="text-[var(--pf-required)]">*</span>
              </span>
              <input
                className="h-8 border border-[var(--pf-border)] px-2 text-[13px]"
                value={blockDateText}
                onChange={(e) => {
                  setBlockDateText(e.target.value);
                  const iso = displayDateToIso(e.target.value);
                  if (iso) {
                    blockForm.setValue("startDate", iso, { shouldValidate: true });
                  }
                }}
              />
              {blockForm.formState.errors.startDate ? (
                <span className="text-[11px] text-red-600">
                  {blockForm.formState.errors.startDate.message}
                </span>
              ) : null}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase text-[#555]">
                Time <span className="text-[var(--pf-required)]">*</span>
              </span>
              <input
                className="h-8 border border-[var(--pf-border)] px-2 text-[13px]"
                data-testid="block-time-input"
                value={blockTimeText}
                onChange={(e) => {
                  setBlockTimeText(e.target.value);
                  const parsed = parseTimeInput(e.target.value);
                  if (parsed) {
                    blockForm.setValue("startTime", parsed, { shouldValidate: true });
                  }
                }}
                onBlur={() => {
                  const parsed = parseTimeInput(blockTimeText);
                  if (parsed) {
                    setBlockTimeText(formatTime12h(parsed));
                    blockForm.setValue("startTime", parsed, { shouldValidate: true });
                  } else {
                    setBlockTimeText(formatTime12h(blockForm.getValues("startTime")));
                  }
                }}
              />
              {blockForm.formState.errors.startTime ? (
                <span className="text-[11px] text-red-600">
                  {blockForm.formState.errors.startTime.message}
                </span>
              ) : null}
            </label>
            <Input
              id="block-duration"
              label="Duration"
              requiredMark
              type="number"
              error={blockForm.formState.errors.durationMinutes?.message}
              {...blockForm.register("durationMinutes", { valueAsNumber: true })}
            />
          </div>
          <Select
            id="block-reason"
            label="Reason"
            requiredMark
            placeholder="Select..."
            options={[
              { value: "Administrative", label: "Administrative" },
              { value: "Out of office", label: "Out of office" },
              { value: "Meeting", label: "Meeting" },
            ]}
            error={blockForm.formState.errors.reason?.message}
            {...blockForm.register("reason")}
          />
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase text-[#555]">Description</span>
            <textarea
              className="min-h-20 border border-[var(--pf-border)] p-2 text-[13px]"
              maxLength={100}
              {...blockForm.register("description")}
            />
            <span className="self-end text-[11px] text-[var(--pf-text-muted)]">
              {blockDescription.length}/100
            </span>
          </label>
        </form>
      ) : (
        <div className="space-y-3 p-4 text-[13px]">
          <p className="text-[var(--pf-text-muted)]">
            Use Block time to reserve a single day interval on the schedule.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Block time for"
              options={PROVIDERS.map((p) => ({ value: p.id, label: p.displayName }))}
              defaultValue={defaultProvider}
              disabled
            />
            <Select
              label="Facility"
              options={FACILITIES.map((f) => ({ value: f.id, label: f.name }))}
              defaultValue={selectedFacilityId}
              disabled
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Start date" requiredMark defaultValue={isoToDisplay(selectedDate)} disabled />
            <Input label="Time" requiredMark defaultValue="09:00 AM" disabled />
            <label className="flex items-end gap-2 pb-1 text-[12px]">
              <input type="checkbox" disabled /> All day
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="End date" requiredMark defaultValue={isoToDisplay(selectedDate)} disabled />
            <Input label="Time" requiredMark defaultValue="09:30 AM" disabled />
          </div>
          <Select
            label="Reason"
            requiredMark
            placeholder="Select..."
            options={[
              { value: "Administrative", label: "Administrative" },
              { value: "Out of office", label: "Out of office" },
              { value: "Meeting", label: "Meeting" },
            ]}
            disabled
          />
        </div>
      )}
    </Modal>
  );
}
