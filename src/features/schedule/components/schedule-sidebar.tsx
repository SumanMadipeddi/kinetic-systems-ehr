"use client";

import { useState } from "react";
import { PROVIDERS } from "@/mocks/providers";
import { APPOINTMENT_TYPES } from "@/mocks/appointment-types";
import { APPOINTMENT_STATUS_FILTERS } from "@/mocks/appointment-statuses";
import {
  ALL_APPOINTMENT_TYPE_IDS,
  ALL_STATUS_FILTER_CODES,
  useScheduleStore,
} from "@/store/schedule-store";
import { useUiStore } from "@/store/ui-store";

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[var(--pf-border-light)]">
      <button
        type="button"
        className="flex w-full items-center gap-1.5 px-2 py-2 text-left text-[13px] font-bold uppercase tracking-wide text-[#444]"
        onClick={onToggle}
      >
        <span
          className={
            open ? "pf-filter-caret pf-filter-caret--open" : "pf-filter-caret pf-filter-caret--closed"
          }
          aria-hidden
        />
        {title}
      </button>
      {open ? <div className="pb-1">{children}</div> : null}
    </div>
  );
}

function FilterOption({
  checked,
  onChange,
  children,
  "data-testid": testId,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  children: React.ReactNode;
  "data-testid"?: string;
}) {
  return (
    <label className="pf-filter-option" data-testid={testId}>
      <input
        type="checkbox"
        className="pf-filter-check"
        checked={checked}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      />
      {children}
    </label>
  );
}

export function ScheduleSidebar() {
  const filterRailOpen = useUiStore((s) => s.filterRailOpen);
  const selectedProviderIds = useScheduleStore((s) => s.selectedProviderIds);
  const toggleProvider = useScheduleStore((s) => s.toggleProvider);
  const setSelectedProviderIds = useScheduleStore((s) => s.setSelectedProviderIds);
  const showWeekends = useScheduleStore((s) => s.showWeekends);
  const setShowWeekends = useScheduleStore((s) => s.setShowWeekends);
  const showNonBusinessHours = useScheduleStore((s) => s.showNonBusinessHours);
  const setShowNonBusinessHours = useScheduleStore((s) => s.setShowNonBusinessHours);
  const selectedAppointmentTypes = useScheduleStore(
    (s) => s.selectedAppointmentTypes,
  );
  const setSelectedAppointmentTypes = useScheduleStore(
    (s) => s.setSelectedAppointmentTypes,
  );
  const toggleAppointmentType = useScheduleStore((s) => s.toggleAppointmentType);
  const selectedStatuses = useScheduleStore((s) => s.selectedStatuses);
  const setSelectedStatuses = useScheduleStore((s) => s.setSelectedStatuses);
  const toggleStatus = useScheduleStore((s) => s.toggleStatus);

  const [showFreeTimes, setShowFreeTimes] = useState(false);
  const [openSection, setOpenSection] = useState<
    "users" | "display" | "types" | "status" | "availability" | null
  >("users");

  const toggleSection = (
    section: "users" | "display" | "types" | "status" | "availability",
  ) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  if (!filterRailOpen) return null;

  return (
    <aside className="pf-filter-rail w-[var(--pf-schedule-filter-width)] shrink-0 overflow-y-auto border-r border-[var(--pf-border)] bg-white">
      <Accordion
        title="Users"
        open={openSection === "users"}
        onToggle={() => toggleSection("users")}
      >
        <FilterOption
          checked={selectedProviderIds.length === PROVIDERS.length}
          onChange={(checked) =>
            setSelectedProviderIds(checked ? PROVIDERS.map((p) => p.id) : [])
          }
        >
          All
        </FilterOption>
        <div className="mb-2 ml-[15px] mr-[10px] text-[13px]">
          <button
            type="button"
            className="text-[var(--pf-link)] hover:underline"
            onClick={() => setSelectedProviderIds(PROVIDERS.map((p) => p.id))}
          >
            Just me
          </button>
          <span className="mx-1 text-[var(--pf-text-muted)]">|</span>
          <button
            type="button"
            className="cursor-default text-[var(--pf-text-muted)]"
            disabled
            title="Provider list editing is unavailable"
          >
            Edit
          </button>
        </div>
        <div className="mb-1 ml-[15px] text-[10px] font-bold uppercase text-[var(--pf-text-muted)]">
          Logged in as
        </div>
        {PROVIDERS.map((p) => (
          <FilterOption
            key={p.id}
            checked={selectedProviderIds.includes(p.id)}
            onChange={() => toggleProvider(p.id)}
          >
            <span className="inline-block h-3 w-3" style={{ background: p.color }} />
            {p.displayName}
          </FilterOption>
        ))}
      </Accordion>

      <Accordion
        title="Display options"
        open={openSection === "display"}
        onToggle={() => toggleSection("display")}
      >
        <FilterOption checked={showWeekends} onChange={setShowWeekends}>
          Weekends
        </FilterOption>
        <FilterOption
          checked={showNonBusinessHours}
          onChange={setShowNonBusinessHours}
        >
          Non-Business hours
        </FilterOption>
      </Accordion>

      <Accordion
        title="Appointment types"
        open={openSection === "types"}
        onToggle={() => toggleSection("types")}
      >
        <FilterOption
          checked={selectedAppointmentTypes.length === ALL_APPOINTMENT_TYPE_IDS.length}
          onChange={(checked) =>
            setSelectedAppointmentTypes(checked ? [...ALL_APPOINTMENT_TYPE_IDS] : [])
          }
        >
          All
        </FilterOption>
        {APPOINTMENT_TYPES.map((t) => (
          <FilterOption
            key={t.id}
            data-testid={`filter-type-${t.id}`}
            checked={selectedAppointmentTypes.includes(t.id)}
            onChange={() => toggleAppointmentType(t.id)}
          >
            <span className="inline-block h-3 w-3" style={{ background: t.colorVar }} />
            {t.label}
          </FilterOption>
        ))}
      </Accordion>

      <Accordion
        title="Appointment status"
        open={openSection === "status"}
        onToggle={() => toggleSection("status")}
      >
        <FilterOption
          checked={selectedStatuses.length === ALL_STATUS_FILTER_CODES.length}
          onChange={(checked) =>
            setSelectedStatuses(checked ? [...ALL_STATUS_FILTER_CODES] : [])
          }
        >
          All
        </FilterOption>
        {APPOINTMENT_STATUS_FILTERS.map((s) => (
          <FilterOption
            key={s.code}
            data-testid={`filter-status-${s.code}`}
            checked={selectedStatuses.includes(s.code)}
            onChange={() => toggleStatus(s.code)}
          >
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: s.color }}
            >
              {s.code}
            </span>
            {s.label} ({s.code})
          </FilterOption>
        ))}
      </Accordion>

      <Accordion
        title="Availability"
        open={openSection === "availability"}
        onToggle={() => toggleSection("availability")}
      >
        <FilterOption checked={showFreeTimes} onChange={setShowFreeTimes}>
          Show free times
        </FilterOption>
      </Accordion>
    </aside>
  );
}
