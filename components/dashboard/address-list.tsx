"use client";

import { useState } from "react";
import { MapPin, Star, Trash } from "lucide-react";

import { AddressFormDialog } from "@/components/dashboard/address-form-dialog";
import { DeleteAddressDialog } from "@/components/dashboard/delete-address-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses, useSetDefaultAddress } from "@/hooks/use-addresses";
import type { SavedAddress } from "@/lib/api/addresses";

// Mapbox place names come back as "700 Oak St, Austin, Texas 78704, ..." — show
// the street segment as the title and the rest as the muted secondary line, to
// match the two-line card in the design.
function splitAddress(address: string) {
  const [primary, ...rest] = address.split(",");
  return { primary: primary.trim(), secondary: rest.join(",").trim() };
}

function AddressCard({
  address,
  onEdit,
  onDelete,
}: {
  address: SavedAddress;
  onEdit: (address: SavedAddress) => void;
  onDelete: (address: SavedAddress) => void;
}) {
  const setDefault = useSetDefaultAddress();
  const { primary, secondary } = splitAddress(address.address);

  return (
    <div className="bg-lawn-bg-2 flex flex-col gap-4 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] sm:flex-row sm:items-center sm:gap-6 lg:p-8">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="bg-lawn-badge-bg flex size-14 shrink-0 items-center justify-center rounded-xl">
          <MapPin className="text-lawn-primary size-6" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
              {primary}
            </p>
            {address.isDefault ? (
              <span className="text-lawn-text-secondary rounded-lg bg-[#cecece] px-2.5 py-1 text-sm font-medium tracking-tight">
                Default
              </span>
            ) : null}
          </div>
          {secondary ? (
            <p className="text-lawn-text-secondary truncate text-base font-medium tracking-tight">
              {secondary}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 self-start sm:self-auto">
        {!address.isDefault ? (
          <button
            type="button"
            onClick={() => setDefault.mutate(address.id)}
            disabled={setDefault.isPending}
            className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 flex items-center gap-2 rounded-xl border-[1.2px] px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Star className="size-5" strokeWidth={1.75} />
            Set as default
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => onEdit(address)}
          className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold tracking-tight transition-colors"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(address)}
          aria-label={`Delete ${primary}`}
          className="border-lawn-primary-light flex items-center rounded-xl border-[1.2px] px-4 py-3 transition-colors hover:bg-red-50"
        >
          <Trash className="text-destructive size-6" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

export function AddressList() {
  const { data: addresses, isLoading, isError } = useAddresses();
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [deleting, setDeleting] = useState<SavedAddress | null>(null);

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load your saved addresses. Please refresh and try
        again.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-10 text-center text-base">
        No addresses saved yet. Add a property to speed up your next booking.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        ))}
      </div>

      <AddressFormDialog
        mode="edit"
        address={editing ?? undefined}
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      />
      <DeleteAddressDialog
        address={deleting}
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      />
    </>
  );
}
