export type ScheduleEntryKind = "patient" | "block-time" | "block-range";

export type AppointmentStatus =
  | "pending-arrival"
  | "in-lobby"
  | "in-room"
  | "seen"
  | "cancelled"
  | "no-show"
  | "tentative";

export type AppointmentTypeId =
  | "wellness-exam"
  | "follow-up"
  | "nursing-only"
  | "urgent-visit"
  | "new-patient"
  | "video-visit";

export interface ScheduleEntry {
  id: string;
  kind: ScheduleEntryKind;

  providerId: string;
  facilityId: string;

  /** YYYY-MM-DD */
  startDate: string;
  /** HH:mm 24h */
  startTime: string;

  /** YYYY-MM-DD — used by block-range; optional for patient/block-time */
  endDate?: string;
  /** HH:mm 24h */
  endTime?: string;

  /** Preferred for patient + block-time; derived for single-day ranges */
  durationMinutes?: number;

  patientId?: string;
  patientName?: string;

  appointmentType?: AppointmentTypeId;

  reason?: string;
  description?: string;
  notes?: string;
  chiefComplaint?: string;

  status: AppointmentStatus;
}

export type CreatePatientAppointmentInput = {
  patientId: string;
  patientName: string;
  providerId: string;
  facilityId: string;
  startDate: string;
  startTime: string;
  durationMinutes: number;
  appointmentType: AppointmentTypeId;
  chiefComplaint?: string;
  notes?: string;
};
