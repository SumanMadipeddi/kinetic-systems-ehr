"use client";

import { create } from "zustand";

type Toast = {
  id: string;
  message: string;
  tone?: "success" | "info" | "error";
};

export type AppointmentDraft = {
  date?: string;
  time?: string;
  providerId?: string;
};

type UiState = {
  appointmentModalOpen: boolean;
  appointmentDraft: AppointmentDraft | null;
  filterRailOpen: boolean;
  practiceInfoTabOpen: boolean;
  toast: Toast | null;
  openAppointmentModal: (draft?: AppointmentDraft) => void;
  closeAppointmentModal: () => void;
  toggleFilterRail: () => void;
  setFilterRailOpen: (open: boolean) => void;
  openPracticeInfoTab: () => void;
  closePracticeInfoTab: () => void;
  showToast: (message: string, tone?: Toast["tone"]) => void;
  clearToast: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  appointmentModalOpen: false,
  appointmentDraft: null,
  filterRailOpen: true,
  practiceInfoTabOpen: false,
  toast: null,
  openAppointmentModal: (draft) =>
    set({ appointmentModalOpen: true, appointmentDraft: draft ?? null }),
  closeAppointmentModal: () =>
    set({ appointmentModalOpen: false, appointmentDraft: null }),
  toggleFilterRail: () => set((s) => ({ filterRailOpen: !s.filterRailOpen })),
  setFilterRailOpen: (open) => set({ filterRailOpen: open }),
  openPracticeInfoTab: () => set({ practiceInfoTabOpen: true }),
  closePracticeInfoTab: () => set({ practiceInfoTabOpen: false }),
  showToast: (message, tone = "success") =>
    set({ toast: { id: String(Date.now()), message, tone } }),
  clearToast: () => set({ toast: null }),
}));
