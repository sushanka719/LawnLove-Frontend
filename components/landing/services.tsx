import Image from "next/image";

import { SectionBadge } from "@/components/landing/section-badge";

const SERVICE_ITEMS = [
  "Precision cut to the ideal height",
  "Crisp, defined edging",
  "String-trimmed borders & beds",
  "Walkways & driveway blown clean",
  "Photo summary after every visit",
  "The same trusted pro each time",
];

export function Services() {
  return (
    <section
      id="services"
      className="bg-lawn-bg-1 flex items-center justify-center gap-[172px] px-[240px] py-32"
    >
      <div className="grid shrink-0 grid-cols-[200px_350px] items-start gap-5">
        <div className="relative h-[350px] w-[200px] overflow-hidden rounded-[20px] shadow-[0px_8px_24px_0px_rgba(58,53,65,0.2)]">
          <Image
            src="/landing/service-photo-1.jpg"
            alt="Precision lawn edging"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative h-[350px] w-[350px] overflow-hidden rounded-[20px] shadow-[0px_8px_24px_0px_rgba(58,53,65,0.2)]">
          <Image
            src="/landing/service-photo-2.jpg"
            alt="Lawn mower on freshly cut lawn"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex w-[698px] flex-col items-start gap-2.5">
        <SectionBadge>Our Service</SectionBadge>
        <div className="flex flex-col items-start gap-8">
          <div className="flex flex-col items-start gap-5">
            <h2 className="text-lawn-text-primary text-4xl leading-[48px] font-bold tracking-tight">
              Everything Your Lawn Needs in One Visit
            </h2>
            <p className="text-lawn-text-secondary text-xl leading-7">
              Professional lawn care, measured by satellite and priced to fit your yard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {SERVICE_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <span className="bg-lawn-primary-light size-2 shrink-0 rounded-full" />
                <p className="text-lawn-text-secondary text-base leading-6 tracking-tight">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
