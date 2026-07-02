import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

import { SectionHeading } from "@/components/landing/section-heading";
import { LawnButton } from "@/components/landing/lawn-button";

export function BeforeAfter() {
  return (
    <section className="bg-lawn-bg-1 flex flex-col items-center justify-center gap-16 px-[240px] py-24">
      <SectionHeading
        eyebrow="Before & After"
        title="See the Difference Professional Lawn Care Makes"
        description="From overgrown yards to perfectly maintained landscapes, our professionals help keep outdoor spaces looking their best."
      />

      <div className="flex flex-col items-center gap-10">
        <div className="bg-lawn-bg-2 relative flex h-[450px] w-[1440px] items-center gap-1 rounded-3xl">
          <div className="relative h-full w-1/2 overflow-hidden rounded-l-3xl">
            <Image
              src="/landing/after-photo.jpg"
              alt="After professional lawn care"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <span className="text-lawn-text-secondary absolute top-6 left-6 rounded-xl bg-white/50 px-4 py-2 text-base font-semibold tracking-tight">
              AFTER
            </span>
          </div>
          <div className="relative h-full w-1/2 overflow-hidden rounded-r-3xl">
            <Image
              src="/landing/before-photo.jpg"
              alt="Before professional lawn care"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <span className="text-lawn-text-secondary absolute top-6 right-6 rounded-xl bg-white/50 px-4 py-2 text-base font-semibold tracking-tight">
              BEFORE
            </span>
          </div>
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white p-3">
            <MoveHorizontal className="text-lawn-text-secondary size-6" />
          </div>
        </div>

        <LawnButton href="#quote">Book your First Service</LawnButton>
      </div>
    </section>
  );
}
