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
    <section className="bg-lawn-bg-2 relative flex items-center overflow-hidden px-[240px] pt-[125px] pb-[125px]">
      <div className="flex w-[830px] flex-col items-start gap-10">
        <SectionBadge className="gap-2">
          <Star className="size-5 shrink-0 fill-current" strokeWidth={0} />
          Trusted by 40,000+ homeowners
        </SectionBadge>

        <div className="flex flex-col gap-8">
          <h1 className="text-lawn-text-primary font-heading text-5xl leading-[56px] font-bold tracking-tight">
            Lawn Care <span className="text-lawn-primary">Made Easy</span>—from to
            Completion.
          </h1>
          <p className="text-lawn-text-secondary max-w-[707px] text-2xl leading-8">
            Skip the hassle of calling multiple companies. Get transparent pricing,
            schedule services online, and enjoy a healthier lawn—all from one place.
          </p>
        </div>

        <form className="flex items-start gap-4">
          <div className="border-input relative flex w-[297px] items-center rounded-xl border-[1.2px]">
            <MapPin className="text-lawn-text-secondary absolute left-4 size-5" />
            <Input
              type="text"
              placeholder="Enter your home address"
              className="text-lawn-text-secondary h-auto border-0 py-3 pr-4 pl-11 text-base font-semibold"
            />
          </div>
          <LawnButton href="#quote">Get an Instant Quote</LawnButton>
        </form>
      </div>

      <div className="pointer-events-none absolute top-1/2 right-[240px] h-[546px] w-[762px] -translate-y-1/2">
        <Image
          src="/landing/hero-photo.png"
          alt="Lawn care professional"
          fill
          priority
          className="object-cover object-top"
        />

        {TESTIMONIALS.map((testimonial, index) => (
          <div
            key={index}
            className="absolute flex w-[405px] flex-col items-start gap-2.5 rounded-2xl bg-white/84 p-6 backdrop-blur-sm"
            style={
              index === 0 ? { left: "116px", top: "0" } : { left: "0", top: "312px" }
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
