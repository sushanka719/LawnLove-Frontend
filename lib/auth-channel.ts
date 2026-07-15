// Cross-tab auth signal. Sign-in can complete in a different tab than the one
// that started it — e.g. the signup magic link opens /set-password in a second
// tab, while the original tab is still on the "check your email" screen. The
// tab that finishes signing in broadcasts here so any other tab sitting on a
// pre-auth screen can move itself forward without a manual reload.
//
// This only carries the fact that a sign-in happened; the session itself still
// lives in the shared better-auth cookie, so listeners re-read it as usual.
const CHANNEL_NAME = "lawn-auth";

export type AuthSignal = "signed-in";

function isSupported(): boolean {
  return typeof window !== "undefined" && "BroadcastChannel" in window;
}

export function broadcastAuthSignal(signal: AuthSignal) {
  if (!isSupported()) return;
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.postMessage(signal);
  channel.close();
}

// Returns an unsubscribe function. A no-op (and no listener) where
// BroadcastChannel is unavailable — callers should have a focus-based fallback.
export function subscribeAuthSignal(handler: (signal: AuthSignal) => void) {
  if (!isSupported()) return () => {};
  const channel = new BroadcastChannel(CHANNEL_NAME);
  const listener = (event: MessageEvent<AuthSignal>) => handler(event.data);
  channel.addEventListener("message", listener);
  return () => {
    channel.removeEventListener("message", listener);
    channel.close();
  };
}
