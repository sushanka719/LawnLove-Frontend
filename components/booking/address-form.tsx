"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LocateFixed, MapPin } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { FloatingLabelField } from "@/components/booking/floating-label-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAddresses } from "@/hooks/use-addresses";
import { useSession } from "@/hooks/use-session";
import { getCurrentPosition } from "@/lib/geolocation";
import { geocodeAddress, reverseGeocode, type GeocodeSuggestion } from "@/lib/mapbox";
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
  const [locating, setLocating] = useState(false);

  // Returning, signed-in customers can prefill from a saved address. Guests hit
  // a 401 on /addresses, so only fetch once a session exists.
  const { data: session } = useSession();
  const { data: savedAddresses } = useAddresses({ enabled: !!session });

  const addressValue = watch("address");

  // Coordinates only ever describe the address they were captured for (a picked
  // suggestion or saved address). The moment the user types into the field the
  // text no longer matches those coords, so drop them — otherwise a previous
  // booking's lat/lng ride along with the new address and the property map opens
  // on the old location. Cleared coords make the property step re-geocode the
  // current address. `selectSuggestion`/`applySavedAddress` set the field via
  // `setValue` (no DOM change event), so this handler never fires for them and
  // the coords they set survive.
  const addressField = register("address");
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    addressField.onChange(event);
    setValue("lat", null);
    setValue("lng", null);
  };

  const applySavedAddress = (saved: {
    address: string;
    lat: number | null;
    lng: number | null;
  }) => {
    setValue("address", saved.address, { shouldValidate: true });
    setValue("lat", saved.lat);
    setValue("lng", saved.lng);
    setSuggestions([]);
    setShowSuggestions(false);
  };

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

  // Ask the browser for the device's location, reverse-geocode it to a street
  // address, and drop both the address and its exact coordinates into the form.
  // Like `selectSuggestion`, this uses `setValue` (not a DOM change event), so
  // the coordinates we set here are kept — the manual-edit handler won't wipe
  // them unless the user then types over the field.
  const useCurrentLocation = async () => {
    if (locating) {
      return;
    }
    setLocating(true);
    try {
      const { lat, lng } = await getCurrentPosition();
      const resolved = await reverseGeocode(lng, lat);
      if (!resolved) {
        toast.error("We couldn't find an address for your location. Enter it manually.");
        return;
      }
      setValue("address", resolved, { shouldValidate: true });
      setValue("lat", lat);
      setValue("lng", lng);
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Couldn't get your location. Please try again.",
      );
    } finally {
      setLocating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
      {savedAddresses && savedAddresses.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-lawn-text-secondary text-sm font-medium tracking-tight">
            Use a saved address
          </p>
          <div className="flex flex-wrap gap-2">
            {savedAddresses.map((saved) => (
              <button
                key={saved.id}
                type="button"
                onClick={() => applySavedAddress(saved)}
                className="border-lawn-primary-light text-lawn-text-primary hover:bg-lawn-primary-light/10 flex items-center gap-2 rounded-[10px] border-[1.2px] px-3 py-2 text-sm font-medium tracking-tight transition-colors"
              >
                <MapPin className="text-lawn-primary size-4 shrink-0" />
                {saved.address.split(",")[0].trim()}
              </button>
            ))}
          </div>
        </div>
      ) : null}

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
            {...addressField}
            onChange={handleAddressChange}
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

      <button
        type="button"
        onClick={useCurrentLocation}
        disabled={locating}
        className="text-lawn-primary inline-flex items-center gap-2 self-start text-sm font-semibold tracking-tight disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LocateFixed
          className={`size-4 shrink-0 ${locating ? "animate-pulse" : ""}`}
          aria-hidden
        />
        {locating ? "Detecting your location…" : "Use my current location"}
      </button>

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
