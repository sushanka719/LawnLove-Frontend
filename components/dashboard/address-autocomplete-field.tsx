"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

import { FloatingLabelField } from "@/components/booking/floating-label-field";
import { geocodeAddress, type GeocodeSuggestion } from "@/lib/mapbox";

const GEOCODE_DEBOUNCE_MS = 350;

export type AddressSelection = { address: string; lat: number; lng: number };

type AddressAutocompleteFieldProps = {
  /** Controlled text value of the field. */
  value: string;
  /** Fires as the user types (coordinates should be treated as unknown). */
  onValueChange: (value: string) => void;
  /** Fires when a Mapbox suggestion is chosen (carries coordinates). */
  onSelect: (selection: AddressSelection) => void;
  error?: string;
  disabled?: boolean;
  /** Seeds the floating-label state when the field mounts pre-filled (edit). */
  initialValue?: string;
  autoFocus?: boolean;
};

// Mapbox address autocomplete extracted from the booking address form
// (components/booking/address-form.tsx) so the dashboard add/edit dialog reuses
// the exact debounced-geocode + suggestions-dropdown behavior.
export function AddressAutocompleteField({
  value,
  onValueChange,
  onSelect,
  error,
  disabled,
  initialValue,
  autoFocus,
}: AddressAutocompleteFieldProps) {
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Skip the geocode fetch for a value that was just applied from a selection,
  // so choosing a suggestion doesn't immediately re-open the dropdown.
  const justSelected = useRef(false);

  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }

    const timeout = setTimeout(async () => {
      if (!value || value.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      const results = await geocodeAddress(value);
      setSuggestions(results);
    }, GEOCODE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [value]);

  const selectSuggestion = (suggestion: GeocodeSuggestion) => {
    justSelected.current = true;
    onSelect({
      address: suggestion.placeName,
      lat: suggestion.lat,
      lng: suggestion.lng,
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <FloatingLabelField
        label="Address"
        icon={<MapPin className="text-lawn-text-secondary size-5 shrink-0" />}
        value={value}
        defaultValue={initialValue}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="off"
        aria-invalid={!!error}
        onChange={(event) => onValueChange(event.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="bg-lawn-bg-2 border-input absolute top-full z-10 mt-1 max-h-56 w-full overflow-auto rounded-[10px] border shadow-md">
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

      {error ? <p className="text-destructive mt-1.5 text-sm">{error}</p> : null}
    </div>
  );
}
