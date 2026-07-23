/**
 * Static placeholder data for the agent (crew owner) Dashboard and Bookings
 * screens — Figma nodes 1111:8359 (dashboard) and 1126:10646 (bookings).
 *
 * This is a visual-only mockup: the agent backend does not yet expose crew /
 * employee data, per-booking customers, or payout figures. When those land,
 * replace these exports with the shapes returned by the agent API (see
 * `lib/api/agent.ts` / `hooks/use-agent.ts`).
 */

import type { AgentJobStatus } from "@/components/agent/agent-status-badge";

/** A person shown as an initials avatar (customer or assigned crew member). */
export type Person = {
  name: string;
  email?: string;
  /** Avatar background, matching the per-person colors used in the design. */
  color: string;
};

/* ------------------------------------------------------------------ */
/* Employees — crew list                                               */
/* ------------------------------------------------------------------ */

/** Service specialty tags shown next to each crew member. */
export type ServiceTag = "Mowing" | "Leaf removal" | "Fertilization";

/** Pill colors per specialty, straight from the design. */
export const SERVICE_TAG_STYLES: Record<ServiceTag, string> = {
  Mowing: "bg-[#dbeafe] text-[#1d4ed8]",
  "Leaf removal": "bg-[#ffedd5] text-[#c2410c]",
  Fertilization: "bg-lawn-badge-bg text-lawn-primary",
};

export type Employee = {
  name: string;
  color: string;
  jobsThisWeek: number;
  services: ServiceTag[];
};

export const EMPLOYEES: Employee[] = [
  {
    name: "Dylan Torres",
    color: "#9333ea",
    jobsThisWeek: 14,
    services: ["Mowing", "Leaf removal"],
  },
  {
    name: "Tara Phillips",
    color: "#0e7490",
    jobsThisWeek: 10,
    services: ["Mowing", "Leaf removal", "Fertilization"],
  },
  {
    name: "Lena brooks",
    color: "#d97706",
    jobsThisWeek: 4,
    services: ["Mowing"],
  },
  {
    name: "Carlos Mendez",
    color: "#1d4ed8",
    jobsThisWeek: 23,
    services: ["Mowing"],
  },
];

/* ------------------------------------------------------------------ */
/* Dashboard — stat cards                                              */
/* ------------------------------------------------------------------ */

export type StatCard = {
  label: string;
  value: string;
  sub: string;
};

export const STAT_CARDS: StatCard[] = [
  { label: "Today", value: "8", sub: "Job scheduled" },
  { label: "This week", value: "$4820", sub: "Earned" },
  { label: "Crew", value: "6", sub: "4 working now" },
  { label: "This week", value: "$320", sub: "Payout pending" },
];

/* ------------------------------------------------------------------ */
/* Dashboard — "Today's Schedule" table                                */
/* ------------------------------------------------------------------ */

export type ScheduleRow = {
  time: string;
  service: string;
  customer: Person;
  assignedTo: Person;
  status: AgentJobStatus;
};

export const SCHEDULE_ROWS: ScheduleRow[] = [
  {
    time: "10:30 AM",
    service: "Lawn Mowing",
    customer: { name: "Gavrial Carter", email: "gavrial4@gmail.com", color: "#4f46e5" },
    assignedTo: { name: "Dylan Torres", color: "#15803d" },
    status: "ongoing",
  },
  {
    time: "1:30 PM",
    service: "Lawn Mowing",
    customer: { name: "Raymond Patel", email: "raymond@gmail.com", color: "#9333ea" },
    assignedTo: { name: "Tara Phillips", color: "#1e40af" },
    status: "ongoing",
  },
  {
    time: "10:30 AM",
    service: "Fertilization",
    customer: { name: "Monica Walsh", email: "monicaw@gmail.com", color: "#d97706" },
    assignedTo: { name: "Carlos Menedez", color: "#0e7490" },
    status: "completed",
  },
  {
    time: "5:30 PM",
    service: "Lawn Mowing",
    customer: { name: "Daniel Foster", email: "daniel@gmail.com", color: "#0d9488" },
    assignedTo: { name: "Amber Rock", color: "#15803d" },
    status: "ongoing",
  },
  {
    time: "09:30 AM",
    service: "Yard Cleanup",
    customer: { name: "Ivary Bennett", email: "ivary@gmail.com", color: "#0e7490" },
    assignedTo: { name: "Alexdran Peter", color: "#9333ea" },
    status: "completed",
  },
  {
    time: "12:30 PM",
    service: "Fertilization",
    customer: { name: "Rachel Nguyen", email: "rachel@gmail.com", color: "#fecd03" },
    assignedTo: { name: "Lena Brooks", color: "#ea580c" },
    status: "ongoing",
  },
];

/* ------------------------------------------------------------------ */
/* Bookings — table                                                    */
/* ------------------------------------------------------------------ */

export type BookingRow = {
  id: string;
  service: string;
  customer: Person;
  scheduleTime: string;
  assignedTo: Person;
  amount: string;
  status: AgentJobStatus;
};

/* ------------------------------------------------------------------ */
/* Earnings — stat cards + payout requests                             */
/* ------------------------------------------------------------------ */

export const EARNING_STATS: StatCard[] = [
  { label: "Available Balance", value: "$4,852", sub: "Ready to withdraw" },
  { label: "Pending", value: "$1,240", sub: "Awaiting payout" },
  { label: "This Month", value: "$18,640", sub: "Net earnings" },
  { label: "Lifetime", value: "$20k", sub: "Since 2026" },
];

export type PayoutRequest = {
  id: string;
  requestedTime: string;
  amount: string;
  status: Extract<AgentJobStatus, "paid" | "pending">;
};

export const PAYOUT_REQUESTS: PayoutRequest[] = [
  { id: "#PR-9078", requestedTime: "Jul 20, 2026", amount: "$567", status: "paid" },
  { id: "#PR-9078", requestedTime: "Jul 28, 2026", amount: "$110", status: "pending" },
  { id: "#PR-9078", requestedTime: "Jan 15, 2026", amount: "$67", status: "paid" },
  { id: "#PR-9078", requestedTime: "Mar 23, 2026", amount: "$305", status: "pending" },
  { id: "#PR-9078", requestedTime: "Jul 20, 2026", amount: "$60", status: "paid" },
  { id: "#PR-9078", requestedTime: "Feb 12, 2026", amount: "$630", status: "paid" },
];

export const BOOKING_ROWS: BookingRow[] = [
  {
    id: "#BK-9078",
    service: "Lawn Mowing",
    customer: { name: "Gavrial Carter", email: "gavrial4@gmail.com", color: "#4f46e5" },
    scheduleTime: "Today-10:30 AM",
    assignedTo: { name: "Dylan Torres", color: "#15803d" },
    amount: "$567",
    status: "inProgress",
  },
  {
    id: "#BK-9078",
    service: "Lawn Mowing",
    customer: { name: "Raymond Patel", email: "raymond@gmail.com", color: "#9333ea" },
    scheduleTime: "Today-1:30 PM",
    assignedTo: { name: "Tara Phillips", color: "#1e40af" },
    amount: "$110",
    status: "inProgress",
  },
  {
    id: "#BK-9078",
    service: "Fertilization",
    customer: { name: "Monica Walsh", email: "monicaw@gmail.com", color: "#d97706" },
    scheduleTime: "Yesterday-5:30 PM",
    assignedTo: { name: "Lena Brooks", color: "#ea580c" },
    amount: "$67",
    status: "completed",
  },
  {
    id: "#BK-9078",
    service: "Lawn Mowing",
    customer: { name: "Daniel Foster", email: "daniel@gmail.com", color: "#0d9488" },
    scheduleTime: "Yesterday-12:30 PM",
    assignedTo: { name: "Amber Rock", color: "#15803d" },
    amount: "$305",
    status: "inProgress",
  },
  {
    id: "#BK-9078",
    service: "Yard Cleanup",
    customer: { name: "Ivary Bennett", email: "ivary@gmail.com", color: "#0e7490" },
    scheduleTime: "Yesterday-10:30 AM",
    assignedTo: { name: "Alexdran Peter", color: "#9333ea" },
    amount: "$60",
    status: "scheduled",
  },
  {
    id: "#BK-9078",
    service: "Lawn Mowing",
    customer: { name: "Rachel Nguyen", email: "rachel@gmail.com", color: "#fecd03" },
    scheduleTime: "Today-1:30 PM",
    assignedTo: { name: "Lena Brooks", color: "#ea580c" },
    amount: "$630",
    status: "inProgress",
  },
  {
    id: "#BK-9078",
    service: "Lawn Mowing",
    customer: { name: "Monica Walsh", email: "monicaw@gmail.com", color: "#d97706" },
    scheduleTime: "Yesterday-09:30 AM",
    assignedTo: { name: "Carlos Menedez", color: "#0e7490" },
    amount: "$630",
    status: "inProgress",
  },
  {
    id: "#BK-9078",
    service: "Lawn Mowing",
    customer: { name: "Raymond Patel", email: "raymond@gmail.com", color: "#9333ea" },
    scheduleTime: "Yesterday-2:30 PM",
    assignedTo: { name: "Lena Brooks", color: "#ea580c" },
    amount: "$630",
    status: "completed",
  },
];
