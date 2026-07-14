import { http } from "@/lib/api/http";

// better-auth mounts its handlers under /api/auth. (set-password below is a
// separate custom Nest controller, mounted at /auth/set-password.)
const AUTH_PREFIX = "/api/auth";

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
  return http.post<{ status: boolean }>(`${AUTH_PREFIX}/sign-in/magic-link`, {
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
  return http.post<{ user: unknown }>(`${AUTH_PREFIX}/sign-in/email`, {
    email: params.email,
    password: params.password,
    rememberMe: params.rememberMe,
  });
}

export async function signInWithGoogle(callbackURL: string) {
  const data = await http.post<{ url: string }>(`${AUTH_PREFIX}/sign-in/social`, {
    provider: "google",
    callbackURL,
  });
  window.location.href = data.url;
}

export function requestPasswordReset(params: { email: string; redirectTo: string }) {
  return http.post<{ status: boolean }>(`${AUTH_PREFIX}/request-password-reset`, params);
}

export function resetPassword(params: { newPassword: string; token: string }) {
  return http.post<{ status: boolean }>(`${AUTH_PREFIX}/reset-password`, params);
}

export type Session = {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
  session: {
    id: string;
    expiresAt: string;
  };
};

export async function getSession(): Promise<Session | null> {
  // An unauthenticated / expired session surfaces as either a null body or an
  // error status — both mean "no session", never a thrown error to the caller.
  try {
    const data = await http.get<Session | null>(`${AUTH_PREFIX}/get-session`);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function signOut() {
  // Fire-and-forget: clear the session client-side regardless of the response,
  // matching the previous behavior of ignoring the sign-out result.
  try {
    await http.post(`${AUTH_PREFIX}/sign-out`);
  } catch {
    // Intentionally ignored — the caller clears local session state anyway.
  }
}

export function setPassword(newPassword: string) {
  return http.post("/auth/set-password", { newPassword });
}
