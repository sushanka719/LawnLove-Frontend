import { z } from "zod";

const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/;

export const phoneNumberSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required.")
  .refine((value) => PHONE_REGEX.test(value), "Please enter a valid phone number.");

export const addressSchema = z.string().trim().min(1, "Address is required.");

export const addressStepSchema = z.object({
  phoneNumber: phoneNumberSchema,
  address: addressSchema,
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});

export type AddressStepValues = z.infer<typeof addressStepSchema>;

export const scheduleStepSchema = z.object({
  planId: z.string().trim().min(1, "Select a plan."),
  date: z.string().trim().min(1, "Select a preferred date."),
  timeSlot: z.string().trim().min(1, "Select a time slot."),
});

export type ScheduleStepValues = z.infer<typeof scheduleStepSchema>;
