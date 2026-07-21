"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useBookingStore } from "@/lib/store/booking-store";
import { useConfirmationStore } from "@/lib/store/confirmation-store";

const TIME_WINDOW_RANGES: Record<string, string> = {
  morning: "8:00-11:00 AM",
  midday: "11:00 AM-2:00 PM",
  afternoon: "2:00-5:00 PM",
  evening: "5:00-7:00 PM",
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(dateKey: string) {
  if (!dateKey) return "";
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <p className="text-lawn-text-tertiary shrink-0 font-medium">{label}</p>
      <p className="text-lawn-text-secondary text-right font-semibold">{value}</p>
    </div>
  );
}

export function BookingConfirmed() {
  const confirmation = useConfirmationStore((state) => state.confirmation);
  const resetBooking = useBookingStore((state) => state.reset);

  // The booking succeeded and we've already snapshotted its details into the
  // confirmation store, so clear the working draft here. This is the single
  // place the booking store is reset: doing it now (safely off the flow, on a
  // page the route guard never gates) means a new booking starts clean and the
  // guard re-gates every step from scratch.
  useEffect(() => {
    resetBooking();
  }, [resetBooking]);

  const visitDuration = confirmation
    ? `${formatDate(confirmation.date)} ${capitalize(confirmation.timeSlot)}(${
        TIME_WINDOW_RANGES[confirmation.timeSlot] ?? ""
      })`
    : "";

  return (
    <div className="flex w-full max-w-[643px] flex-col items-center gap-6">
      <div className="relative size-28 overflow-hidden drop-shadow-[0px_6px_5px_rgba(25,81,52,0.2)]">
        <Image
          src="/booking/booking-confirmed-badge.png"
          alt="Booking confirmed"
          fill
          sizes="112px"
          className="scale-[1.1933] object-contain"
          priority
        />
      </div>

      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex w-full max-w-[525px] flex-col items-center gap-3 text-center">
          <h1 className="text-lawn-text-primary font-heading text-2xl leading-8 font-semibold">
            You&apos;re all booked!
          </h1>
          <p className="text-lawn-text-secondary text-lg leading-7 font-medium">
            Your booking is confirmed and your card is saved. You&apos;re only charged
            once the work is done — we&apos;ll email a receipt after each completed visit.
          </p>
        </div>

        <div className="bg-lawn-bg-2 flex w-full flex-col gap-4 rounded-b-xl p-6 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
          {confirmation && (
            <div className="flex w-full flex-col gap-3 pb-4 text-lg leading-7">
              <DetailRow label="Booking ID" value={confirmation.bookingId} />
              <DetailRow label="Address" value={confirmation.address} />
              <DetailRow label="Visit Duration" value={visitDuration} />
            </div>
          )}

          <div className="flex w-full gap-4">
            <Link
              href="/dashboard"
              className="border-lawn-primary-light text-lawn-primary bg-lawn-bg-2 flex-1 rounded-xl border-[1.2px] px-8 py-3 text-center text-base font-semibold"
            >
              Back to dashboard
            </Link>
            <Link
              href={
                confirmation?.rawId
                  ? `/dashboard/bookings/${confirmation.rawId}`
                  : "/dashboard/bookings"
              }
              className="lawn-gradient-btn flex-1 rounded-xl px-8 py-3 text-center text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90"
            >
              View booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
