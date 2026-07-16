"use client";

import { Star, Trash } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeletePaymentMethod,
  usePaymentMethods,
  useSetDefaultPaymentMethod,
} from "@/hooks/use-payment-methods";
import type { SavedCard } from "@/lib/api/payment-methods";
import { cardBrandColor, cardBrandLabel, formatCardExpiry } from "@/lib/cards";

function PaymentCardRow({ card }: { card: SavedCard }) {
  const setDefault = useSetDefaultPaymentMethod();
  const remove = useDeletePaymentMethod();

  const expiry = formatCardExpiry(card.expMonth, card.expYear);
  const busy = setDefault.isPending || remove.isPending;

  return (
    <div className="bg-lawn-bg-2 flex flex-col gap-4 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] sm:flex-row sm:items-center sm:gap-6 lg:p-8">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div
          className="flex h-10 w-[72px] shrink-0 items-center justify-center rounded-md text-[10px] font-bold tracking-wide text-white uppercase"
          style={{ backgroundColor: cardBrandColor(card.brand) }}
        >
          {cardBrandLabel(card.brand).slice(0, 4)}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
              •••• {card.last4}
            </p>
            {card.isDefault ? (
              <span className="text-lawn-text-secondary rounded-lg bg-[#cecece] px-2.5 py-1 text-sm font-medium tracking-tight">
                Default
              </span>
            ) : null}
          </div>
          <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
            {cardBrandLabel(card.brand)}
            {expiry ? ` · Expires ${expiry}` : ""}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 self-start sm:self-auto">
        {!card.isDefault ? (
          <button
            type="button"
            onClick={() => setDefault.mutate(card.id)}
            disabled={busy}
            className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 flex items-center gap-2 rounded-xl border-[1.2px] px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Star className="size-5" strokeWidth={1.75} />
            Set as default
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => remove.mutate(card.id)}
          disabled={busy}
          aria-label={`Delete card ending ${card.last4}`}
          className="flex items-center rounded-xl border-[1.2px] border-[#999] px-4 py-3 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash className="text-destructive size-6" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

export function PaymentMethodsList() {
  const { data: cards, isLoading, isError } = usePaymentMethods();

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load your saved cards. Please refresh and try again.
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

  if (!cards || cards.length === 0) {
    return (
      <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-10 text-center text-base">
        No cards saved yet. Add a card to speed up checkout on your next booking.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {cards.map((card) => (
        <PaymentCardRow key={card.id} card={card} />
      ))}
    </div>
  );
}
