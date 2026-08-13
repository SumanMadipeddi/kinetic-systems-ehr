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
  usersTabOpen: boolean;
  scheduleRefreshing: boolean;
  scheduleRefreshKey: number;
  toast: Toast | null;
  openAppointmentModal: (draft?: AppointmentDraft) => void;
  closeAppointmentModal: () => void;
  toggleFilterRail: () => void;
  setFilterRailOpen: (open: boolean) => void;
  openPracticeInfoTab: () => void;
  closePracticeInfoTab: () => void;
  openUsersTab: () => void;
  closeUsersTab: () => void;
  refreshSchedule: () => Promise<void>;
  showToast: (message: string, tone?: Toast["tone"]) => void;
  clearToast: () => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  appointmentModalOpen: false,
  appointmentDraft: null,
  filterRailOpen: true,
  practiceInfoTabOpen: false,
  usersTabOpen: false,
  scheduleRefreshing: false,
  scheduleRefreshKey: 0,
  toast: null,
  openAppointmentModal: (draft) =>
    set({ appointmentModalOpen: true, appointmentDraft: draft ?? null }),
  closeAppointmentModal: () =>
    set({ appointmentModalOpen: false, appointmentDraft: null }),
  toggleFilterRail: () => set((s) => ({ filterRailOpen: !s.filterRailOpen })),
  setFilterRailOpen: (open) => set({ filterRailOpen: open }),
  openPracticeInfoTab: () => set({ practiceInfoTabOpen: true }),
  closePracticeInfoTab: () => set({ practiceInfoTabOpen: false }),
  openUsersTab: () => set({ usersTabOpen: true }),
  closeUsersTab: () => set({ usersTabOpen: false }),
  refreshSchedule: async () => {
    if (get().scheduleRefreshing) return;
    set({ scheduleRefreshing: true });
    // Simulated reload — keeps filters, date, and entries intact.
    await new Promise((resolve) => setTimeout(resolve, 700));
    set((s) => ({
      scheduleRefreshing: false,
      scheduleRefreshKey: s.scheduleRefreshKey + 1,
    }));
    get().showToast("Schedule refreshed.", "info");
  },
  showToast: (message, tone = "success") =>
    set({ toast: { id: String(Date.now()), message, tone } }),
  clearToast: () => set({ toast: null }),
}));
