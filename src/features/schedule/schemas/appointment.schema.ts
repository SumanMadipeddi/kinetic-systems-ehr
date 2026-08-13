import { z } from "zod";

const appointmentTypes = [
  "wellness-exam",
  "follow-up",
  "nursing-only",
  "urgent-visit",
  "new-patient",
  "video-visit",
] as const;

export const patientAppointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  patientName: z.string().min(1, "Patient is required"),
  providerId: z.string().min(1, "Provider is required"),
  facilityId: z.string().min(1, "Facility is required"),
  appointmentType: z.enum(appointmentTypes, {
    message: "Appointment type is required",
  }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date is required"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time is required"),
  durationMinutes: z
    .number({ message: "Duration is required" })
    .min(5, "Duration must be at least 5 minutes")
    .max(480, "Duration is too long"),
  chiefComplaint: z.string().optional(),
  notes: z.string().optional(),
});

export type PatientAppointmentFormValues = z.infer<typeof patientAppointmentSchema>;

export const blockTimeSchema = z.object({
  providerId: z.string().min(1, "Provider is required"),
  facilityId: z.string().min(1, "Facility is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date is required"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time is required"),
  durationMinutes: z
    .number({ message: "Duration is required" })
    .min(5, "Duration must be at least 5 minutes")
    .max(480, "Duration is too long"),
  reason: z.string().min(1, "Reason is required"),
  description: z.string().max(100).optional(),
});

export type BlockTimeFormValues = z.infer<typeof blockTimeSchema>;
