import Image from "next/image";

import { SectionHeading } from "@/components/landing/section-heading";

const STEPS = [
  {
    icon: "/landing/step-icon-1.svg",
    title: "Enter your Address",
    description: "We pull your property from satellite in a second.",
    arc: "left" as const,
  },
  {
    icon: "/landing/step-icon-2.svg",
    title: "Outline your Lawn",
    description: "Tap the satellite map to measure it precisely.",
    arc: "right" as const,
  },
  {
    icon: "/landing/step-icon-3.svg",
    title: "Schedule your visit.",
    description: "Choose a day and time that suits you.",
    arc: "left" as const,
  },
  {
    icon: "/landing/step-icon-3.svg",
    title: "Relax",
    description: "Vetted arrives on schedule, completes the work.",
    arc: null,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-lawn-bg-2 flex scroll-mt-5 flex-col items-center justify-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:min-h-screen lg:gap-16 lg:px-10 lg:py-24 xl:px-16 xl:py-28 2xl:gap-22 2xl:px-[240px] 2xl:py-32"
    >
      <SectionHeading
        eyebrow="How It Works"
        title="Book Lawn Care in Three Simple Steps"
        description="From quote to completed service, we've made lawn care simple and stress-free."
      />

      <div className="grid w-full max-w-[1440px] grid-cols-1 items-start gap-10 sm:grid-cols-2 lg:flex lg:gap-6 xl:gap-10 2xl:gap-[177px]">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className="relative flex flex-1 flex-col items-center gap-5 text-center"
          >
            {step.arc ? (
              <Image
                src={`/landing/arc-${step.arc}.png`}
                alt=""
                width={248}
                height={28}
                className={
                  step.arc === "left"
                    ? "pointer-events-none absolute top-1/2 left-[calc(50%+63px)] hidden -translate-y-[79px] 2xl:block"
                    : "pointer-events-none absolute top-1/2 left-[calc(50%+63px)] hidden -translate-y-[4px] -scale-y-100 2xl:block"
                }
              />
            ) : null}

            <div className="border-lawn-bg-1 flex size-[100px] items-center justify-center rounded-full border bg-[url('/landing/step-icon-bg.svg')] bg-cover">
              <Image src={step.icon} alt="" width={45} height={45} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-lawn-primary text-lg leading-7 font-semibold">
                {step.title}
              </h3>
              <p className="text-lawn-text-secondary max-w-[203px] text-base leading-6">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
