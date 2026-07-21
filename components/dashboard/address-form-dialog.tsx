"use client";

import { useState } from "react";

import { AddressAutocompleteField } from "@/components/dashboard/address-autocomplete-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateAddress, useUpdateAddress } from "@/hooks/use-addresses";
import type { SavedAddress } from "@/lib/api/addresses";
import { addressFormSchema } from "@/lib/validation/address-schemas";

const COPY = {
  add: {
    title: "Add New Address",
    description:
      "Add new address that will be saved for your future use while booking new services.",
    submit: "Save address",
  },
  edit: {
    title: "Edit Saved Address",
    description:
      "Update your address details to ensure accurate pickup and delivery.",
    submit: "Save changes",
  },
} as const;

type AddressFormDialogProps = {
  mode: "add" | "edit";
  /** The address being edited — required when mode is "edit". */
  address?: SavedAddress;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddressFormDialog({
  mode,
  address,
  open,
  onOpenChange,
}: AddressFormDialogProps) {
  const copy = COPY[mode];
  const create = useCreateAddress();
  const update = useUpdateAddress();
  const submitting = create.isPending || update.isPending;

  const [value, setValue] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Seed the form (add → empty; edit → the target address) whenever the dialog
  // opens or switches to a different address. This is the render-time reset
  // pattern (https://react.dev/learn/you-might-not-need-an-effect) — no effect.
  const seedKey = open ? `${mode}:${address?.id ?? "new"}` : null;
  const [seededKey, setSeededKey] = useState<string | null>(null);
  if (seedKey !== seededKey) {
    setSeededKey(seedKey);
    if (open) {
      setValue(address?.address ?? "");
      setLat(address?.lat ?? null);
      setLng(address?.lng ?? null);
      setError(null);
    }
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const parsed = addressFormSchema.safeParse({ address: value, lat, lng });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please enter an address.");
      return;
    }
    setError(null);

    const close = () => onOpenChange(false);
    if (mode === "edit" && address) {
      update.mutate({ id: address.id, payload: parsed.data }, { onSuccess: close });
    } else {
      create.mutate(parsed.data, { onSuccess: close });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-lawn-bg-2 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lawn-text-primary text-xl font-bold tracking-tight">
            {copy.title}
          </DialogTitle>
          <DialogDescription className="text-lawn-text-secondary text-base">
            {copy.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <AddressAutocompleteField
            value={value}
            initialValue={address?.address}
            onValueChange={(next) => {
              // Free-text edits invalidate any previously-selected coordinates.
              setValue(next);
              setLat(null);
              setLng(null);
            }}
            onSelect={(selection) => {
              setValue(selection.address);
              setLat(selection.lat);
              setLng(selection.lng);
            }}
            error={error ?? undefined}
            disabled={submitting}
            autoFocus
          />

          <button
            type="submit"
            disabled={submitting}
            className="lawn-gradient-btn w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving..." : copy.submit}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
