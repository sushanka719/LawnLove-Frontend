"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

import { SectionHeading } from "@/components/landing/section-heading";
import { LawnButton } from "@/components/landing/lawn-button";

export function BeforeAfter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, ratio)));
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      setPosition((value) => Math.max(0, value - 5));
    } else if (event.key === "ArrowRight") {
      setPosition((value) => Math.min(100, value + 5));
    }
  };

  return (
    <section className="bg-lawn-bg-1 flex flex-col items-center justify-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:gap-16 lg:px-[240px]">
      <SectionHeading
        eyebrow="Before & After"
        title="See the Difference Professional Lawn Care Makes"
        description="From overgrown yards to perfectly maintained landscapes, our professionals help keep outdoor spaces looking their best."
      />

      <div className="flex w-full flex-col items-center gap-10">
        <div
          ref={containerRef}
          className="bg-lawn-bg-2 relative h-[220px] w-full max-w-[1440px] touch-none rounded-3xl select-none sm:h-[320px] lg:h-[450px]"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <Image
              src="/landing/after-photo.jpg"
              alt="After professional lawn care"
              fill
              sizes="(min-width: 1536px) 1440px, 100vw"
              className="object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/20" />
            <span className="text-lawn-text-secondary absolute top-3 right-3 rounded-xl bg-white/50 px-3 py-1.5 text-sm font-semibold tracking-tight sm:top-6 sm:right-6 sm:px-4 sm:py-2 sm:text-base">
              AFTER
            </span>
          </div>

          <div
            className="absolute inset-0 overflow-hidden rounded-3xl"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image
              src="/landing/before-photo.jpg"
              alt="Before professional lawn care"
              fill
              sizes="(min-width: 1536px) 1440px, 100vw"
              className="object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/20" />
            <span className="text-lawn-text-secondary absolute top-3 left-3 rounded-xl bg-white/50 px-3 py-1.5 text-sm font-semibold tracking-tight sm:top-6 sm:left-6 sm:px-4 sm:py-2 sm:text-base">
              BEFORE
            </span>
          </div>

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white"
            style={{ left: `${position}%` }}
          />

          <div
            role="slider"
            tabIndex={0}
            aria-label="Before and after comparison slider"
            aria-valuenow={Math.round(position)}
            aria-valuemin={0}
            aria-valuemax={100}
            onKeyDown={handleKeyDown}
            className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-lg bg-white p-2 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:p-3"
            style={{ left: `${position}%` }}
          >
            <MoveHorizontal className="text-lawn-text-secondary size-5 sm:size-6" />
          </div>
        </div>

        <LawnButton href="#quote">Book your First Service</LawnButton>
      </div>
    </section>
  );
}
