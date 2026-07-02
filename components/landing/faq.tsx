"use client";

import { Accordion } from "@base-ui/react/accordion";
import { Plus, Minus } from "lucide-react";

import { SectionBadge } from "@/components/landing/section-badge";

const FAQ_ITEMS = [
  {
    question: "How much does lawn care cost?",
    answer:
      "Pricing depends on factors like your lawn size, location, and the services you choose. You'll receive an upfront quote before confirming your booking, so you always know exactly what you'll pay—no hidden fees or surprises.",
  },
  {
    question: "How do I know the professionals are qualified?",
    answer:
      "Every pro on our platform is background-checked and vetted before they can accept a booking, and homeowner reviews keep them accountable after every visit.",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "Reach out within 24 hours of your service and we'll work with your pro to make it right, free of charge.",
  },
  {
    question: "What happens if I need to reschedule?",
    answer:
      "You can reschedule or cancel directly from your account up to 24 hours before your visit at no extra cost.",
  },
  {
    question: "Can I schedule recurring service?",
    answer:
      "Yes—set up weekly, biweekly, or monthly visits and we'll automatically book your trusted pro on the same schedule.",
  },
];

export function Faq() {
  return (
    <section className="bg-lawn-bg-2 flex flex-col items-start gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:flex-row lg:gap-10 lg:px-10 lg:py-24 xl:gap-16 xl:px-16 2xl:gap-24 2xl:px-[240px]">
      <div className="flex w-full min-w-0 flex-col items-start justify-center gap-4 lg:w-[300px] lg:shrink-0 xl:w-[400px] 2xl:w-[658px]">
        <SectionBadge>FAQ</SectionBadge>
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <h2 className="text-lawn-text-primary text-2xl leading-tight font-bold tracking-tight sm:text-3xl sm:leading-[1.2] lg:text-4xl lg:leading-[48px]">
            Frequently Asked Questions
          </h2>
          <p className="text-lawn-text-secondary max-w-[526px] text-base leading-6 sm:text-xl sm:leading-7">
            Have questions? We&apos;ve answered the most common ones below.
          </p>
        </div>
      </div>

      <Accordion.Root className="flex w-full min-w-0 flex-1 flex-col items-start gap-4">
        {FAQ_ITEMS.map((item) => (
          <Accordion.Item
            key={item.question}
            className="bg-lawn-bg-2 w-full overflow-hidden rounded-[14px] shadow-[0px_4px_16px_0px_rgba(111,111,111,0.18)]"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-6">
                <span className="text-lawn-primary text-base leading-6 font-semibold tracking-tight sm:text-lg sm:leading-7">
                  {item.question}
                </span>
                <Plus className="text-lawn-primary size-4 shrink-0 group-data-[panel-open]:hidden" />
                <Minus className="text-lawn-primary hidden size-4 shrink-0 group-data-[panel-open]:block" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="text-lawn-text-secondary px-4 pb-4 text-base leading-6 tracking-tight sm:px-6">
              {item.answer}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
