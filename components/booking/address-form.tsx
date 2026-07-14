"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { FloatingLabelField } from "@/components/booking/floating-label-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { geocodeAddress, type GeocodeSuggestion } from "@/lib/mapbox";
import type { AddressStepValues } from "@/lib/validation/booking-schemas";

const GEOCODE_DEBOUNCE_MS = 350;

type AddressFormProps = {
  form: UseFormReturn<AddressStepValues>;
  defaultAddress: string;
  onSubmit: (values: AddressStepValues) => void;
};

export function AddressForm({ form, defaultAddress, onSubmit }: AddressFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addressValue = watch("address");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!addressValue || addressValue.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      const results = await geocodeAddress(addressValue);
      setSuggestions(results);
    }, GEOCODE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [addressValue]);

  const selectSuggestion = (suggestion: GeocodeSuggestion) => {
    setValue("address", suggestion.placeName, { shouldValidate: true });
    setValue("lat", suggestion.lat);
    setValue("lng", suggestion.lng);
    setSuggestions([]);
    setShowSuggestions(false);
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

        <Field className="relative">
          <FloatingLabelField
            label="Address"
            icon={<MapPin className="text-lawn-text-secondary size-5 shrink-0" />}
            defaultValue={defaultAddress}
            {...register("address")}
            aria-invalid={!!errors.address}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            autoComplete="off"
          />
          <FieldError>{errors.address?.message}</FieldError>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="bg-lawn-bg-2 border-input absolute top-full z-10 mt-1 w-full overflow-hidden rounded-[10px] border shadow-md">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectSuggestion(suggestion)}
                    className="hover:bg-lawn-primary-light/20 text-lawn-text-primary w-full px-4 py-2.5 text-left text-sm"
                  >
                    {suggestion.placeName}
                  </button>
                </li>
              ))}
            </ul>
          )}
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
