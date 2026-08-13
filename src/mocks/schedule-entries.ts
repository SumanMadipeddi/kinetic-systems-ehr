import type { ScheduleEntry } from "@/types/schedule-entry";
import { DEFAULT_FACILITY_ID } from "@/mocks/facilities";
import { DEFAULT_PROVIDER_ID } from "@/mocks/providers";
import { REFERENCE_TODAY, shiftDay } from "@/features/schedule/utils/calendar";

/** Seed appointments anchored to the current local date */
export const SEED_SCHEDULE_ENTRIES: ScheduleEntry[] = [
  {
    id: "seed-block-0900",
    kind: "block-time",
    providerId: DEFAULT_PROVIDER_ID,
    facilityId: DEFAULT_FACILITY_ID,
    startDate: REFERENCE_TODAY,
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
    startDate: REFERENCE_TODAY,
    startTime: "10:00",
    durationMinutes: 30,
    patientId: "pat-001",
    patientName: "Lee, Jordan",
    appointmentType: "follow-up",
    chiefComplaint: "Follow-up visit",
    status: "pending-arrival",
    confirmation: "Unconfirmed",
    copay: 40,
    eligibility: "Eligible",
  },
  {
    id: "seed-patient-nguyen",
    kind: "patient",
    providerId: DEFAULT_PROVIDER_ID,
    facilityId: DEFAULT_FACILITY_ID,
    startDate: shiftDay(REFERENCE_TODAY, 1),
    startTime: "14:00",
    durationMinutes: 45,
    patientId: "pat-002",
    patientName: "Nguyen, Avery",
    appointmentType: "wellness-exam",
    chiefComplaint: "Annual wellness",
    status: "pending-arrival",
    confirmation: "Confirmed",
    copay: 0,
    eligibility: "Eligible",
  },
];
