"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CreditCard,
  LayoutGrid,
  MapPin,
  ScrollText,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { SidebarAccountCard } from "@/components/dashboard/sidebar-account-card";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

// Routes marked "#" are placeholders — no page exists for them yet.
const NAV: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/admin" },
  { label: "Agent", icon: Users, href: "/admin/agents" },
  { label: "Customer", icon: MapPin, href: "/admin/users" },
  { label: "Bookings", icon: Calendar, href: "/admin/bookings" },
  { label: "Plans", icon: ScrollText, href: "/admin/plans" },
  { label: "Earning", icon: CreditCard, href: "#" },
  { label: "Payout", icon: Wallet, href: "/admin/payout" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "#") return false;
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

/** The LawnLove leaf mark (green blade + gold accent), from the brand asset. */
function LogoMark() {
  return (
    <svg
      viewBox="0 0 32.0005 39.0002"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-7 shrink-0"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.00193343 12.4049C0.00290067 19.2276 0.143474 25.6657 0.314676 26.7121C0.974015 30.7489 3.89928 35.1109 7.25433 37.0598C9.82108 38.5511 11.4057 38.8323 17.8137 38.9331C21.1388 38.9855 23.8593 38.9538 23.859 38.8623C23.8587 38.7709 23.1442 38.3563 22.2711 37.9407C20.5665 37.1296 17.8337 34.5663 16.7124 32.727C14.9268 29.7979 14.7379 28.6333 14.5364 19.309L14.3767 11.9303C14.3575 11.0387 14.1437 10.1621 13.7505 9.36169L13.2835 8.41102C10.9879 3.73791 6.65077 0.53514 2.12439 0.170948L0 0L0.00193343 12.4049Z"
        fill="#195134"
      />
      <path
        d="M30.376 38.9331C22.884 39.6547 16.4361 34.4659 15.3353 26.8294L15.1138 25.2945H17.5178C20.394 25.2945 23.4134 26.1508 25.5588 27.575C28.8207 29.7407 31.4858 33.7827 31.8253 37.0792L32 38.7767L30.376 38.9331Z"
        fill="#FECD03"
      />
    </svg>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const { label, icon: Icon, href } = item;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm transition-colors",
        active
          ? "bg-accent text-accent-foreground font-semibold"
          : "text-foreground/80 hover:bg-accent/60 font-medium",
      )}
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          active ? "text-primary" : "text-muted-foreground",
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-sidebar sticky top-6 hidden h-[calc(100vh-3rem)] w-[264px] shrink-0 flex-col rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)] lg:flex">
      {/* Brand */}
      <Link href="/admin" className="flex items-center gap-2.5 px-6 py-6">
        <LogoMark />
        <span className="text-[19px] font-extrabold tracking-[-0.02em]">LawnLove</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-2">
        {NAV.map((item) => (
          <NavLink key={item.label} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      {/* Signed-in account — session-driven, with working sign-out. */}
      <SidebarAccountCard
        profileHref="/admin/profile"
        active={isActive(pathname, "/admin/profile")}
        className="m-4"
      />
    </aside>
  );
}
