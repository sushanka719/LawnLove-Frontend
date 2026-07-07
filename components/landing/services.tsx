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
      className="bg-lawn-bg-1 flex min-h-[calc(100vh)] flex-col items-center justify-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:flex-row lg:gap-10 lg:px-10 lg:py-24 xl:gap-16 xl:px-16 2xl:gap-[172px] 2xl:px-[240px] 2xl:py-32"
    >
      <div className="grid w-full max-w-[400px] shrink-0 grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)] items-start gap-3 sm:gap-5 lg:w-[260px] lg:max-w-none xl:w-[420px] 2xl:w-auto 2xl:grid-cols-[200px_350px]">
        <div className="relative aspect-[200/350] w-full overflow-hidden rounded-[20px] shadow-[0px_8px_24px_0px_rgba(58,53,65,0.2)] 2xl:h-[350px] 2xl:w-[200px]">
          <Image
            src="/landing/service-photo-1.jpg"
            alt="Precision lawn edging"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px] shadow-[0px_8px_24px_0px_rgba(58,53,65,0.2)] 2xl:h-[350px] 2xl:w-[350px]">
          <Image
            src="/landing/service-photo-2.jpg"
            alt="Lawn mower on freshly cut lawn"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex w-full max-w-[698px] min-w-0 flex-1 flex-col items-start gap-2.5">
        <SectionBadge>Our Service</SectionBadge>
        <div className="flex flex-col items-start gap-6 sm:gap-8">
          <div className="flex flex-col items-start gap-3 sm:gap-5">
            <h2 className="text-lawn-text-primary text-2xl leading-tight font-bold tracking-tight sm:text-3xl sm:leading-[1.2] lg:text-4xl lg:leading-[48px]">
              Everything Your Lawn Needs in One Visit
            </h2>
            <p className="text-lawn-text-secondary text-base leading-6 sm:text-xl sm:leading-7">
              Professional lawn care, measured by satellite and priced to fit your yard.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2">
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
