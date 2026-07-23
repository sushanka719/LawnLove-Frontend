"use client";

import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SavedAddress } from "@/lib/api/addresses";

// How many saved addresses to show inline before the "View all" link takes over
// (the full list lives on the dashboard address page).
const PREVIEW_COUNT = 3;

// Mapbox place names come back as "1492 Magnolia Park Dr, Austin, ..." — show the
// street segment as the row label, matching the picker in the design.
function streetLine(address: string) {
  return address.split(",")[0].trim();
}

type AddressSelectProps = {
  addresses: SavedAddress[];
  onSelect: (address: SavedAddress) => void;
  onAddNew: () => void;
};

export function AddressSelect({ addresses, onSelect, onAddNew }: AddressSelectProps) {
  const preview = addresses.slice(0, PREVIEW_COUNT);
  const hasMore = addresses.length > PREVIEW_COUNT;

  return (
    <div className="flex flex-col gap-4">
      {preview.map((saved) => (
        <button
          key={saved.id}
          type="button"
          onClick={() => onSelect(saved)}
          className="bg-lawn-bg-2 hover:bg-lawn-badge-bg flex items-center gap-4 rounded-xl p-4 text-left shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)] transition-colors"
        >
          <span className="bg-lawn-badge-bg flex size-12 shrink-0 items-center justify-center rounded-xl">
            <MapPin className="text-lawn-primary size-6" strokeWidth={1.75} />
          </span>
          <span className="text-lawn-text-primary min-w-0 flex-1 truncate text-base font-semibold tracking-tight">
            {streetLine(saved.address)}
          </span>
          <ChevronRight
            className="text-lawn-text-secondary size-6 shrink-0"
            strokeWidth={1.75}
            aria-hidden
          />
        </button>
      ))}

      {hasMore ? (
        <Link
          href="/dashboard/address"
          className="text-lawn-primary self-end text-base font-medium tracking-tight underline"
        >
          View all
        </Link>
      ) : null}

      <p className="text-lawn-text-tertiary text-center text-base font-bold tracking-tight">
        OR
      </p>

      <Button
        type="button"
        onClick={onAddNew}
        className="lawn-gradient-btn h-auto w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] hover:opacity-90"
      >
        Add new address
      </Button>
    </div>
  );
}
