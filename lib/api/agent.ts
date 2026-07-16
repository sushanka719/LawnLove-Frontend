import { http } from "@/lib/api/http";

export type JobStatus =
  | "assigned"
  | "started"
  | "completed"
  | "in_review"
  | "released"
  | "paid"
  | "disputed"
  | "refunded";

export type PhotoType = "before" | "after";

export type AgentJob = {
  id: string;
  status: JobStatus;
  startedAt: string | null;
  completedAt: string | null;
  reviewDeadline: string | null;
  createdAt: string;
  booking: {
    address: string;
    scheduleDate: string;
    timeSlot: string;
    estimatedAreaSqFt: number;
    totalPerVisit: number;
  };
};

export function getMyJobs() {
  return http.get<AgentJob[]>("/agent/jobs");
}

export type AgentJobPhoto = {
  id: string;
  type: PhotoType;
  takenAt: string;
  url: string;
};

export type AgentJobDetail = {
  id: string;
  status: JobStatus;
  startedAt: string | null;
  completedAt: string | null;
  reviewDeadline: string | null;
  booking: {
    address: string;
    scheduleDate: string;
    timeSlot: string;
    estimatedAreaSqFt: number;
    totalPerVisit: number;
  };
  photos: { before: AgentJobPhoto[]; after: AgentJobPhoto[] };
};

export function getJobDetail(jobId: string) {
  return http.get<AgentJobDetail>(`/agent/jobs/${jobId}`);
}

export type ConnectStatus = {
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
};

export function getConnectStatus() {
  return http.get<ConnectStatus>("/agent/connect/status");
}

export function startConnectOnboarding() {
  return http.post<{ url: string }>("/agent/connect/onboard");
}

export type StartJobResult = {
  id: string;
  status: JobStatus;
  startedAt: string;
  farFromProperty: boolean;
};

export function startJob(jobId: string, coords: { lat: number; lng: number }) {
  return http.post<StartJobResult>(`/agent/jobs/${jobId}/start`, coords);
}

export type UploadUrlResult = { uploadUrl: string; key: string };

export function createPhotoUploadUrl(
  jobId: string,
  body: { type: PhotoType; contentType: string },
) {
  return http.post<UploadUrlResult>(`/agent/jobs/${jobId}/photos/upload-url`, body);
}

// Direct browser → R2 upload. This MUST bypass the shared axios `http` client:
// that client forces `Content-Type: application/json` + `withCredentials`, but a
// presigned PUT is signed for the exact file content type and must not send
// cookies (R2 rejects the extra credentials / triggers a preflight mismatch).
export async function uploadFileToR2(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!res.ok) {
    throw new Error("Photo upload failed. Please try again.");
  }
}

export function registerPhoto(
  jobId: string,
  body: {
    type: PhotoType;
    key: string;
    lat?: number;
    lng?: number;
    takenAt: string;
  },
) {
  return http.post<{ id: string; type: PhotoType; createdAt: string }>(
    `/agent/jobs/${jobId}/photos`,
    body,
  );
}

export type CompleteJobResult = {
  id: string;
  status: JobStatus;
  completedAt: string;
  reviewDeadline: string;
  amount: number;
};

export function completeJob(jobId: string) {
  return http.post<CompleteJobResult>(`/agent/jobs/${jobId}/complete`);
}
