import { Clock, TrendingUp } from "lucide-react";

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {/* Next visit */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2d5a27]/10 bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="absolute -top-7 right-6 size-24 rounded-full bg-[#2d5a27] opacity-5" />
        <p className="text-lawn-text-secondary relative text-base tracking-tight">
          NEXT VISIT
        </p>
        <p className="text-lawn-text-primary relative mt-3 text-[32px] font-bold tracking-tight">
          Jun 30
        </p>
        <div className="text-lawn-text-secondary relative mt-1.5 flex items-center gap-1.5 text-base tracking-tight">
          <Clock className="size-5 shrink-0" strokeWidth={1.75} />
          In 4 days
        </div>
      </div>

      {/* Active plan */}
      <div className="bg-lawn-primary relative overflow-hidden rounded-2xl p-6 text-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="absolute top-13 right-6 size-28 rounded-full bg-white opacity-10" />
        <p className="relative text-base tracking-tight">ACTIVE PLAN</p>
        <p className="relative mt-3 text-[32px] font-bold tracking-tight">One - time</p>
        <p className="relative mt-1.5 text-base tracking-tight">Lawn Mowing</p>
      </div>

      {/* Visits this year */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2d5a27]/10 bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] sm:col-span-2 xl:col-span-1">
        <div className="absolute -top-7 right-6 size-24 rounded-full bg-[#4a8c3f] opacity-5" />
        <p className="text-lawn-text-secondary relative text-base tracking-tight">
          Visits this year
        </p>
        <p className="text-lawn-text-primary relative mt-3 text-[32px] font-bold tracking-tight">
          11
        </p>
        <div className="text-lawn-text-secondary relative mt-1.5 flex items-center gap-1.5 text-base tracking-tight">
          <TrendingUp className="size-5 shrink-0" strokeWidth={1.75} />
          $642 total
        </div>
      </div>
    </div>
  );
}
