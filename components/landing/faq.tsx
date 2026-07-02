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
    <section className="bg-lawn-bg-2 flex items-start gap-24 px-[240px] py-24">
      <div className="flex w-[658px] shrink-0 flex-col items-start justify-center gap-4">
        <SectionBadge>FAQ</SectionBadge>
        <div className="flex flex-col items-start gap-6">
          <h2 className="text-lawn-text-primary text-4xl leading-[48px] font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lawn-text-secondary max-w-[526px] text-xl leading-7">
            Have questions? We&apos;ve answered the most common ones below.
          </p>
        </div>
      </div>

      <Accordion.Root className="flex flex-1 flex-col items-start gap-4">
        {FAQ_ITEMS.map((item) => (
          <Accordion.Item
            key={item.question}
            className="bg-lawn-bg-2 w-full overflow-hidden rounded-[14px] shadow-[0px_4px_16px_0px_rgba(111,111,111,0.18)]"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
                <span className="text-lawn-primary text-lg leading-7 font-semibold tracking-tight">
                  {item.question}
                </span>
                <Plus className="text-lawn-primary size-4 shrink-0 group-data-[panel-open]:hidden" />
                <Minus className="text-lawn-primary hidden size-4 shrink-0 group-data-[panel-open]:block" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="text-lawn-text-secondary px-6 pb-4 text-base leading-6 tracking-tight">
              {item.answer}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
