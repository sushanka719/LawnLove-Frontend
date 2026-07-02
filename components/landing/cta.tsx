import Image from "next/image";

import { LawnButton } from "@/components/landing/lawn-button";

export function Cta() {
  return (
    <section className="bg-lawn-bg-2 flex items-center justify-center px-[240px] py-24">
      <div className="relative h-[437px] w-full overflow-hidden rounded-[32px]">
        <Image
          src="/landing/cta-background.png"
          alt="Freshly mowed backyard lawn"
          fill
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="bg-lawn-primary/35 absolute inset-0" />

        <div className="absolute top-1/2 left-1/2 flex w-[1018px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-heading text-4xl leading-[48px] font-bold text-white">
              Your Lawn Deserves Professional Care
            </h2>
            <p className="max-w-[868px] text-xl leading-7 text-[#ebebeb]">
              Book trusted local lawn care professionals in minutes and enjoy reliable
              service, transparent pricing, and a healthier outdoor space—all without the
              hassle.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LawnButton href="#signup" variant="outline-light">
              Sign up
            </LawnButton>
            <LawnButton href="#quote">Get an Instant Quote</LawnButton>
          </div>
        </div>
      </div>
    </section>
  );
}
