import { env } from "@/config/env";

const AUTH_BASE_URL = `${env.NEXT_PUBLIC_API_URL}/api/auth`;

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

async function authRequest<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${AUTH_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data as { message?: string } | null)?.message ??
      "Something went wrong. Please try again.";
    throw new AuthError(message, res.status);
  }

  return data as T;
}

// better-auth redirects here on success, and appends `?error=INVALID_TOKEN` to
// this same URL if the magic link is expired/invalid/already used — so we
// carry the signup details along as query params to allow resending from the
// expired-link page without needing to look anything up server-side.
export function buildSetPasswordCallbackURL(
  email: string,
  name: string,
  username: string,
) {
  const url = new URL("/set-password", window.location.origin);
  url.searchParams.set("email", email);
  url.searchParams.set("name", name);
  url.searchParams.set("username", username);
  return url.toString();
}

export function signUpWithMagicLink(params: {
  email: string;
  name: string;
  username: string;
  callbackURL: string;
}) {
  return authRequest<{ status: boolean }>("/sign-in/magic-link", {
    email: params.email,
    name: params.name,
    metadata: { username: params.username },
    callbackURL: params.callbackURL,
  });
}

export function signInWithEmail(params: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  return authRequest<{ user: unknown }>("/sign-in/email", {
    email: params.email,
    password: params.password,
    rememberMe: params.rememberMe,
  });
}

export async function signInWithGoogle(callbackURL: string) {
  const data = await authRequest<{ url: string }>("/sign-in/social", {
    provider: "google",
    callbackURL,
  });
  window.location.href = data.url;
}

export function requestPasswordReset(params: { email: string; redirectTo: string }) {
  return authRequest<{ status: boolean }>("/request-password-reset", params);
}

export function resetPassword(params: { newPassword: string; token: string }) {
  return authRequest<{ status: boolean }>("/reset-password", params);
}

export async function setPassword(newPassword: string) {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/set-password`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      (data as { message?: string } | null)?.message ?? "Could not set your password.";
    throw new AuthError(message, res.status);
  }

  return res.json();
}
