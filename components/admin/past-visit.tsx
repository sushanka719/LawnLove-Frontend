import { Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

type Visit = {
  id: string;
  service: string;
  when: string;
  status: "Completed" | "Scheduled" | "Cancelled";
  amount: string;
};

const VISITS: Visit[] = [
  { id: "1", service: "Lawn Mowing", when: "Jun 16 · Morning", status: "Completed", amount: "$66" },
  { id: "2", service: "Hedge Trimming", when: "Jun 15 · Afternoon", status: "Completed", amount: "$124" },
  { id: "3", service: "Fertilization", when: "Jun 14 · Morning", status: "Scheduled", amount: "$89" },
  { id: "4", service: "Leaf Removal", when: "Jun 12 · Evening", status: "Cancelled", amount: "$152" },
];

const STATUS_COLOR: Record<Visit["status"], string> = {
  Completed: "var(--chart-2)",
  Scheduled: "var(--chart-3)",
  Cancelled: "var(--destructive)",
};

export function PastVisit() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold tracking-[-0.01em]">Past Visit</h2>
      <div className="bg-card overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.1)]">
        {VISITS.map((visit, i) => (
          <div
            key={visit.id}
            className={cn(
              "flex items-center gap-4 px-6 py-5",
              i !== VISITS.length - 1 && "border-border border-b",
            )}
          >
            <div className="bg-accent text-primary flex size-14 shrink-0 items-center justify-center rounded-xl">
              <Leaf className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{visit.service}</p>
              <p className="text-muted-foreground text-sm">{visit.when}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground inline-flex items-center gap-2 text-sm font-medium">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLOR[visit.status] }}
                />
                {visit.status}
              </span>
              <span className="w-12 text-right text-lg font-bold tabular-nums">
                {visit.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
