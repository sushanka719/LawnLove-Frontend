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

export function slugifyUsername(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9_.\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  const padded = base.length < 3 ? `${base}user` : base;
  return `${padded.slice(0, 26)}${Math.floor(1000 + Math.random() * 9000)}`;
}
