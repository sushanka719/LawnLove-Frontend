import { MapPin, Trash } from "lucide-react";

export type Address = {
  line1: string;
  location: string;
  isDefault?: boolean;
};

// Static demo data for now.
export const ADDRESSES: Address[] = [
  {
    line1: "1492 Magnolia Park Dr",
    location: "Austin, TX 78704 - 6,200 sq ft",
    isDefault: true,
  },
  {
    line1: "1492 Magnolia Park Dr",
    location: "Austin, TX 78704 - 6,200 sq ft",
  },
];

function AddressCard({ address }: { address: Address }) {
  return (
    <div className="bg-lawn-bg-2 flex flex-col gap-4 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] sm:flex-row sm:items-center sm:gap-6 lg:p-8">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="bg-lawn-badge-bg flex size-14 shrink-0 items-center justify-center rounded-xl">
          <MapPin className="text-lawn-primary size-6" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
              {address.line1}
            </p>
            {address.isDefault ? (
              <span className="text-lawn-text-secondary rounded-lg bg-[#cecece] px-2.5 py-1 text-sm font-medium tracking-tight">
                Default
              </span>
            ) : null}
          </div>
          <p className="text-lawn-text-secondary truncate text-base font-medium tracking-tight">
            {address.location}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold tracking-tight transition-colors"
        >
          Edit
        </button>
        <button
          type="button"
          aria-label={`Delete ${address.line1}`}
          className="border-lawn-primary-light flex items-center rounded-xl border-[1.2px] px-4 py-3 transition-colors hover:bg-red-50"
        >
          <Trash className="text-destructive size-6" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

export function AddressList({ addresses = ADDRESSES }: { addresses?: Address[] }) {
  return (
    <div className="flex flex-col gap-6">
      {addresses.map((address, i) => (
        <AddressCard key={i} address={address} />
      ))}
    </div>
  );
}
