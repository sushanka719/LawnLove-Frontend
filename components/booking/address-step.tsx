"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AddressForm } from "@/components/booking/address-form";
import { AddressSelect } from "@/components/booking/address-select";
import { BookingStepCard } from "@/components/booking/booking-step-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses } from "@/hooks/use-addresses";
import { useSession } from "@/hooks/use-session";
import { BOOKING_STEPS } from "@/lib/booking-steps";
import type { SavedAddress } from "@/lib/api/addresses";
import { useBookingStore } from "@/lib/store/booking-store";
import { useConfirmationStore } from "@/lib/store/confirmation-store";
import {
  addressStepSchema,
  type AddressStepValues,
} from "@/lib/validation/booking-schemas";

const SELECT_TITLE = "Select Address";
const SELECT_DESCRIPTION =
  "Choose a saved address or add new address for your new booking.";

export function AddressStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledAddress = searchParams.get("address") ?? "";
  const storedAddress = useBookingStore((state) => state.address);
  const setStoredAddress = useBookingStore((state) => state.setAddress);
  const clearConfirmation = useConfirmationStore((state) => state.clearConfirmation);

  // Returning, signed-in customers can pick from their saved addresses. Guests
  // hit a 401 on /addresses, so only fetch once a session exists.
  const { data: session } = useSession();
  const { data: savedAddresses, isLoading: addressesLoading } = useAddresses({
    enabled: !!session,
  });
  const hasSavedAddresses = !!savedAddresses && savedAddresses.length > 0;

  // An address coming from the landing hero (?address=) is the user's latest
  // intent, so it wins over any stale value left in the store from a previous
  // session. When there's no hero param, fall back to the stored address so
  // returning to this step mid-flow keeps what they entered.
  const defaultAddress = prefilledAddress || storedAddress.address;

  // Which view the card shows. We open on the saved-address picker for returning
  // customers; "Add new address", picking one, or arriving with a hero address
  // (already a concrete intent) flips us to the manual form. `seedAddress` is
  // the value the form's address field mounts with.
  const [showForm, setShowForm] = useState(() => !!prefilledAddress);
  const [seedAddress, setSeedAddress] = useState(() => defaultAddress);

  // The address step is where a booking flow begins. A confirmation snapshot
  // left over from a booking completed earlier this session is now stale — drop
  // it so it can't later let the user reach /booking/confirmed mid-flow (the
  // route guard treats a present snapshot as proof a booking just completed).
  useEffect(() => {
    clearConfirmation();
    // Run once on mount, as the flow starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the hero address into the store (clearing any coordinates that
  // belonged to a different, previously-stored address) and strip the param so
  // it can't later override edits the user makes on this step.
  useEffect(() => {
    if (!prefilledAddress) {
      return;
    }
    if (prefilledAddress !== storedAddress.address) {
      setStoredAddress({
        phoneNumber: storedAddress.phoneNumber,
        address: prefilledAddress,
        lat: null,
        lng: null,
      });
    }
    router.replace("/booking/address");
    // Run once on mount to consume the incoming param.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<AddressStepValues>({
    resolver: zodResolver(addressStepSchema),
    defaultValues: {
      phoneNumber: storedAddress.phoneNumber,
      address: defaultAddress,
      lat: prefilledAddress ? null : storedAddress.lat,
      lng: prefilledAddress ? null : storedAddress.lng,
    },
  });

  const onSubmit = (values: AddressStepValues) => {
    setStoredAddress(values);
    router.push(BOOKING_STEPS[1].path);
  };

  // Selecting a saved address prefills the form's address + coordinates and
  // drops the user into the form to confirm/enter their phone number — saved
  // addresses carry no phone, and the booking requires one. We `reset` (rather
  // than setValue) so the values land as the form's initial state and the
  // freshly-mounted address field renders them; any phone already typed is
  // preserved.
  const applySavedAddress = (saved: SavedAddress) => {
    form.reset({
      phoneNumber: form.getValues("phoneNumber"),
      address: saved.address,
      lat: saved.lat,
      lng: saved.lng,
    });
    setSeedAddress(saved.address);
    setShowForm(true);
  };

  const addNewAddress = () => {
    form.reset({
      phoneNumber: form.getValues("phoneNumber"),
      address: "",
      lat: null,
      lng: null,
    });
    setSeedAddress("");
    setShowForm(true);
  };

  // Decide the card's contents. While a signed-in user's saved addresses are
  // still loading we show a placeholder so returning customers never see the
  // form flash in before the picker.
  const picking = !showForm;
  const loadingAddresses = picking && !!session && addressesLoading && !savedAddresses;
  const showPicker = picking && hasSavedAddresses;

  let title: string;
  let description: string;
  let content: React.ReactNode;

  if (showPicker) {
    title = SELECT_TITLE;
    description = SELECT_DESCRIPTION;
    content = (
      <AddressSelect
        addresses={savedAddresses ?? []}
        onSelect={applySavedAddress}
        onAddNew={addNewAddress}
      />
    );
  } else if (loadingAddresses) {
    title = SELECT_TITLE;
    description = SELECT_DESCRIPTION;
    content = (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  } else {
    title = "Confirm your details";
    description = "Enter your contact address and confirm your address for future use.";
    content = (
      <AddressForm
        form={form}
        defaultAddress={seedAddress}
        onSubmit={onSubmit}
        onBack={hasSavedAddresses ? () => setShowForm(false) : undefined}
      />
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:justify-center">
      <BookingStepCard
        eyebrow="Step 1 - ADDRESS"
        title={title}
        description={description}
        className="max-w-[687px]"
      >
        {content}
      </BookingStepCard>

      <div className="relative aspect-[490/362] w-full max-w-[490px] shrink-0 overflow-hidden rounded-xl">
        <Image
          src="/booking/address-hero.png"
          alt="LawnLove professionals mowing a lawn"
          fill
          sizes="(min-width: 1024px) 490px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(105,105,105,0.2)]" />
      </div>
    </div>
  );
}
