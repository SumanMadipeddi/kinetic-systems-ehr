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
import { REFERENCE_TODAY } from "@/features/schedule/utils/calendar";

export type SlotSize = 5 | 10 | 15 | 20 | 30 | 45 | 60 | 90;

export const SLOT_SIZES: SlotSize[] = [5, 10, 15, 20, 30, 45, 60, 90];

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
  setSlotSize: (size: SlotSize) => void;
  addEntry: (entry: ScheduleEntry) => void;
  updateEntry: (id: string, patch: Partial<ScheduleEntry>) => void;
  removeEntry: (id: string) => void;
  addPatientAppointment: (input: CreatePatientAppointmentInput) => ScheduleEntry;
};

function createId(): string {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
      selectedAppointmentTypes: [],
      selectedStatuses: [],
      slotSize: 30,
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      setSelectedDate: (date) => set({ selectedDate: date }),

      setSelectedFacilityId: (id) => set({ selectedFacilityId: id }),

      setSelectedProviderIds: (ids) => set({ selectedProviderIds: ids }),

      toggleProvider: (id) => {
        const current = get().selectedProviderIds;
        if (current.includes(id)) {
          set({ selectedProviderIds: current.filter((p) => p !== id) });
        } else {
          set({ selectedProviderIds: [...current, id] });
        }
      },

      setShowWeekends: (value) => set({ showWeekends: value }),

      setShowNonBusinessHours: (value) => set({ showNonBusinessHours: value }),

      setSlotSize: (size) => set({ slotSize: size }),

      addEntry: (entry) => set({ entries: [...get().entries, entry] }),

      updateEntry: (id, patch) =>
        set({
          entries: get().entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }),

      removeEntry: (id) =>
        set({ entries: get().entries.filter((e) => e.id !== id) }),

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
        slotSize: state.slotSize,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
