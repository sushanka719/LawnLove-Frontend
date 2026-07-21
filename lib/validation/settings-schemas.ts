import { z } from "zod";

import { loginPasswordSchema, newPasswordSchema } from "./auth-schemas";

// Change-password form (Settings → Security). Current password is only required
// to be present (the server verifies it); the new password must meet the same
// strength rules as sign-up, must match its confirmation, and must differ from
// the current one.
export const changePasswordSchema = z
  .object({
    currentPassword: loginPasswordSchema,
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
