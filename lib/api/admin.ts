import type { JobStatus, PhotoType } from "@/lib/api/agent";
import type { BookingStatus, Paginated } from "@/lib/api/booking";
import { http } from "@/lib/api/http";

// Every route here is served by the backend AdminController (@Roles(['admin'])).
// The proxy already gates /admin to admins, so a 403 here means a stale session.

export type AdminRole = "user" | "agent" | "admin";

// A minimal person reference embedded in list/detail rows.
export type PersonRef = { id: string; name: string; email: string } | null;

// ---- Overview ----

export type AdminStats = {
  users: { total: number; agents: number; customers: number };
  jobs: {
    byStatus: Partial<Record<JobStatus, number>>;
    active: number;
    disputed: number;
  };
  bookings: { byStatus: Partial<Record<BookingStatus, number>> };
  money: {
    grossVolumeCents: number;
    platformFeesCents: number;
    pendingPayoutCents: number;
  };
};

export function getAdminStats() {
  return http.get<AdminStats>("/admin/stats");
}

// ---- Users ----

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  banned: boolean;
  // Set when the customer has requested account deletion (soft delete).
  deletionScheduledAt: string | null;
  payoutsEnabled: boolean;
  createdAt: string;
  bookingsCount: number;
  jobsCount: number;
  // The user's default saved address, or null if they have none on file.
  location: string | null;
};

export type AdminUserBooking = {
  id: string;
  reference: string;
  title: string;
  address: string;
  status: BookingStatus;
  scheduleDate: string;
  totalPerVisit: number;
  createdAt: string;
};

export type AdminUserDetail = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
  deletionRequestedAt: string | null;
  deletionScheduledAt: string | null;
  stripeConnectAccountId: string | null;
  payoutsEnabled: boolean;
  createdAt: string;
  bookings: AdminUserBooking[];
};

export function getAdminUsers(params: {
  query?: string;
  role?: AdminRole;
  page?: number;
  pageSize?: number;
}) {
  const qs = new URLSearchParams();
  if (params.query) qs.set("query", params.query);
  if (params.role) qs.set("role", params.role);
  qs.set("page", String(params.page ?? 1));
  qs.set("pageSize", String(params.pageSize ?? 10));
  return http.get<Paginated<AdminUserListItem>>(`/admin/users?${qs}`);
}

export function getAdminUser(id: string) {
  return http.get<AdminUserDetail>(`/admin/users/${id}`);
}

export function setUserRole(id: string, role: AdminRole) {
  return http.post<{ id: string; email: string; role: AdminRole }>(
    `/admin/users/${id}/role`,
    { role },
  );
}

export function banUser(id: string, body: { reason?: string; durationDays?: number }) {
  return http.post<{ id: string; banned: boolean }>(`/admin/users/${id}/ban`, body);
}

export function unbanUser(id: string) {
  return http.post<{ id: string; banned: boolean }>(`/admin/users/${id}/unban`);
}

// ---- Agents ----

export type AdminAgent = {
  id: string;
  name: string;
  email: string;
  payoutsEnabled: boolean;
  onboarded: boolean;
  createdAt: string;
  totalJobs: number;
  activeJobs: number;
};

export function getAdminAgents() {
  return http.get<AdminAgent[]>("/admin/agents");
}

// Result of inviting an agent. `outcome` distinguishes a fresh magic-link
// invite from promoting/short-circuiting an email that already had an account.
export type InviteAgentResult = {
  status: boolean;
  outcome: "invited" | "promoted" | "already_agent";
};

export function inviteAgent(body: { email: string; businessName?: string }) {
  return http.post<InviteAgentResult>("/admin/agents/invite", body);
}

// ---- Bookings ----

export type AdminBookingListItem = {
  id: string;
  reference: string;
  title: string;
  address: string;
  frequency: string;
  scheduleDate: string;
  timeSlot: string;
  totalPerVisit: number;
  amountCharged: number | null; // cents, set by the Stripe webhook
  status: BookingStatus;
  createdAt: string;
  customer: PersonRef;
  planName: string | null;
  agent: PersonRef; // the agent on the earliest visit
  visitsCount: number;
};

export type AdminBookingDetail = {
  id: string;
  reference: string;
  title: string;
  address: string;
  phone: string;
  frequency: string;
  areaSqFt: number;
  estimatedAreaSqFt: number;
  subtotal: number;
  discountPct: number;
  totalPerVisit: number;
  scheduleDate: string;
  timeSlot: string;
  status: BookingStatus;
  createdAt: string;
  user: PersonRef;
  jobs: {
    id: string;
    status: JobStatus;
    agentId: string | null;
    completedAt: string | null;
    amount: number | null;
  }[];
};

export function getAdminBookings(params: {
  status?: BookingStatus;
  page?: number;
  pageSize?: number;
}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  qs.set("page", String(params.page ?? 1));
  qs.set("pageSize", String(params.pageSize ?? 10));
  return http.get<Paginated<AdminBookingListItem>>(`/admin/bookings?${qs}`);
}

export function getAdminBooking(id: string) {
  return http.get<AdminBookingDetail>(`/admin/bookings/${id}`);
}

export function cancelBooking(id: string) {
  return http.post<{ id: string; status: BookingStatus }>(`/admin/bookings/${id}/cancel`);
}

// ---- Jobs (dispatch) ----

export type AdminJobListItem = {
  id: string;
  status: JobStatus;
  createdAt: string;
  completedAt: string | null;
  amount: number | null;
  agent: PersonRef;
  address: string;
  scheduleDate: string;
  timeSlot: string;
  customer: PersonRef;
};

export type AdminJobPhoto = {
  id: string;
  type: PhotoType;
  lat: number | null;
  lng: number | null;
  takenAt: string;
  url: string;
};

export type AdminJobDetail = {
  id: string;
  status: JobStatus;
  startedAt: string | null;
  completedAt: string | null;
  reviewDeadline: string | null;
  startLat: number | null;
  startLng: number | null;
  amount: number | null;
  platformFee: number | null;
  chargedAt: string | null;
  releasedAt: string | null;
  agentPayoutAmount: number | null;
  agentPaidAt: string | null;
  agentPayoutRef: string | null;
  stripePaymentIntentId: string | null;
  stripeTransferId: string | null;
  reference: string;
  agent: PersonRef;
  employee: { id: string; name: string } | null;
  // The agent's active crew — options for the reassign dropdown.
  agentEmployees: { id: string; name: string }[];
  booking: {
    id: string;
    title: string;
    address: string;
    scheduleDate: string;
    timeSlot: string;
    estimatedAreaSqFt: number;
    totalPerVisit: number;
    customer: PersonRef;
  };
  photos: { before: AdminJobPhoto[]; after: AdminJobPhoto[] };
  review: { rating: number; comment: string | null; createdAt: string } | null;
};

export function getAdminJobs(params: {
  status?: JobStatus;
  agentId?: string;
  page?: number;
  pageSize?: number;
}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.agentId) qs.set("agentId", params.agentId);
  qs.set("page", String(params.page ?? 1));
  qs.set("pageSize", String(params.pageSize ?? 10));
  return http.get<Paginated<AdminJobListItem>>(`/admin/jobs?${qs}`);
}

export function getAdminJob(id: string) {
  return http.get<AdminJobDetail>(`/admin/jobs/${id}`);
}

export function assignJob(id: string, agentId: string) {
  return http.post<{ id: string; status: JobStatus; agentId: string }>(
    `/admin/jobs/${id}/assign`,
    { agentId },
  );
}

export function refundJob(id: string) {
  return http.post<{ id: string; status: JobStatus }>(`/admin/jobs/${id}/refund`);
}

// Set/clear a job's field-worker (employee), or `auto` to re-run the scheduler.
export function reassignJob(
  id: string,
  body: { employeeId?: string | null; auto?: boolean },
) {
  return http.post<{
    id: string;
    status: JobStatus;
    agentId: string | null;
    employeeId: string | null;
    scheduledDate: string | null;
    employee: { id: string; name: string } | null;
  }>(`/admin/jobs/${id}/reassign`, body);
}

// Mark a completed visit's per-visit payout as paid (deferred manual model).
export function payoutJob(id: string, ref?: string) {
  return http.post<{ jobId: string; paid: boolean; amount: number }>(
    `/admin/jobs/${id}/payout`,
    ref ? { ref } : {},
  );
}

// ---- Payouts ----

export type AdminPayoutItem = {
  jobId: string;
  reference: string;
  visitNumber: number;
  serviceLabel: string;
  address: string;
  servicedOn: string | null;
  amount: number; // cents
  paid: boolean;
  paidAt: string | null;
  payoutRef: string | null;
  agent: PersonRef;
};

export type AdminPayouts = {
  items: AdminPayoutItem[];
  totals: { owedCents: number; paidCents: number };
  byAgent: {
    agentId: string | null;
    name: string | null;
    email: string | null;
    owedCents: number;
    owedCount: number;
  }[];
};

export function getAdminPayouts() {
  return http.get<AdminPayouts>("/admin/payouts");
}

// ---- Settings ----

export type AdminSettings = {
  platformName: string;
  supportEmail: string | null;
  platformFeePct: number; // 0..1
  payoutsEnabled: boolean;
  payoutSchedule: string; // manual | daily | weekly
  updatedAt: string;
};

export type UpdateSettingsInput = Partial<Omit<AdminSettings, "updatedAt">>;

export function getAdminSettings() {
  return http.get<AdminSettings>("/admin/settings");
}

export function updateAdminSettings(body: UpdateSettingsInput) {
  return http.put<AdminSettings>("/admin/settings", body);
}

// ---- Revenue series ----

export type AdminRevenue = {
  range: string;
  granularity: "day" | "month";
  points: { date: string; revenueCents: number }[];
};

export function getAdminRevenue(range?: string) {
  const qs = range ? `?range=${range}` : "";
  return http.get<AdminRevenue>(`/admin/stats/revenue${qs}`);
}

// ---- Disputes ----

export type AdminDispute = {
  id: string;
  completedAt: string | null;
  amount: number | null;
  canRefund: boolean;
  agent: PersonRef;
  address: string;
  customer: PersonRef;
  review: { rating: number; comment: string | null } | null;
};

export function getAdminDisputes() {
  return http.get<AdminDispute[]>("/admin/disputes");
}
