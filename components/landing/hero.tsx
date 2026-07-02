import Image from "next/image";
import { Star, MapPin } from "lucide-react";

import { SectionBadge } from "@/components/landing/section-badge";
import { LawnButton } from "@/components/landing/lawn-button";
import { Input } from "@/components/ui/input";

const TESTIMONIALS = [
  {
    quote:
      "I have a regular schedule to take treatment from GlowQueen, they gave me the best service and treatment ever to maintain",
    name: "Sophia Princeton",
  },
  {
    quote:
      "I have a regular schedule to take treatment from GlowQueen, they gave me the best service and treatment ever to maintain",
    name: "Sophia Princeton",
  },
];

export function Hero() {
  return (
    <section className="bg-lawn-bg-2 relative flex flex-col items-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:gap-10 lg:px-10 lg:py-20 xl:gap-16 xl:px-16 xl:py-24 2xl:px-[240px] 2xl:py-[125px]">
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/landing/hero-photo.png"
          alt=""
          fill
          priority
          aria-hidden
          className="scale-110 object-cover object-top blur-md"
        />
        <div className="bg-lawn-bg-2/80 absolute inset-0" />
      </div>

      <div className="relative flex w-full max-w-[830px] min-w-0 flex-col items-start gap-6 sm:gap-10 lg:max-w-[560px] lg:flex-1 xl:max-w-[700px] 2xl:max-w-[830px]">
        <div className="border-lawn-badge-border bg-lawn-badge-bg text-lawn-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
          <Star className="size-5 shrink-0 fill-current text-[#eecb62]" strokeWidth={0} />
          <span>Trusted by 40,000+ homeowners</span>
        </div>

        <div className="flex flex-col gap-4 sm:gap-8">
          <h1 className="text-lawn-text-primary font-heading text-3xl leading-tight font-bold tracking-tight sm:text-4xl sm:leading-[1.15] lg:text-4xl lg:leading-[1.15] 2xl:text-5xl 2xl:leading-[56px]">
            Lawn Care <span className="text-lawn-primary">Made Easy</span>—from to
            Completion.
          </h1>
          <p className="text-lawn-text-secondary max-w-[707px] text-base leading-6 sm:text-xl sm:leading-7 lg:text-lg lg:leading-7 2xl:text-2xl 2xl:leading-8">
            Skip the hassle of calling multiple companies. Get transparent pricing,
            schedule services online, and enjoy a healthier lawn—all from one place.
          </p>
        </div>

        <form className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-start">
          <div className="border-input relative flex w-full items-center rounded-xl border-[1.2px] sm:w-[297px]">
            <MapPin className="text-lawn-text-secondary absolute left-4 size-5" />
            <Input
              type="text"
              placeholder="Enter your home address"
              className="text-lawn-text-secondary h-auto border-0 py-3 pr-4 pl-11 text-base font-semibold"
            />
          </div>
          <LawnButton href="#quote" className="w-full sm:w-auto">
            Get an Instant Quote
          </LawnButton>
        </form>
      </div>

      <div className="relative hidden aspect-[762/546] w-full min-w-0 shrink-0 lg:block lg:max-w-[400px] lg:flex-1 xl:max-w-[560px] 2xl:max-w-[762px] 2xl:flex-none">
        <Image
          src="/landing/hero-photo.png"
          alt="Lawn care professional"
          fill
          priority
          className="rounded-3xl object-cover object-top"
        />

        {TESTIMONIALS.map((testimonial, index) => (
          <div
            key={index}
            className="absolute hidden w-[405px] flex-col items-start gap-2.5 rounded-2xl bg-white/84 p-6 backdrop-blur-[2px] 2xl:flex"
            style={
              index === 0 ? { left: "500px", top: "0" } : { left: "370px", top: "312px" }
            }
          >
            <span className="font-heading text-3xl leading-5 text-[#eecb62]" aria-hidden>
              “
            </span>
            <p className="text-lawn-text-primary w-[357px] text-base leading-6 tracking-tight">
              {testimonial.quote}
            </p>
            <p className="text-lawn-primary text-lg leading-7 font-bold tracking-tight">
              {testimonial.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
