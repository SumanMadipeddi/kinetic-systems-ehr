import { z } from "zod";

export const practiceInfoSchema = z.object({
  practiceName: z.string().min(1, "Practice name is required"),
  practicePhone: z.string().min(1, "Practice phone is required"),
  practiceFax: z.string().optional().default(""),
  facilityName: z.string().min(1, "Facility name is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional().default(""),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
  country: z.string().min(1, "Country is required"),
  timeZone: z.string().min(1, "Time zone is required"),
  observesDaylightSaving: z.boolean(),
});

export type PracticeInfoFormValues = z.infer<typeof practiceInfoSchema>;
