import { Trash } from "lucide-react";

export type PaymentCard = {
  /** Solid brand-color chip standing in for the card network logo. */
  brandColor: string;
  masked: string;
  expires: string;
  isDefault?: boolean;
};

// Static demo data for now.
export const PAYMENT_CARDS: PaymentCard[] = [
  {
    brandColor: "#191f77",
    masked: "**** 424242",
    expires: "Expires on 08/27",
    isDefault: true,
  },
  { brandColor: "#e11900", masked: "**** 881001", expires: "Expires on 08/27" },
];

function PaymentCardRow({ card }: { card: PaymentCard }) {
  return (
    <div className="bg-lawn-bg-2 flex flex-col gap-4 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] sm:flex-row sm:items-center sm:gap-6 lg:p-8">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div
          className="h-10 w-[72px] shrink-0 rounded-md"
          style={{ backgroundColor: card.brandColor }}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
              {card.masked}
            </p>
            {card.isDefault ? (
              <span className="text-lawn-text-secondary rounded-lg bg-[#cecece] px-2.5 py-1 text-sm font-medium tracking-tight">
                Default
              </span>
            ) : null}
          </div>
          <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
            {card.expires}
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-label={`Delete card ending ${card.masked.replace(/\D/g, "").slice(-4)}`}
        className="flex shrink-0 items-center self-start rounded-xl border-[1.2px] border-[#999] px-4 py-3 transition-colors hover:bg-red-50 sm:self-auto"
      >
        <Trash className="text-destructive size-6" strokeWidth={1.75} />
      </button>
    </div>
  );
}

export function PaymentMethodsList({ cards = PAYMENT_CARDS }: { cards?: PaymentCard[] }) {
  return (
    <div className="flex flex-col gap-6">
      {cards.map((card, i) => (
        <PaymentCardRow key={i} card={card} />
      ))}
    </div>
  );
}
