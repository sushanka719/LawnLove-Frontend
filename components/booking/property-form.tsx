"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { MeasuredAreaCard } from "@/components/booking/measured-area-card";
import { PropertyMap } from "@/components/booking/property-map";
import { BOOKING_STEPS } from "@/lib/booking-steps";
import { polygonAreaSqFt, type LatLng } from "@/lib/geo";
import { geocodeAddress } from "@/lib/mapbox";
import { computeBasePrice, ESTIMATED_AREA_FACTOR } from "@/lib/pricing";
import { useBookingStore } from "@/lib/store/booking-store";

export function PropertyForm() {
  const router = useRouter();
  const address = useBookingStore((state) => state.address);
  const setAddress = useBookingStore((state) => state.setAddress);
  const storedProperty = useBookingStore((state) => state.property);
  const setProperty = useBookingStore((state) => state.setProperty);

  const [points, setPoints] = useState<LatLng[]>(storedProperty.boundary);

  const areaSqFt = useMemo(() => polygonAreaSqFt(points), [points]);
  const estimatedAreaSqFt = Math.round(areaSqFt * ESTIMATED_AREA_FACTOR);
  const totalPrice = computeBasePrice(estimatedAreaSqFt);

  // Coordinates are only captured on the address step when the user picks a
  // geocode suggestion. If they typed the address manually (or arrived from the
  // landing hero search), lat/lng are null — so geocode the address here to
  // center and zoom the map onto their property, and persist the result so the
  // rest of the flow has real coordinates.
  const [center, setCenter] = useState<LatLng | null>(
    address.lat != null && address.lng != null
      ? { lat: address.lat, lng: address.lng }
      : null,
  );

  useEffect(() => {
    if (center || !address.address.trim()) {
      return;
    }

    let active = true;
    geocodeAddress(address.address).then((results) => {
      if (!active || results.length === 0) {
        return;
      }
      const { lat, lng } = results[0];
      setCenter({ lat, lng });
      setAddress({ ...address, lat, lng });
    });

    return () => {
      active = false;
    };
  }, [center, address, setAddress]);

  const handleAddPoint = (point: LatLng) => setPoints((prev) => [...prev, point]);
  const handleMovePoint = (index: number, point: LatLng) =>
    setPoints((prev) => prev.map((existing, i) => (i === index ? point : existing)));
  const handleRemovePoint = (index: number) =>
    setPoints((prev) => prev.filter((_, i) => i !== index));

  const handleUndo = () => setPoints((prev) => prev.slice(0, -1));
  const handleClear = () => setPoints([]);

  const handleContinue = () => {
    setProperty({ boundary: points, areaSqFt, estimatedAreaSqFt, totalPrice });
    router.push(BOOKING_STEPS[2].path);
  };

  return (
    <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:items-start">
      <div className="bg-lawn-bg-2 flex w-full flex-col gap-6 rounded-xl p-8 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)] lg:max-w-[1047px]">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="bg-lawn-primary-light size-2 shrink-0 rounded-full"
            />
            <p className="text-lawn-primary font-heading text-sm font-semibold">
              Step 2 - PROPERTY
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-lawn-text-primary font-heading text-2xl leading-8 font-semibold">
              Confirm your lawn boundary
            </h1>
            <p className="text-lawn-text-secondary text-base leading-6">
              Tap the map to drop corners around your lawn, drag the pins to fine-tune,
              and double-tap a pin to remove it.
            </p>
          </div>
        </div>

        <div className="relative aspect-[889/538] w-full overflow-hidden rounded-xl">
          <PropertyMap
            center={center}
            points={points}
            onAddPoint={handleAddPoint}
            onMovePoint={handleMovePoint}
            onRemovePoint={handleRemovePoint}
            className="h-full w-full"
          />
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleUndo}
              className="bg-lawn-text-primary rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_0px_10px_2px_rgba(255,255,255,0.25)]"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-lawn-text-primary rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_0px_10px_2px_rgba(255,255,255,0.25)]"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-6 lg:max-w-[449px]">
        <MeasuredAreaCard
          areaSqFt={areaSqFt}
          estimatedAreaSqFt={estimatedAreaSqFt}
          totalPrice={totalPrice}
        />

        <div className="flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={handleClear}
            className="border-lawn-primary-light text-lawn-primary bg-lawn-bg-2 w-full rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold"
          >
            Reset boundary
          </button>
          <button
            type="button"
            disabled={points.length < 3}
            onClick={handleContinue}
            className="lawn-gradient-btn w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Looks right - Continue
          </button>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="text-lawn-primary text-lg font-medium underline"
        >
          Go back
        </button>
      </div>
    </div>
  );
}
