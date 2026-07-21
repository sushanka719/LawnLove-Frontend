"use client";

import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePlan, useUpdatePlan } from "@/hooks/use-plans";
import { ApiError } from "@/lib/api/http";
import type {
  CreatePlanInput,
  Plan,
  PlanInterval,
} from "@/lib/api/plans";
import { centsToDollarString, dollarsToCents } from "@/lib/plans";
import { cn } from "@/lib/utils";
import {
  PLAN_INTERVALS,
  planFormSchema,
  type PlanFormValues,
} from "@/lib/validation/plan-schemas";

const selectClass =
  "border-input h-8 w-full rounded-lg border bg-transparent px-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm";

const labelClass =
  "text-lawn-text-secondary text-sm font-medium tracking-tight";

const INTERVAL_LABELS: Record<PlanInterval, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
};

function toDefaults(plan?: Plan): PlanFormValues {
  if (!plan) {
    return {
      name: "",
      slug: "",
      description: "",
      billingType: "recurring",
      interval: "weekly",
      basePriceDollars: "",
      active: true,
      sortOrder: "0",
      features: [{ value: "" }],
      areaTiers: [{ minSqFt: "0", maxSqFt: "", surchargeDollars: "0" }],
    };
  }
  return {
    name: plan.name,
    slug: plan.slug,
    description: plan.description ?? "",
    billingType: plan.billingType,
    interval: plan.interval ?? "",
    basePriceDollars: centsToDollarString(plan.basePrice),
    active: plan.active,
    sortOrder: String(plan.sortOrder),
    features: plan.features.length
      ? plan.features.map((f) => ({ value: f }))
      : [{ value: "" }],
    areaTiers: plan.areaTiers.map((t) => ({
      minSqFt: String(t.minSqFt),
      maxSqFt: t.maxSqFt == null ? "" : String(t.maxSqFt),
      surchargeDollars: centsToDollarString(t.surcharge),
    })),
  };
}

export function AdminPlanForm({ plan }: { plan?: Plan }) {
  const router = useRouter();
  const isEdit = !!plan;
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan(plan?.id ?? "");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    mode: "onTouched",
    defaultValues: toDefaults(plan),
  });

  const features = useFieldArray({ control, name: "features" });
  const areaTiers = useFieldArray({ control, name: "areaTiers" });
  const billingType = useWatch({ control, name: "billingType" });

  const onSubmit = async (values: PlanFormValues) => {
    const body: CreatePlanInput = {
      name: values.name,
      slug: values.slug || undefined,
      description: values.description || undefined,
      billingType: values.billingType,
      interval:
        values.billingType === "recurring"
          ? (values.interval as PlanInterval)
          : null,
      basePrice: dollarsToCents(values.basePriceDollars),
      features: values.features.map((f) => f.value.trim()).filter(Boolean),
      active: values.active,
      sortOrder: Number(values.sortOrder),
      areaTiers: values.areaTiers.map((t) => ({
        minSqFt: Number(t.minSqFt),
        maxSqFt: t.maxSqFt.trim() === "" ? null : Number(t.maxSqFt),
        surcharge: dollarsToCents(t.surchargeDollars),
      })),
    };

    try {
      if (isEdit) {
        await updatePlan.mutateAsync(body);
        toast.success("Plan updated.");
      } else {
        await createPlan.mutateAsync(body);
        toast.success("Plan created.");
      }
      router.push("/admin/plans");
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't save the plan. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-[820px] flex-col gap-8"
    >
      {/* Details */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-lawn-primary mb-2 text-lg font-semibold">
          Details
        </legend>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="plan-name" className={labelClass}>
            Name
          </label>
          <Input
            id="plan-name"
            maxLength={120}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="plan-slug" className={labelClass}>
            Slug <span className="text-lawn-text-tertiary">(optional)</span>
          </label>
          <Input
            id="plan-slug"
            placeholder="auto-generated from the name"
            maxLength={140}
            aria-invalid={!!errors.slug}
            {...register("slug")}
          />
          <FieldError>{errors.slug?.message}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="plan-description" className={labelClass}>
            Description <span className="text-lawn-text-tertiary">(optional)</span>
          </label>
          <Textarea
            id="plan-description"
            rows={3}
            maxLength={1000}
            aria-invalid={!!errors.description}
            {...register("description")}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </div>
      </fieldset>

      {/* Billing & pricing */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-lawn-primary mb-2 text-lg font-semibold">
          Billing &amp; pricing
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="plan-billing-type" className={labelClass}>
              Billing type
            </label>
            <select
              id="plan-billing-type"
              className={selectClass}
              {...register("billingType")}
            >
              <option value="recurring">Recurring subscription</option>
              <option value="oneTime">One-time</option>
            </select>
          </div>

          {billingType === "recurring" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="plan-interval" className={labelClass}>
                Interval
              </label>
              <select
                id="plan-interval"
                className={selectClass}
                aria-invalid={!!errors.interval}
                {...register("interval")}
              >
                {PLAN_INTERVALS.map((iv) => (
                  <option key={iv} value={iv}>
                    {INTERVAL_LABELS[iv]}
                  </option>
                ))}
              </select>
              <FieldError>{errors.interval?.message}</FieldError>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="plan-base-price" className={labelClass}>
            Base price (USD)
          </label>
          <Input
            id="plan-base-price"
            inputMode="decimal"
            placeholder="32.00"
            aria-invalid={!!errors.basePriceDollars}
            {...register("basePriceDollars")}
          />
          <p className="text-lawn-text-tertiary text-xs">
            Charged each visit before the area surcharge is added.
          </p>
          <FieldError>{errors.basePriceDollars?.message}</FieldError>
        </div>
      </fieldset>

      {/* Features */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-lawn-primary mb-1 text-lg font-semibold">
          Features
        </legend>
        <p className="text-lawn-text-tertiary -mt-1 text-xs">
          Bullet points shown on the plan card. Empty rows are ignored.
        </p>
        {features.fields.map((field, i) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              placeholder="e.g. Priority scheduling"
              maxLength={200}
              {...register(`features.${i}.value`)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove feature"
              onClick={() => features.remove(i)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => features.append({ value: "" })}
        >
          <Plus /> Add feature
        </Button>
      </fieldset>

      {/* Area tiers */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-lawn-primary mb-1 text-lg font-semibold">
          Area surcharge tiers
        </legend>
        <p className="text-lawn-text-tertiary -mt-1 text-xs">
          Non-overlapping, ascending brackets. The surcharge of the bracket the
          measured lawn falls into is added to the base price. Leave the top
          tier&apos;s max blank for no upper limit.
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

      {/* Settings */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-lawn-primary mb-2 text-lg font-semibold">
          Settings
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="plan-sort-order" className={labelClass}>
              Sort order
            </label>
            <Input
              id="plan-sort-order"
              inputMode="numeric"
              aria-invalid={!!errors.sortOrder}
              {...register("sortOrder")}
            />
            <p className="text-lawn-text-tertiary text-xs">
              Lower numbers appear first in the booking flow.
            </p>
            <FieldError>{errors.sortOrder?.message}</FieldError>
          </div>

          <div className="flex items-center gap-2.5 sm:pt-7">
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Checkbox
                  id="plan-active"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              )}
            />
            <label htmlFor="plan-active" className={cn(labelClass, "cursor-pointer")}>
              Active (visible in the booking flow)
            </label>
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : "Create plan"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push("/admin/plans")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
