"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AddressForm } from "@/components/booking/address-form";
import { BookingStepCard } from "@/components/booking/booking-step-card";
import { BOOKING_STEPS } from "@/lib/booking-steps";
import { useBookingStore } from "@/lib/store/booking-store";
import { useConfirmationStore } from "@/lib/store/confirmation-store";
import {
  addressStepSchema,
  type AddressStepValues,
} from "@/lib/validation/booking-schemas";

export function AddressStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledAddress = searchParams.get("address") ?? "";
  const storedAddress = useBookingStore((state) => state.address);
  const setStoredAddress = useBookingStore((state) => state.setAddress);
  const clearConfirmation = useConfirmationStore((state) => state.clearConfirmation);

  // The address step is where a booking flow begins. A confirmation snapshot
  // left over from a booking completed earlier this session is now stale — drop
  // it so it can't later let the user reach /booking/confirmed mid-flow (the
  // route guard treats a present snapshot as proof a booking just completed).
  useEffect(() => {
    clearConfirmation();
    // Run once on mount, as the flow starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // An address coming from the landing hero (?address=) is the user's latest
  // intent, so it wins over any stale value left in the store from a previous
  // session. When there's no hero param, fall back to the stored address so
  // returning to this step mid-flow keeps what they entered.
  const defaultAddress = prefilledAddress || storedAddress.address;

  // Persist the hero address into the store (clearing any coordinates that
  // belonged to a different, previously-stored address) and strip the param so
  // it can't later override edits the user makes on this step.
  useEffect(() => {
    if (!prefilledAddress) {
      return;
    }
    if (prefilledAddress !== storedAddress.address) {
      setStoredAddress({
        phoneNumber: storedAddress.phoneNumber,
        address: prefilledAddress,
        lat: null,
        lng: null,
      });
    }
    router.replace("/booking/address");
    // Run once on mount to consume the incoming param.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<AddressStepValues>({
    resolver: zodResolver(addressStepSchema),
    defaultValues: {
      phoneNumber: storedAddress.phoneNumber,
      address: defaultAddress,
      lat: prefilledAddress ? null : storedAddress.lat,
      lng: prefilledAddress ? null : storedAddress.lng,
    },
  });

  const onSubmit = (values: AddressStepValues) => {
    setStoredAddress(values);
    router.push(BOOKING_STEPS[1].path);
  };

  return (
    <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:justify-center">
      <BookingStepCard
        eyebrow="Step 1 - ADDRESS"
        title="Confirm your details"
        description="Enter your contact address and confirm your address for future use."
        className="max-w-[687px]"
      >
        <AddressForm form={form} defaultAddress={defaultAddress} onSubmit={onSubmit} />
      </BookingStepCard>

      <div className="relative aspect-[490/362] w-full max-w-[490px] shrink-0 overflow-hidden rounded-xl">
        <Image
          src="/booking/address-hero.png"
          alt="LawnLove professionals mowing a lawn"
          fill
          sizes="(min-width: 1024px) 490px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(105,105,105,0.2)]" />
      </div>
    </div>
  );
}
