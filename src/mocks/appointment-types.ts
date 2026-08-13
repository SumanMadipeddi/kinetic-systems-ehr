import type { AppointmentTypeId } from "@/types/schedule-entry";

export type AppointmentTypeMeta = {
  id: AppointmentTypeId;
  label: string;
  colorVar: string;
};

export const APPOINTMENT_TYPES: AppointmentTypeMeta[] = [
  { id: "wellness-exam", label: "Wellness Exam", colorVar: "var(--pf-type-wellness)" },
  { id: "follow-up", label: "Follow-Up Visit", colorVar: "var(--pf-type-follow-up)" },
  { id: "nursing-only", label: "Nursing Only", colorVar: "var(--pf-type-nursing)" },
  { id: "urgent-visit", label: "Urgent Visit", colorVar: "var(--pf-type-urgent)" },
  { id: "new-patient", label: "New Patient Visit", colorVar: "var(--pf-type-new-patient)" },
  { id: "video-visit", label: "Video Visit", colorVar: "var(--pf-type-video)" },
];

export function getAppointmentTypeMeta(id?: AppointmentTypeId) {
  return APPOINTMENT_TYPES.find((t) => t.id === id);
}
