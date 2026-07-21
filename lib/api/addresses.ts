import { http } from "@/lib/api/http";

export type SavedAddress = {
  id: string;
  address: string;
  lat: number | null;
  lng: number | null;
  isDefault: boolean;
};

// The address is captured via Mapbox autocomplete, so coordinates ride along
// with the free-text line. `isDefault` is opt-in on create (the first saved
// address is forced default server-side).
export type AddressPayload = {
  address: string;
  lat: number | null;
  lng: number | null;
  isDefault?: boolean;
};

export function getAddresses() {
  return http.get<SavedAddress[]>("/addresses");
}

export function createAddress(payload: AddressPayload) {
  return http.post<SavedAddress>("/addresses", payload);
}

export function updateAddress(id: string, payload: Partial<AddressPayload>) {
  return http.patch<SavedAddress>(`/addresses/${id}`, payload);
}

export function setDefaultAddress(id: string) {
  return http.post<{ success: boolean }>(`/addresses/${id}/default`);
}

export function deleteAddress(id: string) {
  return http.delete<{ success: boolean }>(`/addresses/${id}`);
}
