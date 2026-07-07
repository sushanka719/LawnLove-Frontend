import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  rememberMe: z.boolean().optional(),
});
export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name"),
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.boolean().optional(),
});
export type LoginValues = z.infer<typeof loginSchema>;

const passwordRule = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Za-z]/, "Must include a letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[^A-Za-z0-9]/, "Must include a symbol");

export const setPasswordSchema = z
  .object({
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type SetPasswordValues = z.infer<typeof setPasswordSchema>;
