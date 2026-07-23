import { http } from "@/lib/api/http";

// Agent service catalog — backend ServicesController (@Roles(['agent'])), scoped
// to the signed-in agent. Display/marketing catalog only (bookings run through
// Plans). `price` is in CENTS.

export type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number; // cents
  unit: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
};

export type CreateServiceInput = {
  name: string;
  description?: string;
  price: number; // cents
  unit?: string;
  active?: boolean;
  sortOrder?: number;
};

export type UpdateServiceInput = Partial<CreateServiceInput>;

export function getServices() {
  return http.get<Service[]>("/agent/services");
}

export function createService(body: CreateServiceInput) {
  return http.post<Service>("/agent/services", body);
}

export function updateService(id: string, body: UpdateServiceInput) {
  return http.patch<Service>(`/agent/services/${id}`, body);
}

export function deleteService(id: string) {
  return http.delete<{ success: boolean }>(`/agent/services/${id}`);
}
