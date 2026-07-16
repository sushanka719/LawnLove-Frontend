import { http } from "@/lib/api/http";
import type { JobStatus, PhotoType } from "@/lib/api/agent";

export type CustomerJobListItem = {
  id: string;
  status: JobStatus;
  completedAt: string | null;
  reviewDeadline: string | null;
  review: { rating: number } | null;
  booking: {
    address: string;
    scheduleDate: string;
    timeSlot: string;
    totalPerVisit: number;
  };
};

export function getMyJobs() {
  return http.get<CustomerJobListItem[]>("/bookings/jobs");
}

export type JobPhoto = {
  id: string;
  type: PhotoType;
  takenAt: string;
  url: string;
};

export type CustomerJobDetail = {
  id: string;
  status: JobStatus;
  completedAt: string | null;
  reviewDeadline: string | null;
  amount: number | null;
  booking: {
    address: string;
    scheduleDate: string;
    timeSlot: string;
    totalPerVisit: number;
  };
  photos: { before: JobPhoto[]; after: JobPhoto[] };
  review: { rating: number; comment: string | null } | null;
};

export function getJob(jobId: string) {
  return http.get<CustomerJobDetail>(`/bookings/jobs/${jobId}`);
}

export function submitReview(jobId: string, body: { rating: number; comment?: string }) {
  return http.post<{ id: string; rating: number; comment: string | null }>(
    `/bookings/jobs/${jobId}/review`,
    body,
  );
}

export function approveJob(jobId: string) {
  return http.post<{ status: JobStatus; paid: boolean; reason?: string }>(
    `/bookings/jobs/${jobId}/approve`,
  );
}

export function disputeJob(jobId: string) {
  return http.post<{ id: string; status: JobStatus }>(`/bookings/jobs/${jobId}/dispute`);
}
