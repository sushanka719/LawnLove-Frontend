import { http } from "@/lib/api/http";

// Self-service account settings, served by the backend AccountController.

export type NotificationPreferences = {
  emailReminders: boolean;
  // Future channel — persisted but surfaced as a disabled toggle in the UI.
  smsOnTheWayAlerts: boolean;
  promotionalEmails: boolean;
};

export type AccountDeletion = {
  requestedAt: string | null;
  scheduledAt: string | null;
  graceDays: number;
};

export type AccountSettings = {
  notifications: NotificationPreferences;
  deletion: AccountDeletion;
};

export function getAccountSettings() {
  return http.get<AccountSettings>("/account/settings");
}

export function updateNotifications(input: Partial<NotificationPreferences>) {
  return http.patch<AccountSettings>("/account/notifications", input);
}

// Schedules a soft delete (grace period before permanent removal). The account
// stays usable meanwhile.
export function scheduleAccountDeletion() {
  return http.post<AccountDeletion>("/account/deletion");
}

// Cancels a previously scheduled deletion.
export function cancelAccountDeletion() {
  return http.delete<AccountDeletion>("/account/deletion");
}
