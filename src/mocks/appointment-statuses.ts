import type { AppointmentStatus } from "@/types/schedule-entry";

export type AppointmentStatusFilter = {
  code: string;
  label: string;
  domainStatus: AppointmentStatus;
  color: string;
};

/** Sidebar filter codes mapped to domain AppointmentStatus values */
export const APPOINTMENT_STATUS_FILTERS: AppointmentStatusFilter[] = [
  { code: "CX", label: "Cancelled", domainStatus: "cancelled", color: "#c0392b" },
  { code: "LB", label: "In lobby", domainStatus: "in-lobby", color: "#27ae60" },
  { code: "RM", label: "In room", domainStatus: "in-room", color: "#d4a017" },
  { code: "NS", label: "No show", domainStatus: "no-show", color: "#922b21" },
  { code: "PA", label: "Pending arrival", domainStatus: "pending-arrival", color: "#27ae60" },
  { code: "ZZ", label: "Seen (Completed)", domainStatus: "seen", color: "#2980b9" },
  { code: "TN", label: "Tentative", domainStatus: "tentative", color: "#8e44ad" },
];

export function statusCodesForDomain(status: AppointmentStatus): string[] {
  return APPOINTMENT_STATUS_FILTERS.filter((s) => s.domainStatus === status).map(
    (s) => s.code,
  );
}
