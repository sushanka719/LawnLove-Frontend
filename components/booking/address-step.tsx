"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AddressForm } from "@/components/booking/address-form";
import { BookingStepCard } from "@/components/booking/booking-step-card";
import { BOOKING_STEPS } from "@/lib/booking-steps";
import { useBookingStore } from "@/lib/store/booking-store";
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

  const defaultAddress = storedAddress.address || prefilledAddress;

  const form = useForm<AddressStepValues>({
    resolver: zodResolver(addressStepSchema),
    defaultValues: {
      phoneNumber: storedAddress.phoneNumber,
      address: defaultAddress,
      lat: storedAddress.lat,
      lng: storedAddress.lng,
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
