import { z } from "zod";

// Admin plan create/edit form. Numeric inputs are kept as strings (native
// <input> values) and coerced on submit; money is entered in DOLLARS and
// converted to CENTS for the API. Cross-field rules mirror the backend
// PlansService (recurring ⇒ interval required). The area surcharge ladder is
// global now — edited separately under /admin/pricing (see pricing-settings-schemas).

export const PLAN_BILLING_TYPES = ["recurring", "oneTime"] as const;
export const PLAN_INTERVALS = ["weekly", "biweekly", "monthly"] as const;

const MONEY_REGEX = /^\d+(\.\d{1,2})?$/; // dollars, up to 2 decimals
const INT_REGEX = /^\d+$/;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const planFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required.").max(120),
    slug: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || SLUG_REGEX.test(v),
        "Lowercase letters, numbers and dashes only (or leave blank to auto-generate).",
      ),
    description: z.string().trim().max(1000),
    billingType: z.enum(PLAN_BILLING_TYPES),
    interval: z.union([z.enum(PLAN_INTERVALS), z.literal("")]),
    basePriceDollars: z
      .string()
      .trim()
      .regex(MONEY_REGEX, "Enter an amount like 32 or 32.00."),
    active: z.boolean(),
    sortOrder: z.string().trim().regex(INT_REGEX, "Enter a whole number."),
    features: z.array(z.object({ value: z.string().max(200) })),
  })
  .superRefine((val, ctx) => {
    if (val.billingType === "recurring" && !val.interval) {
      ctx.addIssue({
        code: "custom",
        path: ["interval"],
        message: "Choose a billing interval for recurring plans.",
      });
    }
  });

export type PlanFormValues = z.infer<typeof planFormSchema>;
