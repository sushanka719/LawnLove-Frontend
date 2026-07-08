import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WEBMAIL_URLS: Record<string, string> = {
  "gmail.com": "https://mail.google.com/mail/u/0/#inbox",
  "outlook.com": "https://outlook.live.com/mail/0/inbox",
  "hotmail.com": "https://outlook.live.com/mail/0/inbox",
  "live.com": "https://outlook.live.com/mail/0/inbox",
  "yahoo.com": "https://mail.yahoo.com",
  "icloud.com": "https://www.icloud.com/mail",
};

export function getWebmailUrl(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  return (domain && WEBMAIL_URLS[domain]) || `mailto:${email}`;
}

// Must always satisfy the backend's USERNAME_REGEX
// (LawnBackend/src/auth/validation.constants.ts): lowercase, starts with a
// letter, only [a-z0-9_.], no consecutive "." or "_", 3-30 chars. The user
// never sees or edits this value, so it must never be able to fail
// server-side validation regardless of what `name` contains.
export function slugifyUsername(name: string) {
  const collapsed = name
    .toLowerCase()
    .replace(/[^a-z0-9_.\s]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[_.]{2,}/g, "_")
    .replace(/^[^a-z]+/, "");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const base = collapsed.length > 0 ? collapsed : "user";
  return `${base.slice(0, 25)}${suffix}`;
}
