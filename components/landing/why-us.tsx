import Image from "next/image";

import { SectionHeading } from "@/components/landing/section-heading";

const FEATURES = [
  {
    icon: "/landing/whyus-icon-verified.svg",
    title: "Verified Professionals",
    description: "Trusted by communities.",
  },
  {
    icon: "/landing/whyus-icon-pricing.svg",
    title: "Transparent Pricing",
    description: "No hidden fees or surprise charges.",
  },
  {
    icon: "/landing/whyus-icon-scheduling.svg",
    title: "Flexible Scheduling",
    description: "Choose services that fits your routine.",
  },
  {
    icon: "/landing/whyus-icon-quality.svg",
    title: "Quality You Can Trust",
    description: "Review and support trusted workers.",
  },
];

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="bg-lawn-bg-2 flex min-h-[calc(100vh)] flex-col items-center justify-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:gap-16 lg:px-[240px]"
    >
      <SectionHeading eyebrow="Why Lawnlove" title="Why Homeowners Choose Us" />

      <div className="flex w-full flex-col items-start gap-10 lg:gap-16">
        <div className="grid w-full grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:flex">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-1 items-center gap-4">
              <div className="bg-lawn-bg-2 shrink-0 rounded-lg p-2 drop-shadow-[4px_4px_8px_rgba(0,0,0,0.18)]">
                <Image src={feature.icon} alt="" width={24} height={24} />
              </div>
              <div className="flex flex-1 flex-col items-start gap-0.5 tracking-tight">
                <h3 className="text-lawn-primary text-lg leading-7 font-semibold">
                  {feature.title}
                </h3>
                <p className="text-lawn-text-secondary text-base leading-6">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative h-[220px] w-full overflow-hidden rounded-tl-[40px] rounded-tr-2xl rounded-br-[40px] rounded-bl-2xl sm:h-[320px] lg:h-[450px] lg:rounded-tl-[80px] lg:rounded-tr-3xl lg:rounded-br-[80px] lg:rounded-bl-3xl">
          <Image
            src="/landing/whyus-banner.jpg"
            alt="Professional mowing a lawn"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/24" />
        </div>
      </div>
    </section>
  );
}
