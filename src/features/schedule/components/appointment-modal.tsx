"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  addMinutesToTime,
  formatTime12h,
} from "../utils/calendar";
import {
  patientAppointmentSchema,
  type PatientAppointmentFormValues,
} from "../schemas/appointment.schema";
import { cn } from "@/lib/cn";

type ModalTab = "with-patient" | "block-time" | "block-range";

function toInputDate(iso: string): string {
  // yyyy-MM-dd stays for <input type="date">
  return iso;
}

function displayDateToIso(mmddyyyy: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(mmddyyyy);
  if (!m) return null;
  return `${m[3]}-${m[1]}-${m[2]}`;
}

function isoToDisplay(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
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

  const [tab, setTab] = useState<ModalTab>("with-patient");
  const [query, setQuery] = useState("");
  const [dateText, setDateText] = useState(isoToDisplay(selectedDate));

  const defaultProvider =
    selectedProviderIds[0] ?? PROVIDERS[0]?.id ?? "";

  const form = useForm<PatientAppointmentFormValues>({
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
  });

  const selectedPatientId = form.watch("patientId");
  const startTime = form.watch("startTime");
  const durationMinutes = form.watch("durationMinutes");
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
    // Reset only on open transition so async store rehydration cannot wipe in-progress input.
    if (open && !wasOpen.current) {
      const startDate = draft?.date ?? selectedDate;
      const startTime = draft?.time ?? "09:00";
      const providerId = draft?.providerId ?? defaultProvider;
      form.reset({
        patientId: "",
        patientName: "",
        providerId,
        facilityId: selectedFacilityId,
        appointmentType: "follow-up",
        startDate,
        startTime,
        durationMinutes: 30,
        chiefComplaint: "",
        notes: "",
      });
      setDateText(isoToDisplay(startDate));
      setQuery("");
      setTab("with-patient");
    }
    wasOpen.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const savePatientAppointment = () => {
    const raw = form.getValues();
    const payload = {
      ...raw,
      patientId: String(raw.patientId ?? ""),
      patientName: String(raw.patientName ?? ""),
      providerId: String(raw.providerId || defaultProvider),
      facilityId: String(raw.facilityId || selectedFacilityId),
      appointmentType: raw.appointmentType || "follow-up",
      startDate: String(raw.startDate || selectedDate),
      startTime: String(raw.startTime || "09:00"),
      durationMinutes: Number(raw.durationMinutes) || 30,
      chiefComplaint: raw.chiefComplaint || undefined,
      notes: raw.notes || undefined,
    };

    const parsed = patientAppointmentSchema.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      (Object.keys(fieldErrors) as (keyof PatientAppointmentFormValues)[]).forEach(
        (key) => {
          const message = fieldErrors[key]?.[0];
          if (message) {
            form.setError(key, { message });
          }
        },
      );
      const first =
        parsed.error.issues[0]?.message ?? "Please complete required fields.";
      showToast(first, "error");
      return;
    }

    const entry = addPatientAppointment(parsed.data);
    showToast(`Appointment saved for ${entry.patientName}.`, "success");
    close();
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
          <Button
            variant="pill"
            data-testid="save-appointment"
            onClick={() => {
              if (tab !== "with-patient") {
                showToast("Only With patient is fully implemented in this assessment.", "info");
                return;
              }
              savePatientAppointment();
            }}
          >
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
            savePatientAppointment();
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
              <p className="mt-1 text-[11px] text-red-600">
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
                <div>{selectedPatient ? `###-##-${selectedPatient.last4Ssn}` : "###-##-####"}</div>
              </div>
              <div>
                <div className="text-[var(--pf-text-muted)]">PRN</div>
                <div>{selectedPatient?.prn ?? "AA123456"}</div>
              </div>
            </div>
            <button
              type="button"
              className="mt-1 text-[12px] text-[var(--pf-link)] hover:underline"
              onClick={() =>
                showToast("Add new patient is out of scope for this assessment.", "info")
              }
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
                value={toInputDate(form.watch("startDate"))}
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
      ) : (
        <div className="space-y-3 p-4 text-[13px]">
          <p className="text-[var(--pf-text-muted)]">
            {tab === "block-time"
              ? "Block time form is available visually; saving is implemented for With patient only."
              : "Block range form is available visually; saving is implemented for With patient only."}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Block time for"
              options={PROVIDERS.map((p) => ({ value: p.id, label: p.displayName }))}
              defaultValue={defaultProvider}
            />
            <Select
              label="Facility"
              options={FACILITIES.map((f) => ({ value: f.id, label: f.name }))}
              defaultValue={selectedFacilityId}
            />
          </div>
          {tab === "block-time" ? (
            <div className="grid grid-cols-3 gap-3">
              <Input label="Date" requiredMark defaultValue={isoToDisplay(selectedDate)} />
              <Input label="Time" requiredMark defaultValue="09:00 AM" />
              <Input label="Duration" requiredMark defaultValue="30" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Start date" requiredMark defaultValue={isoToDisplay(selectedDate)} />
                <Input label="Time" requiredMark defaultValue="09:00 AM" />
                <label className="flex items-end gap-2 pb-1 text-[12px]">
                  <input type="checkbox" /> All day
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="End date" requiredMark defaultValue={isoToDisplay(selectedDate)} />
                <Input label="Time" requiredMark defaultValue="09:30 AM" />
              </div>
            </>
          )}
          <Select
            label="Reason"
            requiredMark
            placeholder="Select..."
            options={[
              { value: "admin", label: "Administrative" },
              { value: "pto", label: "Out of office" },
              { value: "meeting", label: "Meeting" },
            ]}
          />
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase text-[#555]">Description</span>
            <textarea className="min-h-20 border border-[var(--pf-border)] p-2 text-[13px]" maxLength={100} />
            <span className="self-end text-[11px] text-[var(--pf-text-muted)]">0/100</span>
          </label>
        </div>
      )}
    </Modal>
  );
}
