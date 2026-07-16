import { env } from "@/config/env";
import { ApiError } from "@/lib/api/http";
import { http } from "@/lib/api/http";

// better-auth mounts `update-user` under /api/auth. It accepts partial updates
// (name and the custom phoneNumber additionalField), validates them in the
// server before-hook, and refreshes the session cookie with the new values.
const AUTH_PREFIX = "/api/auth";

export type UpdateProfileInput = {
  name?: string;
  // Empty string clears the stored number server-side.
  phoneNumber?: string;
};

export function updateProfile(input: UpdateProfileInput) {
  return http.post<{ status: boolean }>(`${AUTH_PREFIX}/update-user`, input);
}

// Avatar is uploaded through the backend (multipart), not directly to R2: the
// backend validates the bytes, stores the file, and persists `user.image`. This
// bypasses the shared axios client because it forces `Content-Type:
// application/json` — a multipart body must let the browser set the boundary.
export async function uploadAvatar(file: File): Promise<{ image: string }> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/profile/avatar`, {
    method: "POST",
    body: form,
    // Send the better-auth session cookie (cross-origin in dev).
    credentials: "include",
  });

  if (!res.ok) {
    let message = "Upload failed. Please try again.";
    let data: unknown = null;
    try {
      data = await res.json();
      if (data && typeof data === "object" && "message" in data) {
        const m = (data as { message?: unknown }).message;
        if (typeof m === "string" && m.trim()) message = m;
      }
    } catch {
      // Non-JSON error body — keep the default message.
    }
    throw new ApiError(message, res.status, data);
  }

  return res.json();
}
