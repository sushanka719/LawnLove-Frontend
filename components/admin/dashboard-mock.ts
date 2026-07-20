/**
 * Static placeholder data for the Super Admin dashboard.
 *
 * This is a visual-only mockup — none of it is wired to the backend yet.
 * When we hook the dashboard up to real data, replace these exports with the
 * shapes returned by the admin API (see `lib/api/admin.ts` / `hooks/use-admin.ts`).
 */

/** Colored accents pulled straight from the design (Tailwind default palette). */
export const ACCENT = {
  green: "#16a34a",
  blue: "#2563eb",
  orange: "#ea580c",
  violet: "#7c3aed",
  red: "#dc2626",
  slate: "#94a3b8",
  yellow: "#eab308",
} as const;

/* ------------------------------------------------------------------ */
/* Revenue analytics chart                                             */
/* ------------------------------------------------------------------ */

export type SeriesName = "Revenue" | "Bookings" | "Commission" | "Profit";

export const CHART_SERIES: Record<SeriesName, { color: string; values: number[] }> = {
  Revenue: {
    color: ACCENT.green,
    values: [120, 128, 150, 148, 170, 185, 205, 222, 215, 245, 262, 284],
  },
  Bookings: {
    color: ACCENT.blue,
    values: [90, 110, 105, 140, 160, 150, 180, 200, 210, 230, 250, 270],
  },
  Commission: {
    color: ACCENT.orange,
    values: [30, 34, 40, 38, 45, 50, 55, 60, 58, 66, 70, 76],
  },
  Profit: {
    color: ACCENT.violet,
    values: [45, 50, 58, 55, 66, 72, 80, 88, 84, 95, 102, 110],
  },
};

export const SERIES_NAMES: SeriesName[] = ["Revenue", "Bookings", "Commission", "Profit"];

/** Chart y-axis ceiling (in $k) and the month labels along the x-axis. */
export const CHART_MAX = 341;
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const CHART_PERIODS = ["Daily", "Weekly", "Monthly", "Yearly"] as const;
export const FILTER_PERIODS = ["Today", "This Week", "This Month", "Custom"] as const;

/* ------------------------------------------------------------------ */
/* Booking status donut + legend                                       */
/* ------------------------------------------------------------------ */

export type BookingStatusSlice = {
  label: string;
  count: string;
  pct: string;
  color: string;
};

export const BOOKING_STATUS: BookingStatusSlice[] = [
  { label: "Completed", count: "1,840", pct: "53%", color: ACCENT.green },
  { label: "Scheduled", count: "642", pct: "18%", color: ACCENT.blue },
  { label: "In Progress", count: "318", pct: "9%", color: ACCENT.orange },
  { label: "Pending", count: "421", pct: "12%", color: ACCENT.slate },
  { label: "Cancelled", count: "261", pct: "8%", color: ACCENT.red },
];

/** Conic-gradient stops for the donut, matching the legend order/percentages. */
export const BOOKING_STATUS_GRADIENT =
  "conic-gradient(#16a34a 0 53%, #2563eb 53% 71%, #ea580c 71% 80%, #94a3b8 80% 92%, #dc2626 92% 100%)";

/* ------------------------------------------------------------------ */
/* Top performing agents                                               */
/* ------------------------------------------------------------------ */

export type TopAgent = {
  initials: string;
  name: string;
  owner: string;
  city: string;
  bookings: string;
  completion: string;
  rating: string;
  revenue: string;
  avatarBg: string;
  avatarColor: string;
};

export const TOP_AGENTS: TopAgent[] = [
  {
    initials: "GB",
    name: "GreenBlade Lawn Care",
    owner: "Marcus Reyes",
    city: "Austin, TX",
    bookings: "342",
    completion: "97%",
    rating: "4.9",
    revenue: "$48,200",
    avatarBg: "#dcfce7",
    avatarColor: "#16a34a",
  },
  {
    initials: "ST",
    name: "Suburban Turf Pros",
    owner: "Danielle Cho",
    city: "Dallas, TX",
    bookings: "318",
    completion: "95%",
    rating: "4.8",
    revenue: "$44,100",
    avatarBg: "#dbeafe",
    avatarColor: "#2563eb",
  },
  {
    initials: "EY",
    name: "Evergreen Yard Services",
    owner: "Tyler Brooks",
    city: "Phoenix, AZ",
    bookings: "296",
    completion: "96%",
    rating: "4.9",
    revenue: "$41,800",
    avatarBg: "#fef3c7",
    avatarColor: "#a16207",
  },
  {
    initials: "CE",
    name: "Cutting Edge Landscaping",
    owner: "Priya Nair",
    city: "Charlotte, NC",
    bookings: "271",
    completion: "92%",
    rating: "4.7",
    revenue: "$38,600",
    avatarBg: "#ede9fe",
    avatarColor: "#7c3aed",
  },
  {
    initials: "FC",
    name: "FreshCut Lawn Co.",
    owner: "Andre Willis",
    city: "Tampa, FL",
    bookings: "254",
    completion: "94%",
    rating: "4.8",
    revenue: "$35,900",
    avatarBg: "#ffe4e6",
    avatarColor: "#e11d48",
  },
  {
    initials: "PM",
    name: "ProMow Services",
    owner: "Rachel Quinn",
    city: "Atlanta, GA",
    bookings: "221",
    completion: "93%",
    rating: "4.7",
    revenue: "$31,500",
    avatarBg: "#cffafe",
    avatarColor: "#0891b2",
  },
];

/* ------------------------------------------------------------------ */
/* Customer insights                                                   */
/* ------------------------------------------------------------------ */

export type Insight = {
  label: string;
  value: string;
  width: string;
  color: string;
};

export const CUSTOMER_INSIGHTS: Insight[] = [
  { label: "Returning Users", value: "68%", width: "68%", color: ACCENT.green },
  { label: "Retention Rate", value: "76%", width: "76%", color: ACCENT.green },
  {
    label: "Avg. Customer Rating",
    value: "4.8 / 5",
    width: "96%",
    color: ACCENT.yellow,
  },
  {
    label: "Repeat Booking Rate",
    value: "34%",
    width: "34%",
    color: ACCENT.blue,
  },
];

/* ------------------------------------------------------------------ */
/* Recent bookings table                                               */
/* ------------------------------------------------------------------ */

export type RecentBooking = {
  id: string;
  customer: string;
  agent: string;
  service: string;
  scheduled: string;
  amount: string;
  payment: string;
  paymentColor: string;
  status: string;
  statusColor: string;
};

export const RECENT_BOOKINGS: RecentBooking[] = [
  {
    id: "#BK-48217",
    customer: "Olivia Bennett",
    agent: "GreenBlade Lawn Care",
    service: "Lawn Mowing",
    scheduled: "Today, 2:30 PM",
    amount: "$68",
    payment: "Paid",
    paymentColor: ACCENT.green,
    status: "In Progress",
    statusColor: ACCENT.blue,
  },
  {
    id: "#BK-48216",
    customer: "Daniel Foster",
    agent: "Evergreen Yard Services",
    service: "Hedge Trimming",
    scheduled: "Today, 11:00 AM",
    amount: "$124",
    payment: "Paid",
    paymentColor: ACCENT.green,
    status: "Completed",
    statusColor: ACCENT.green,
  },
  {
    id: "#BK-48215",
    customer: "Sophia Nguyen",
    agent: "Suburban Turf Pros",
    service: "Fertilization",
    scheduled: "Today, 9:15 AM",
    amount: "$89",
    payment: "Pending",
    paymentColor: ACCENT.orange,
    status: "Scheduled",
    statusColor: ACCENT.orange,
  },
  {
    id: "#BK-48214",
    customer: "James Carter",
    agent: "FreshCut Lawn Co.",
    service: "Leaf Removal",
    scheduled: "Yesterday, 4:45 PM",
    amount: "$152",
    payment: "Paid",
    paymentColor: ACCENT.green,
    status: "Completed",
    statusColor: ACCENT.green,
  },
  {
    id: "#BK-48213",
    customer: "Emma Walsh",
    agent: "Cutting Edge Landscaping",
    service: "Yard Cleanup",
    scheduled: "Yesterday, 1:20 PM",
    amount: "$210",
    payment: "Refunded",
    paymentColor: ACCENT.violet,
    status: "Cancelled",
    statusColor: ACCENT.red,
  },
  {
    id: "#BK-48212",
    customer: "Liam Patel",
    agent: "ProMow Services",
    service: "Aeration",
    scheduled: "Yesterday, 10:00 AM",
    amount: "$96",
    payment: "Failed",
    paymentColor: ACCENT.red,
    status: "Pending",
    statusColor: ACCENT.orange,
  },
];

/** Regions offered in the Invite Agent modal. */
export const INVITE_REGIONS = ["Texas", "Arizona", "Florida", "Georgia"];
