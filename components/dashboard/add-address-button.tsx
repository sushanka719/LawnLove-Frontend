"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { AddressFormDialog } from "@/components/dashboard/address-form-dialog";

const gradientButtonClasses =
  "lawn-gradient-btn flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold tracking-tight whitespace-nowrap text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90";

export function AddAddressButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={gradientButtonClasses}
      >
        <Plus className="size-6" strokeWidth={2} />
        Add address
      </button>

      <AddressFormDialog mode="add" open={open} onOpenChange={setOpen} />
    </>
  );
}
