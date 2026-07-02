"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SectionHeading } from "@/components/landing/section-heading";

const TESTIMONIALS = [
  {
    quote: "The online booking process took less than five minutes.",
    name: "Michael H, Belgium",
  },
  {
    quote:
      "Booking was incredibly easy, and the lawn looked amazing. I'll definitely schedule service.",
    name: "Peter, Belgium",
  },
  {
    quote:
      "I've tried several lawn care companies, and this has been the most reliable experience.",
    name: "Peter, Belgium",
  },
  {
    quote:
      "Booking was incredibly easy, and the lawn looked amazing. I'll definitely schedule service.",
    name: "David P, Belgium",
    featured: true,
  },
  {
    quote: "Took me two minutes and my lawn has never looked better.",
    name: "Sarah R, Texas",
  },
  { quote: "The boundary tool is genius — felt premium.", name: "Danial, Seattle" },
];

export function Reviews() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  }

  return (
    <section className="bg-lawn-bg-2 flex flex-col items-center justify-center gap-16 overflow-hidden px-[240px] py-24">
      <SectionHeading
        eyebrow="Reviews"
        title="Loved by Homeowners"
        description="See why homeowners trust us for reliable lawn care and hassle-free service."
      />

      <div
        ref={scrollerRef}
        className="flex w-full snap-x snap-mandatory [scrollbar-width:none] gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {TESTIMONIALS.map((testimonial, index) => (
          <div
            key={index}
            className={
              "flex w-84 shrink-0 snap-start flex-col justify-between gap-24 rounded-[10.8px] p-6 " +
              (testimonial.featured ? "bg-lawn-badge-bg" : "bg-[#f5f7ee]")
            }
          >
            <div className="flex flex-col items-start gap-3">
              <span
                className="font-heading text-6xl leading-[72px] text-[#eecb62]"
                aria-hidden
              >
                “
              </span>
              <p className="text-lawn-text-primary text-2xl leading-8 font-semibold tracking-tight">
                “{testimonial.quote}”
              </p>
            </div>
            <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
              {testimonial.name}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-10">
        <button
          type="button"
          aria-label="Previous review"
          onClick={() => scrollByCard(-1)}
          className="bg-lawn-bg-2 flex items-center rounded-lg p-2 drop-shadow-[4px_4px_8px_rgba(0,0,0,0.18)]"
        >
          <ChevronLeft className="text-lawn-text-secondary size-6" />
        </button>
        <button
          type="button"
          aria-label="Next review"
          onClick={() => scrollByCard(1)}
          className="bg-lawn-bg-2 flex items-center rounded-lg p-2 drop-shadow-[4px_4px_8px_rgba(0,0,0,0.18)]"
        >
          <ChevronRight className="text-lawn-text-secondary size-6" />
        </button>
      </div>
    </section>
  );
}
