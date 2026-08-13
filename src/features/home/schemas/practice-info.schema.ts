import { z } from "zod";

const phoneOk = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

export const practiceInfoSchema = z.object({
  practiceName: z.string().trim().min(1, "Practice name is required"),
  practicePhone: z
    .string()
    .trim()
    .min(1, "Practice phone is required")
    .refine(phoneOk, "Enter a valid phone number"),
  practiceFax: z.string(),
  facilityName: z.string().trim().min(1, "Facility name is required"),
  addressLine1: z.string().trim().min(1, "Address line 1 is required"),
  addressLine2: z.string(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z
    .string()
    .trim()
    .min(1, "ZIP is required")
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  country: z.string().min(1, "Country is required"),
  timeZone: z.string().min(1, "Time zone is required"),
  observesDaylightSaving: z.boolean(),
});

export type PracticeInfoFormValues = z.infer<typeof practiceInfoSchema>;
