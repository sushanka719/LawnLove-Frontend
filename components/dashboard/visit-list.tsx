import { ChevronRight, Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

export type Visit = {
  service: string;
  meta: string;
  price: string;
  status: "scheduled" | "completed";
};

// Static demo data — shared by the Overview and Bookings screens for now.
export const UPCOMING_VISITS: Visit[] = [
  {
    service: "Lawn Mowing",
    meta: "1429 Magnolia Park Dr · Tue, Jun 30 · Morning",
    price: "$66",
    status: "scheduled",
  },
];

export const PAST_VISITS: Visit[] = [
  { service: "Lawn Mowing", meta: "Jun 16 · Morning", price: "$66", status: "completed" },
  { service: "Lawn Mowing", meta: "Jun 16 · Morning", price: "$66", status: "completed" },
  { service: "Lawn Mowing", meta: "Jun 16 · Morning", price: "$66", status: "completed" },
];

function StatusBadge({ status }: { status: Visit["status"] }) {
  const isScheduled = status === "scheduled";
  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-base font-medium tracking-tight",
        isScheduled
          ? "bg-[#dbeafe] text-[#1d4ed8]"
          : "bg-lawn-badge-bg text-lawn-primary",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isScheduled ? "bg-[#1d4ed8]" : "bg-lawn-primary",
        )}
      />
      {isScheduled ? "Scheduled" : "Completed"}
    </span>
  );
}

function VisitInfo({ visit }: { visit: Visit }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <div className="bg-lawn-badge-bg flex size-14 shrink-0 items-center justify-center rounded-xl">
        <Leaf className="text-lawn-primary size-6" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
          {visit.service}
        </p>
        <p className="text-lawn-text-secondary truncate text-base font-medium tracking-tight">
          {visit.meta}
        </p>
      </div>
    </div>
  );
}

export function UpcomingSection({ visits = UPCOMING_VISITS }: { visits?: Visit[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
        Upcoming
      </h2>
      {visits.map((visit, i) => (
        <div
          key={i}
          className="bg-lawn-bg-2 flex items-center gap-6 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] lg:p-8"
        >
          <VisitInfo visit={visit} />
          <div className="flex shrink-0 items-center gap-4">
            <StatusBadge status={visit.status} />
            <span className="text-lawn-text-primary text-lg font-semibold tracking-tight">
              {visit.price}
            </span>
            <ChevronRight
              className="text-lawn-text-secondary size-5 shrink-0"
              strokeWidth={1.75}
            />
          </div>
        </div>
      ))}
    </section>
  );
}

export function PastVisitSection({ visits = PAST_VISITS }: { visits?: Visit[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
        Past Visit
      </h2>
      <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
        {visits.map((visit, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center justify-between gap-4 px-6 py-5",
              i < visits.length - 1 && "border-b border-[#cecece]/40",
            )}
          >
            <VisitInfo visit={visit} />
            <div className="flex shrink-0 items-center gap-4">
              <StatusBadge status={visit.status} />
              <span className="text-lawn-text-primary text-lg font-semibold tracking-tight">
                {visit.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
