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

export const frequencySchema = z.enum(["weekly", "biweekly", "monthly", "oneTime"]);

export const scheduleStepSchema = z.object({
  frequency: frequencySchema,
  date: z.string().trim().min(1, "Select a preferred date."),
  timeSlot: z.string().trim().min(1, "Select a time slot."),
});

export type ScheduleStepValues = z.infer<typeof scheduleStepSchema>;

export const paymentStepSchema = z.object({
  cardNumber: z
    .string()
    .trim()
    .min(1, "Card number is required.")
    .refine(
      (value) => /^\d{13,19}$/.test(value.replace(/\s/g, "")),
      "Enter a valid card number.",
    ),
  expiry: z
    .string()
    .trim()
    .min(1, "Expiry is required.")
    .refine((value) => /^(0[1-9]|1[0-2])\/\d{2,4}$/.test(value), "Use MM/YY format."),
  cvc: z
    .string()
    .trim()
    .min(1, "CVC is required.")
    .refine((value) => /^\d{3,4}$/.test(value), "Enter a valid CVC."),
  zip: z
    .string()
    .trim()
    .min(1, "ZIP is required.")
    .refine((value) => /^\d{4,10}$/.test(value), "Enter a valid ZIP code."),
  saveCard: z.boolean(),
});

export type PaymentStepValues = z.infer<typeof paymentStepSchema>;
