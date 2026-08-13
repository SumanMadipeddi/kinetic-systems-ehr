"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CreatePatientAppointmentInput,
  ScheduleEntry,
} from "@/types/schedule-entry";
import { SEED_SCHEDULE_ENTRIES } from "@/mocks/schedule-entries";
import { DEFAULT_FACILITY_ID } from "@/mocks/facilities";
import { DEFAULT_PROVIDER_ID } from "@/mocks/providers";
import { APPOINTMENT_TYPES } from "@/mocks/appointment-types";
import { APPOINTMENT_STATUS_FILTERS } from "@/mocks/appointment-statuses";
import { REFERENCE_TODAY } from "@/features/schedule/utils/calendar";

export type SlotSize = 5 | 10 | 15 | 20 | 30 | 45 | 60 | 90;

export const SLOT_SIZES: SlotSize[] = [5, 10, 15, 20, 30, 45, 60, 90];

export const ALL_APPOINTMENT_TYPE_IDS = APPOINTMENT_TYPES.map((t) => t.id);
export const ALL_STATUS_FILTER_CODES = APPOINTMENT_STATUS_FILTERS.map((s) => s.code);

export type CreateBlockTimeInput = {
  providerId: string;
  facilityId: string;
  startDate: string;
  startTime: string;
  durationMinutes: number;
  reason: string;
  description?: string;
};

type ScheduleState = {
  entries: ScheduleEntry[];
  selectedDate: string;
  selectedFacilityId: string;
  selectedProviderIds: string[];
  showWeekends: boolean;
  showNonBusinessHours: boolean;
  selectedAppointmentTypes: string[];
  selectedStatuses: string[];
  slotSize: SlotSize;
  hydrated: boolean;

  setHydrated: (value: boolean) => void;
  setSelectedDate: (date: string) => void;
  setSelectedFacilityId: (id: string) => void;
  setSelectedProviderIds: (ids: string[]) => void;
  toggleProvider: (id: string) => void;
  setShowWeekends: (value: boolean) => void;
  setShowNonBusinessHours: (value: boolean) => void;
  setSelectedAppointmentTypes: (ids: string[]) => void;
  toggleAppointmentType: (id: string) => void;
  setSelectedStatuses: (codes: string[]) => void;
  toggleStatus: (code: string) => void;
  setSlotSize: (size: SlotSize) => void;
  addPatientAppointment: (input: CreatePatientAppointmentInput) => ScheduleEntry;
  addBlockTime: (input: CreateBlockTimeInput) => ScheduleEntry;
};

function createId(): string {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toggleInList(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      entries: SEED_SCHEDULE_ENTRIES,
      selectedDate: REFERENCE_TODAY,
      selectedFacilityId: DEFAULT_FACILITY_ID,
      selectedProviderIds: [DEFAULT_PROVIDER_ID],
      showWeekends: true,
      showNonBusinessHours: true,
      selectedAppointmentTypes: [...ALL_APPOINTMENT_TYPE_IDS],
      selectedStatuses: [...ALL_STATUS_FILTER_CODES],
      slotSize: 30,
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      setSelectedDate: (date) => set({ selectedDate: date }),

      setSelectedFacilityId: (id) => set({ selectedFacilityId: id }),

      setSelectedProviderIds: (ids) => set({ selectedProviderIds: ids }),

      toggleProvider: (id) => {
        set({ selectedProviderIds: toggleInList(get().selectedProviderIds, id) });
      },

      setShowWeekends: (value) => set({ showWeekends: value }),

      setShowNonBusinessHours: (value) => set({ showNonBusinessHours: value }),

      setSelectedAppointmentTypes: (ids) => set({ selectedAppointmentTypes: ids }),

      toggleAppointmentType: (id) => {
        set({
          selectedAppointmentTypes: toggleInList(get().selectedAppointmentTypes, id),
        });
      },

      setSelectedStatuses: (codes) => set({ selectedStatuses: codes }),

      toggleStatus: (code) => {
        set({ selectedStatuses: toggleInList(get().selectedStatuses, code) });
      },

      setSlotSize: (size) => set({ slotSize: size }),

      addPatientAppointment: (input) => {
        const entry: ScheduleEntry = {
          id: createId(),
          kind: "patient",
          providerId: input.providerId,
          facilityId: input.facilityId,
          startDate: input.startDate,
          startTime: input.startTime,
          durationMinutes: input.durationMinutes,
          patientId: input.patientId,
          patientName: input.patientName,
          appointmentType: input.appointmentType,
          chiefComplaint: input.chiefComplaint,
          notes: input.notes,
          status: "pending-arrival",
        };
        set({ entries: [...get().entries, entry] });
        return entry;
      },

      addBlockTime: (input) => {
        const entry: ScheduleEntry = {
          id: createId(),
          kind: "block-time",
          providerId: input.providerId,
          facilityId: input.facilityId,
          startDate: input.startDate,
          startTime: input.startTime,
          durationMinutes: input.durationMinutes,
          reason: input.reason,
          description: input.description,
          status: "tentative",
        };
        set({ entries: [...get().entries, entry] });
        return entry;
      },
    }),
    {
      name: "pf-schedule-store",
      partialize: (state) => ({
        entries: state.entries,
        selectedDate: state.selectedDate,
        selectedFacilityId: state.selectedFacilityId,
        selectedProviderIds: state.selectedProviderIds,
        showWeekends: state.showWeekends,
        showNonBusinessHours: state.showNonBusinessHours,
        selectedAppointmentTypes: state.selectedAppointmentTypes,
        selectedStatuses: state.selectedStatuses,
        slotSize: state.slotSize,
      }),
      merge: (persisted, current) => {
        const p = (persisted as Partial<ScheduleState> | undefined) ?? {};
        const types = Array.isArray(p.selectedAppointmentTypes)
          ? p.selectedAppointmentTypes
          : current.selectedAppointmentTypes;
        const statuses = Array.isArray(p.selectedStatuses)
          ? p.selectedStatuses
          : current.selectedStatuses;
        return {
          ...current,
          ...p,
          selectedAppointmentTypes: types,
          selectedStatuses: statuses,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
