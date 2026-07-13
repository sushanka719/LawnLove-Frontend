import { Suspense } from "react";
import Image from "next/image";

import { AddressForm } from "@/components/booking/address-form";
import { BookingStepCard } from "@/components/booking/booking-step-card";

export default function AddressStepPage() {
  return (
    <main className="flex justify-center px-4 pb-16 sm:px-6 lg:px-10 xl:px-16 2xl:px-[240px]">
      <div className="flex w-full max-w-[1520px] flex-col items-start gap-8 lg:flex-row lg:justify-center">
        <BookingStepCard
          eyebrow="Step 1 - ADDRESS"
          title="Confirm your details"
          description="Enter your contact address and confirm your address for future use."
          className="max-w-[687px]"
        >
          <Suspense>
            <AddressForm />
          </Suspense>
        </BookingStepCard>

        <div className="relative aspect-[490/362] w-full max-w-[490px] shrink-0 overflow-hidden rounded-xl">
          <Image
            src="/booking/address-hero.png"
            alt="Lawn care crew mowing a front yard"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(105,105,105,0.2)]" />
        </div>
      </div>
    </main>
  );
}
