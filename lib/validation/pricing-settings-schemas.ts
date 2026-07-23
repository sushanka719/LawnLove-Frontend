import { z } from "zod";

// Global pricing config form (area surcharge ladder + maximum serviceable area).
// Numeric inputs are kept as strings (native <input> values) and coerced on
// submit; surcharges are entered in DOLLARS and converted to CENTS for the API.
// Tier non-overlap is left to the server, which returns a clear message; the
// per-row "max > min" rule is checked here for fast feedback.

const MONEY_REGEX = /^\d+(\.\d{1,2})?$/; // dollars, up to 2 decimals
const INT_REGEX = /^\d+$/;

const areaTierFormSchema = z.object({
  minSqFt: z.string().trim().regex(INT_REGEX, "Enter a whole number."),
  maxSqFt: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || INT_REGEX.test(v),
      "Enter a whole number or leave blank for no upper limit.",
    ),
  surchargeDollars: z
    .string()
    .trim()
    .regex(MONEY_REGEX, "Enter an amount like 15 or 15.00."),
});

export const pricingSettingsFormSchema = z
  .object({
    // Blank = no maximum serviceable area.
    maxAreaSqFt: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || INT_REGEX.test(v),
        "Enter a whole number or leave blank for no maximum.",
      ),
    areaTiers: z.array(areaTierFormSchema),
  })
  .superRefine((val, ctx) => {
    val.areaTiers.forEach((tier, i) => {
      if (tier.maxSqFt !== "" && Number(tier.maxSqFt) <= Number(tier.minSqFt)) {
        ctx.addIssue({
          code: "custom",
          path: ["areaTiers", i, "maxSqFt"],
          message: "Max must be greater than min.",
        });
      }
    });
  });

export type PricingSettingsFormValues = z.infer<typeof pricingSettingsFormSchema>;
