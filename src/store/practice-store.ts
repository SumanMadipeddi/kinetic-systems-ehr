"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PracticeInfo } from "@/types/practice";

const DEFAULT_PRACTICE: PracticeInfo = {
  practiceName: "suman Ma Practice",
  practicePhone: "(602) 565-9192",
  practiceFax: "",
  facilityName: "suman Ma Practice",
  addressLine1: "123 Main Street",
  addressLine2: "",
  city: "San Francisco",
  state: "CA",
  zip: "94107",
  country: "United States",
  timeZone: "America/Los_Angeles",
  observesDaylightSaving: true,
};

type PracticeState = {
  practice: PracticeInfo;
  completed: boolean;
  savePractice: (value: PracticeInfo) => void;
};

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set) => ({
      practice: DEFAULT_PRACTICE,
      completed: true,
      savePractice: (value) => set({ practice: value, completed: true }),
    }),
    {
      name: "pf-practice-store",
      partialize: (state) => ({
        practice: state.practice,
        completed: state.completed,
      }),
    },
  ),
);
