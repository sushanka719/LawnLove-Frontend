import { z } from "zod";

// Mirrors LawnBackend/src/auth/validation.constants.ts (FULL_NAME_*, PHONE_*)
// and the form-field validation standards. Keep both in sync so a value
// accepted by the form is never rejected by the server, and vice versa.

const NAME_REGEX = /^[A-Za-z][A-Za-z' -]*$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;

const FULL_NAME_MESSAGE =
  "Full name must contain only letters and spaces (3-100 characters).";
const PHONE_MESSAGE = "Please enter a valid 10-digit phone number.";

export const fullNameSchema = z
  .string()
  .trim()
  // Collapse consecutive internal spaces (matches server collapseSpaces()).
  .transform((value) => value.replace(/\s+/g, " "))
  .refine((value) => value.length >= 3 && value.length <= 100, FULL_NAME_MESSAGE)
  .refine((value) => NAME_REGEX.test(value), FULL_NAME_MESSAGE);

// Optional: an empty value clears the stored number. When present it must be
// 10-15 digits with an optional leading `+`; spaces/dashes are stripped first
// (matches server stripPhoneSeparators()).
export const phoneNumberSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .refine((value) => value === "" || PHONE_REGEX.test(value), PHONE_MESSAGE);

export const profileSchema = z.object({
  fullName: fullNameSchema,
  phoneNumber: phoneNumberSchema,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// Profile Picture — JPG/JPEG/PNG/WEBP up to 5 MB (form-field standards §10).
export const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
export const AVATAR_ERROR_MESSAGE = "Only JPG/PNG images up to 5 MB are allowed.";
