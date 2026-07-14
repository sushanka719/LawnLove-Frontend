"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

type CalendarProps = {
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
};

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [viewDate, setViewDate] = useState(() => {
    const initial = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return (
    <div className="bg-lawn-bg-2 flex w-fit flex-col items-center gap-6 rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
      <div className="flex w-full items-center justify-between">
        <p className="text-lawn-text-primary font-heading text-xl font-semibold">
          {MONTH_LABELS[month]} {year}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="bg-lawn-badge-bg flex size-8 items-center justify-center rounded-md"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="bg-lawn-badge-bg flex size-8 items-center justify-center rounded-md"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3">
          {WEEKDAY_LABELS.map((day) => (
            <div
              key={day}
              className="text-lawn-text-secondary flex h-6 w-[45px] items-center justify-center text-base font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {cells.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="size-[45px]" />;
            }

            const dateKey = toDateKey(date);
            const isPast = date < today;
            const isSelected = dateKey === selectedDate;

            return (
              <button
                key={dateKey}
                type="button"
                disabled={isPast}
                onClick={() => onSelectDate(dateKey)}
                className={cn(
                  "flex size-[45px] items-center justify-center rounded-lg text-xl",
                  isSelected
                    ? "bg-lawn-primary text-white"
                    : isPast
                      ? "text-lawn-text-tertiary/50 cursor-not-allowed"
                      : "text-lawn-text-primary hover:bg-lawn-bg-1",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
