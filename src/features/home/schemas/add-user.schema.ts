import { z } from "zod";

export const ACCESS_LEVELS = [
  { value: "1", label: "1 Staff" },
  { value: "2", label: "2 Nurse" },
  { value: "3", label: "3 N.P./P.A." },
  { value: "4", label: "4 Phys./MD/DO" },
] as const;

export const addUserSchema = z.object({
  isDr: z.boolean().default(false),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid login email"),
  accessLevel: z.string().min(1, "Select an access level"),
  isAdmin: z.boolean().default(false),
  emergencyAccess: z.boolean().default(false),
});

export type AddUserFormValues = z.infer<typeof addUserSchema>;
