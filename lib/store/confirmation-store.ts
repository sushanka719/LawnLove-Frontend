import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// A snapshot of the just-completed booking, captured at submit time (before the
// booking store is reset) so the /booking/confirmed page can show real details.
export type ConfirmationData = {
  bookingId: string;
  address: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // morning | midday | afternoon | evening
};

type ConfirmationState = {
  confirmation: ConfirmationData | null;
  setConfirmation: (data: ConfirmationData) => void;
  clearConfirmation: () => void;
};

export const useConfirmationStore = create<ConfirmationState>()(
  persist(
    (set) => ({
      confirmation: null,
      setConfirmation: (data) => set({ confirmation: data }),
      clearConfirmation: () => set({ confirmation: null }),
    }),
    {
      name: "lawnhate-confirmation",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
