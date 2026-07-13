"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useForm } from "react-hook-form";

import { FloatingLabelField } from "@/components/booking/floating-label-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { BOOKING_STEPS } from "@/lib/booking-steps";
import {
  addressStepSchema,
  type AddressStepValues,
} from "@/lib/validation/booking-schemas";

export function AddressForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledAddress = searchParams.get("address") ?? "";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressStepValues>({
    resolver: zodResolver(addressStepSchema),
    defaultValues: { phoneNumber: "", address: prefilledAddress },
  });

  const onSubmit = async () => {
    router.push(BOOKING_STEPS[1].path);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
      <FieldGroup className="gap-4">
        <Field>
          <Input
            type="tel"
            placeholder="Phone number"
            {...register("phoneNumber")}
            aria-invalid={!!errors.phoneNumber}
            className="bg-lawn-bg-2 border-input text-lawn-text-secondary h-auto w-full rounded-[10px] px-4 py-3 text-base"
          />
          <FieldError>{errors.phoneNumber?.message}</FieldError>
        </Field>

        <Field>
          <FloatingLabelField
            label="Address"
            icon={<MapPin className="text-lawn-text-secondary size-5 shrink-0" />}
            defaultValue={prefilledAddress}
            {...register("address")}
            aria-invalid={!!errors.address}
          />
          <FieldError>{errors.address?.message}</FieldError>
        </Field>
      </FieldGroup>

      <div className="flex w-full gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-lawn-primary-light text-lawn-primary h-auto flex-1 rounded-xl border-[1.2px] bg-transparent px-8 py-3 text-base font-semibold shadow-none hover:bg-transparent"
        >
          Go back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="lawn-gradient-btn h-auto flex-1 rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
