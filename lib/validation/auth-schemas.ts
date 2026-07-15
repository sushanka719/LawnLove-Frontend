import { z } from "zod";

// Mirrors LawnBackend/src/auth/validation.constants.ts — keep both in sync
// so a value accepted by the form is never rejected by the server, and vice
// versa. Messages are shared verbatim so client- and server-side rejections
// of the same rule never read as two different errors.

const NAME_REGEX = /^[A-Za-z][A-Za-z' -]*$/;
const EMAIL_REGEX = /^[\w.+-]+@[\w-]+\.[\w.]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

const NAME_MESSAGE = "Name must contain only letters and spaces (2-100 characters).";
const EMAIL_MESSAGE = "Please enter a valid email address.";
const PASSWORD_MESSAGE =
  "Password must be 8-16 characters with uppercase, lowercase, number and special character.";

export const nameSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\s+/g, " "))
  .refine((value) => value.length >= 2 && value.length <= 100, NAME_MESSAGE)
  .refine((value) => NAME_REGEX.test(value), NAME_MESSAGE);

export const emailSchema = z
  .string()
  .trim()
  .max(254, EMAIL_MESSAGE)
  .refine((value) => !value.includes(" ") && !value.includes(".."), EMAIL_MESSAGE)
  .refine((value) => EMAIL_REGEX.test(value), EMAIL_MESSAGE);

export const loginPasswordSchema = z.string().min(1, "Password is required.");

export const newPasswordSchema = z
  .string()
  .trim()
  .refine((value) => value.length >= 8 && value.length <= 16, PASSWORD_MESSAGE)
  .refine((value) => PASSWORD_REGEX.test(value), PASSWORD_MESSAGE);
