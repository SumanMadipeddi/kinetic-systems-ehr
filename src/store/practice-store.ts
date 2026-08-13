"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PracticeInfo } from "@/types/practice";

/** Deterministic fictional seed — keep Home card + form in sync */
export const DEFAULT_PRACTICE: PracticeInfo = {
  practiceName: "Suman Ma Practice",
  practicePhone: "(408) 555-0142",
  practiceFax: "",
  facilityName: "San Jose Clinic",
  addressLine1: "99 Vista Montana",
  addressLine2: "",
  city: "San Jose",
  state: "CA",
  zip: "95001",
  country: "United States",
  timeZone: "America/Los_Angeles",
  observesDaylightSaving: true,
};

type PracticeState = {
  practice: PracticeInfo;
  completed: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  savePractice: (value: PracticeInfo) => void;
};

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set) => ({
      practice: DEFAULT_PRACTICE,
      completed: true,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      savePractice: (value) => set({ practice: value, completed: true }),
    }),
    {
      name: "pf-practice-store",
      partialize: (state) => ({
        practice: state.practice,
        completed: state.completed,
      }),
      merge: (persisted, current) => {
        const p = (persisted as Partial<PracticeState> | undefined) ?? {};
        const raw = p.practice ?? {};
        // Coerce every field to a string/boolean so stale localStorage cannot poison RHF/Zod
        const practice: PracticeInfo = {
          practiceName: String((raw as PracticeInfo).practiceName ?? DEFAULT_PRACTICE.practiceName),
          practicePhone: String((raw as PracticeInfo).practicePhone ?? DEFAULT_PRACTICE.practicePhone),
          practiceFax: String((raw as PracticeInfo).practiceFax ?? ""),
          facilityName: String((raw as PracticeInfo).facilityName ?? DEFAULT_PRACTICE.facilityName),
          addressLine1: String((raw as PracticeInfo).addressLine1 ?? DEFAULT_PRACTICE.addressLine1),
          addressLine2: String((raw as PracticeInfo).addressLine2 ?? ""),
          city: String((raw as PracticeInfo).city ?? DEFAULT_PRACTICE.city),
          state: String((raw as PracticeInfo).state ?? DEFAULT_PRACTICE.state),
          zip: String((raw as PracticeInfo).zip ?? DEFAULT_PRACTICE.zip),
          country: String((raw as PracticeInfo).country ?? DEFAULT_PRACTICE.country),
          timeZone: String((raw as PracticeInfo).timeZone ?? DEFAULT_PRACTICE.timeZone),
          observesDaylightSaving: Boolean(
            (raw as PracticeInfo).observesDaylightSaving ?? DEFAULT_PRACTICE.observesDaylightSaving,
          ),
        };
        return {
          ...current,
          ...p,
          practice,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
