import Image from "next/image";

import { LawnButton } from "@/components/landing/lawn-button";

export function Cta() {
  return (
    <section
      id="contact"
      className="bg-lawn-bg-2 flex min-h-screen scroll-mt-5 items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-[240px]"
    >
      <div className="relative h-[420px] w-full overflow-hidden rounded-[20px] sm:h-[437px] sm:rounded-[32px]">
        <Image
          src="/landing/cta-background.png"
          alt="Freshly mowed backyard lawn"
          fill
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="bg-lawn-primary/35 absolute inset-0" />

        <div className="absolute top-1/2 left-1/2 flex w-full max-w-[1018px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 px-6 sm:gap-8">
          <div className="flex flex-col items-center gap-4 text-center sm:gap-6">
            <h2 className="font-heading text-2xl leading-tight font-bold text-white sm:text-3xl sm:leading-[1.2] lg:text-4xl lg:leading-[48px]">
              Your Lawn Deserves Professional Care
            </h2>
            <p className="max-w-[868px] text-base leading-6 text-[#ebebeb] sm:text-xl sm:leading-7">
              Book trusted local lawn care professionals in minutes and enjoy reliable
              service, transparent pricing, and a healthier outdoor space—all without the
              hassle.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <LawnButton href="/signup" variant="outline-light">
              Sign up
            </LawnButton>
            <LawnButton href="#quote">Get an Instant Quote</LawnButton>
          </div>
        </div>
      </div>
    </section>
  );
}
