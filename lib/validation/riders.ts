import { z } from "zod";

export const createRiderSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  licenseNumber: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.string().optional(),
  clubName: z.string().optional(),
  feiId: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  consentGiven: z.union([z.literal(true), z.literal("true")]),
});

export const updateRiderSchema = createRiderSchema.partial();
