import { Download } from "lucide-react";

import { cn } from "@/lib/utils";

export type Invoice = {
  number: string;
  service: string;
  meta: string;
  amount: string;
};

// Static demo data for now.
export const INVOICES: Invoice[] = [
  { number: "INV-2041", service: "Lawn Mowing", meta: "Jun 16 · Morning", amount: "$66" },
  { number: "INV-2041", service: "Lawn Mowing", meta: "Jun 16 · Morning", amount: "$66" },
  { number: "INV-2041", service: "Lawn Mowing", meta: "Jun 16 · Morning", amount: "$66" },
];

function InvoiceRow({ invoice, last }: { invoice: Invoice; last: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-6 py-5 sm:gap-8",
        !last && "border-b border-[#cecece]/40",
      )}
    >
      <p className="text-lawn-text-primary hidden w-20 shrink-0 text-lg tracking-tight sm:block">
        {invoice.number}
      </p>
      <div className="min-w-0 flex-1">
        <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
          {invoice.service}
        </p>
        <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
          {invoice.meta}
        </p>
      </div>
      <span className="bg-lawn-badge-bg text-lawn-primary hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-base font-medium tracking-tight sm:flex">
        <span className="bg-lawn-primary size-1.5 rounded-full" />
        Paid
      </span>
      <span className="text-lawn-text-primary shrink-0 text-lg font-semibold tracking-tight">
        {invoice.amount}
      </span>
      <button
        type="button"
        aria-label={`Download ${invoice.number}`}
        className="text-lawn-text-secondary hover:text-lawn-primary flex shrink-0 items-center rounded-xl border-[1.2px] border-[#999] px-4 py-3 transition-colors"
      >
        <Download className="size-6" strokeWidth={1.75} />
      </button>
    </div>
  );
}

export function InvoiceList({ invoices = INVOICES }: { invoices?: Invoice[] }) {
  return (
    <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
      {invoices.map((invoice, i) => (
        <InvoiceRow key={i} invoice={invoice} last={i === invoices.length - 1} />
      ))}
    </div>
  );
}
