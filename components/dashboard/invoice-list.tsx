"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Pagination } from "@/components/dashboard/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvoices } from "@/hooks/use-bookings";
import type { InvoiceListItem } from "@/lib/api/booking";
import { cn } from "@/lib/utils";
import { formatCents, formatScheduleDate } from "@/lib/jobs";

const PAGE_SIZE = 10;

export function InvoiceList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isPlaceholderData } = useInvoices(page, PAGE_SIZE);

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load your invoices. Please refresh and try again.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  const invoices = data?.items ?? [];

  if (invoices.length === 0) {
    return (
      <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-10 text-center text-base">
        No invoices yet. Receipts appear here after your first completed visit.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
        {invoices.map((invoice, i) => (
          <InvoiceRow
            key={invoice.jobId}
            invoice={invoice}
            last={i === invoices.length - 1}
          />
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        disabled={isPlaceholderData}
      />
    </section>
  );
}

function InvoiceRow({ invoice, last }: { invoice: InvoiceListItem; last: boolean }) {
  return (
    <Link
      href={`/dashboard/jobs/${invoice.jobId}`}
      className={cn(
        "flex items-center gap-4 px-6 py-5 transition hover:bg-black/[0.02] sm:gap-8",
        !last && "border-b border-[#cecece]/40",
      )}
    >
      <p className="text-lawn-text-primary hidden w-24 shrink-0 text-lg tracking-tight sm:block">
        {invoice.invoiceNumber}
      </p>
      <div className="min-w-0 flex-1">
        <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
          {invoice.serviceLabel}
        </p>
        <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
          {formatScheduleDate(invoice.servicedOn)}
        </p>
      </div>
      {invoice.refunded ? (
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-neutral-200 px-4 py-1.5 text-base font-medium tracking-tight text-neutral-600 sm:flex">
          <span className="size-1.5 rounded-full bg-current opacity-70" />
          Refunded
        </span>
      ) : (
        <span className="bg-lawn-badge-bg text-lawn-primary hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-base font-medium tracking-tight sm:flex">
          <span className="bg-lawn-primary size-1.5 rounded-full" />
          Paid
        </span>
      )}
      <span className="text-lawn-text-primary shrink-0 text-lg font-semibold tracking-tight">
        {formatCents(invoice.amount)}
      </span>
      <ChevronRight
        className="text-lawn-text-secondary size-5 shrink-0"
        strokeWidth={1.75}
      />
    </Link>
  );
}
