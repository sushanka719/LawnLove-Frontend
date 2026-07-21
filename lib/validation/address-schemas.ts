import { z } from "zod";

import { addressSchema } from "@/lib/validation/booking-schemas";

// The dashboard add/edit form captures the same shape the booking address step
// does — a single line plus optional Mapbox coordinates. Coordinates are set by
// selecting an autocomplete suggestion; typing a free-text address leaves them
// null (still valid, matching the booking flow).
export const addressFormSchema = z.object({
  address: addressSchema,
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
