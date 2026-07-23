"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminPricingSettings,
  useUpdatePricingSettings,
} from "@/hooks/use-pricing-settings";
import { ApiError } from "@/lib/api/http";
import type { PricingSettings } from "@/lib/api/pricing-settings";
import { centsToDollarString, dollarsToCents } from "@/lib/plans";
import {
  pricingSettingsFormSchema,
  type PricingSettingsFormValues,
} from "@/lib/validation/pricing-settings-schemas";

const labelClass = "text-lawn-text-secondary text-sm font-medium tracking-tight";

function toDefaults(settings: PricingSettings): PricingSettingsFormValues {
  return {
    maxAreaSqFt: settings.maxAreaSqFt == null ? "" : String(settings.maxAreaSqFt),
    areaTiers: settings.areaTiers.length
      ? settings.areaTiers.map((t) => ({
          minSqFt: String(t.minSqFt),
          maxSqFt: t.maxSqFt == null ? "" : String(t.maxSqFt),
          surchargeDollars: centsToDollarString(t.surcharge),
        }))
      : [{ minSqFt: "0", maxSqFt: "", surchargeDollars: "0" }],
  };
}

export function AdminPricingSettings() {
  const { data, isLoading, isError } = useAdminPricingSettings();

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load the pricing settings. Please refresh and try again.
      </p>
    );
  }
  if (isLoading || !data) {
    return (
      <div className="flex max-w-[820px] flex-col gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }
  // Remount when the loaded config changes so defaultValues are fresh.
  return <PricingSettingsForm key={data.updatedAt} settings={data} />;
}

function PricingSettingsForm({ settings }: { settings: PricingSettings }) {
  const update = useUpdatePricingSettings();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PricingSettingsFormValues>({
    resolver: zodResolver(pricingSettingsFormSchema),
    mode: "onTouched",
    defaultValues: toDefaults(settings),
  });

  const areaTiers = useFieldArray({ control, name: "areaTiers" });

  const onSubmit = async (values: PricingSettingsFormValues) => {
    const body = {
      maxAreaSqFt: values.maxAreaSqFt.trim() === "" ? null : Number(values.maxAreaSqFt),
      areaTiers: values.areaTiers.map((t) => ({
        minSqFt: Number(t.minSqFt),
        maxSqFt: t.maxSqFt.trim() === "" ? null : Number(t.maxSqFt),
        surcharge: dollarsToCents(t.surchargeDollars),
      })),
    };

    try {
      await update.mutateAsync(body);
      toast.success("Pricing settings saved.");
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't save the pricing settings. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-[820px] flex-col gap-8"
    >
      {/* Maximum serviceable area */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-lawn-primary mb-2 text-lg font-semibold">
          Maximum serviceable area
        </legend>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="max-area" className={labelClass}>
            Maximum lawn area (sq ft)
          </label>
          <Input
            id="max-area"
            inputMode="numeric"
            placeholder="Leave blank for no maximum"
            aria-invalid={!!errors.maxAreaSqFt}
            {...register("maxAreaSqFt")}
          />
          <p className="text-lawn-text-tertiary text-xs">
            Lawns larger than this can&apos;t be booked online — customers are asked to
            contact you. Applies to every plan.
          </p>
          <FieldError>{errors.maxAreaSqFt?.message}</FieldError>
        </div>
      </fieldset>

      {/* Area surcharge tiers */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-lawn-primary mb-1 text-lg font-semibold">
          Area surcharge tiers
        </legend>
        <p className="text-lawn-text-tertiary -mt-1 text-xs">
          Non-overlapping, ascending brackets shared by every plan. The surcharge of the
          bracket the measured lawn falls into is added to the plan&apos;s base price.
          Leave the top tier&apos;s max blank for no upper limit.
        </p>

        {areaTiers.fields.length > 0 && (
          <div className="hidden grid-cols-[1fr_1fr_1fr_auto] gap-2 px-1 sm:grid">
            <span className={labelClass}>Min sq ft</span>
            <span className={labelClass}>Max sq ft</span>
            <span className={labelClass}>Surcharge (USD)</span>
            <span className="w-8" />
          </div>
        )}

        {areaTiers.fields.map((field, i) => (
          <div key={field.id} className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2">
              <Input
                inputMode="numeric"
                aria-label={`Tier ${i + 1} min sq ft`}
                placeholder="0"
                {...register(`areaTiers.${i}.minSqFt`)}
              />
              <Input
                inputMode="numeric"
                aria-label={`Tier ${i + 1} max sq ft`}
                placeholder="none"
                {...register(`areaTiers.${i}.maxSqFt`)}
              />
              <Input
                inputMode="decimal"
                aria-label={`Tier ${i + 1} surcharge`}
                placeholder="0.00"
                {...register(`areaTiers.${i}.surchargeDollars`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove tier"
                onClick={() => areaTiers.remove(i)}
              >
                <Trash2 />
              </Button>
            </div>
            {(errors.areaTiers?.[i]?.minSqFt ||
              errors.areaTiers?.[i]?.maxSqFt ||
              errors.areaTiers?.[i]?.surchargeDollars) && (
              <FieldError>
                {errors.areaTiers[i]?.minSqFt?.message ??
                  errors.areaTiers[i]?.maxSqFt?.message ??
                  errors.areaTiers[i]?.surchargeDollars?.message}
              </FieldError>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() =>
            areaTiers.append({ minSqFt: "0", maxSqFt: "", surchargeDollars: "0" })
          }
        >
          <Plus /> Add tier
        </Button>
      </fieldset>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save pricing"}
        </Button>
      </div>
    </form>
  );
}
