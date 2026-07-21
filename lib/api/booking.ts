import type { JobStatus } from "@/lib/api/agent";
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
  | "pendingPayment"
  | "active"
  | "pastDue"
  | "cancelled"
  | "completed";

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

export type BookingJobSummary = {
  id: string;
  status: JobStatus;
  completedAt: string | null;
  amount: number | null;
  review: { rating: number } | null;
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

// ---- Invoices (one per charged visit) ----

export type InvoiceListItem = {
  jobId: string;
  invoiceNumber: string;
  serviceLabel: string;
  address: string;
  servicedOn: string;
  amount: number; // cents
  refunded: boolean;
};

export function getInvoices(page = 1, pageSize = 10) {
  return http.get<Paginated<InvoiceListItem>>(
    `/bookings/invoices?page=${page}&pageSize=${pageSize}`,
  );
}
