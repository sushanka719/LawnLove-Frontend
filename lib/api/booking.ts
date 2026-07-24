import type { JobStatus } from "@/lib/api/agent";
import type { JobPhoto } from "@/lib/api/customer-jobs";
import { http } from "@/lib/api/http";
import type { Frequency } from "@/lib/pricing";

export type CreateBookingPayload = {
  phone: string;
  address: string;
  lat: number | null;
  lng: number | null;
  boundary: { lat: number; lng: number }[];
  planId: string;
  date: string;
  timeSlot: string;
  // Optional promo code; the server recomputes the discount and ignores any
  // client-sent amount.
  promoCode?: string;
};

// The booking is created as `pendingPayment`; the client secret drives the
// embedded Payment Element, and the webhook flips the booking to `active`.
export type CreateBookingResponse = {
  bookingId: string;
  clientSecret: string;
  amount: number; // cents
};

export function createBooking(payload: CreateBookingPayload) {
  return http.post<CreateBookingResponse>("/bookings", payload);
}

// ---- Bookings list + detail (dashboard) ----

export type BookingStatus =
  "pendingPayment" | "active" | "pastDue" | "cancelled" | "completed";

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type BookingListItem = {
  id: string;
  reference: string;
  title: string;
  address: string;
  frequency: Frequency;
  scheduleDate: string;
  timeSlot: string;
  totalPerVisit: number;
  status: BookingStatus;
  createdAt: string;
  visitsCount: number;
};

export function getBookings(page = 1, pageSize = 10) {
  return http.get<Paginated<BookingListItem>>(
    `/bookings?page=${page}&pageSize=${pageSize}`,
  );
}

// A current recurring plan (active/past-due subscription) for the Settings
// "Plan" section. Same shape as a booking list row; the endpoint returns an
// unpaginated (capped) array so all of a customer's plans arrive at once.
export type CurrentPlan = BookingListItem;

export function getCurrentPlans() {
  return http.get<CurrentPlan[]>("/bookings/current-plans");
}

// Customer-initiated cancel of a recurring plan. The backend cancels the Stripe
// subscription; the `customer.subscription.deleted` webhook then flips the
// booking to `cancelled` and drops its upcoming visits.
export function cancelSubscription(id: string) {
  return http.post<{ id: string; status: string }>(`/bookings/${id}/cancel-subscription`);
}

export type BookingJobSummary = {
  id: string;
  status: JobStatus;
  visitNumber: number;
  scheduledDate: string | null;
  completedAt: string | null;
  amount: number | null;
  // The field-worker (or agent) who completed the visit; null until done.
  completedBy: string | null;
  review: { rating: number } | null;
  // Before/after proof photos with short-lived presigned URLs.
  photos: { before: JobPhoto[]; after: JobPhoto[] };
};

export type BookingDetail = {
  id: string;
  reference: string;
  title: string;
  address: string;
  phone: string;
  frequency: Frequency;
  areaSqFt: number;
  estimatedAreaSqFt: number;
  subtotal: number;
  discountPct: number;
  totalPerVisit: number;
  scheduleDate: string;
  timeSlot: string;
  status: BookingStatus;
  createdAt: string;
  jobs: BookingJobSummary[];
};

export function getBooking(id: string) {
  return http.get<BookingDetail>(`/bookings/${id}`);
}

// ---- Invoices (one per charged booking, prepaid model) ----

export type InvoiceListItem = {
  id: string;
  invoiceNumber: string;
  serviceLabel: string;
  address: string;
  servicedOn: string;
  amount: number; // cents
  status: BookingStatus;
};

export function getInvoices(page = 1, pageSize = 10) {
  return http.get<Paginated<InvoiceListItem>>(
    `/bookings/invoices?page=${page}&pageSize=${pageSize}`,
  );
}
