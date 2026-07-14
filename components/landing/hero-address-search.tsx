"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

import { Input } from "@/components/ui/input";
import { geocodeAddress, type GeocodeSuggestion } from "@/lib/mapbox";

const GEOCODE_DEBOUNCE_MS = 350;

export function HeroAddressSearch() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (address.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      const results = await geocodeAddress(address);
      setSuggestions(results);
    }, GEOCODE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [address]);

  const goToBooking = (value: string) => {
    const trimmed = value.trim();
    router.push(
      trimmed
        ? `/booking/address?address=${encodeURIComponent(trimmed)}`
        : "/booking/address",
    );
  };

  const selectSuggestion = (suggestion: GeocodeSuggestion) => {
    setAddress(suggestion.placeName);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        goToBooking(address);
      }}
      className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-start"
    >
      <div className="border-input relative flex w-full items-center rounded-xl border-[1.2px] sm:w-[297px]">
        <MapPin className="text-lawn-text-secondary absolute left-4 size-5" />
        <Input
          type="text"
          name="address"
          autoComplete="off"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Enter your home address"
          className="text-lawn-text-secondary h-auto border-0 py-3 pr-4 pl-11 text-base font-semibold"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="bg-lawn-bg-2 border-input absolute top-full left-0 z-20 mt-1 w-full overflow-hidden rounded-[10px] border shadow-md">
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
      </div>
      <button
        type="submit"
        className="lawn-gradient-btn inline-flex w-full shrink-0 items-center justify-center rounded-xl px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 sm:w-auto"
      >
        Get an Instant Quote
      </button>
    </form>
  );
}
