import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // While the next page is still loading (keepPreviousData), disable the
  // controls so a fast double-click can't skip past a page.
  disabled?: boolean;
};

const buttonClass =
  "inline-flex items-center gap-1.5 rounded-xl border-[1.2px] border-[#999] px-4 py-2 text-sm font-medium text-lawn-text-secondary transition-colors hover:text-lawn-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-lawn-text-secondary";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1 && !disabled;
  const canNext = page < totalPages && !disabled;

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
        className={cn(buttonClass)}
      >
        <ChevronLeft className="size-4" />
        Previous
      </button>
      <p className="text-lawn-text-secondary text-sm font-medium tracking-tight">
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
        className={cn(buttonClass)}
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
