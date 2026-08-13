import type { ScheduleEntry } from "@/types/schedule-entry";
import { DEFAULT_FACILITY_ID } from "@/mocks/facilities";
import { DEFAULT_PROVIDER_ID } from "@/mocks/providers";

/** Deterministic seed data around Wed Aug 12, 2026 */
export const SEED_SCHEDULE_ENTRIES: ScheduleEntry[] = [
  {
    id: "seed-block-0900",
    kind: "block-time",
    providerId: DEFAULT_PROVIDER_ID,
    facilityId: DEFAULT_FACILITY_ID,
    startDate: "2026-08-12",
    startTime: "09:00",
    durationMinutes: 30,
    reason: "Admin block",
    status: "tentative",
  },
  {
    id: "seed-patient-lee",
    kind: "patient",
    providerId: DEFAULT_PROVIDER_ID,
    facilityId: DEFAULT_FACILITY_ID,
    startDate: "2026-08-12",
    startTime: "10:00",
    durationMinutes: 30,
    patientId: "pat-001",
    patientName: "Lee, Jordan",
    appointmentType: "follow-up",
    chiefComplaint: "Follow-up visit",
    status: "pending-arrival",
  },
  {
    id: "seed-patient-nguyen",
    kind: "patient",
    providerId: DEFAULT_PROVIDER_ID,
    facilityId: DEFAULT_FACILITY_ID,
    startDate: "2026-08-13",
    startTime: "14:00",
    durationMinutes: 45,
    patientId: "pat-002",
    patientName: "Nguyen, Avery",
    appointmentType: "wellness-exam",
    chiefComplaint: "Annual wellness",
    status: "pending-arrival",
  },
];
