"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAddress } from "@/hooks/use-addresses";
import type { SavedAddress } from "@/lib/api/addresses";

type DeleteAddressDialogProps = {
  address: SavedAddress | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAddressDialog({
  address,
  open,
  onOpenChange,
}: DeleteAddressDialogProps) {
  const remove = useDeleteAddress();

  const onConfirm = () => {
    if (!address || remove.isPending) return;
    remove.mutate(address.id, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-lawn-bg-2 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lawn-text-primary text-xl font-bold tracking-tight">
            Delete Saved Address?
          </DialogTitle>
          <DialogDescription className="text-lawn-text-secondary text-base">
            Are you sure you want to delete this saved address? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <button
          type="button"
          onClick={onConfirm}
          disabled={remove.isPending}
          className="bg-destructive w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {remove.isPending ? "Deleting..." : "Delete"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
