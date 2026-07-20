"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  CreditCard,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Scissors,
  Settings,
  Sprout,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  /** Muted count shown on the right (Management group). */
  badge?: string;
  /** Red pill count shown on the right (Operations group). */
  pill?: string;
};

const PRIMARY_NAV: NavItem[] = [{ label: "Dashboard", icon: LayoutGrid, href: "/admin" }];

const MANAGEMENT_NAV: NavItem[] = [
  { label: "Agents", icon: Users, href: "/admin/agents", badge: "218" },
  { label: "Customers", icon: UserRound, href: "/admin/users" },
  { label: "Bookings", icon: Calendar, href: "/admin/bookings" },
];

// These routes don't exist yet — placeholders while the dashboard is static.
const OPERATIONS_NAV: NavItem[] = [
  { label: "Services", icon: Scissors, href: "#" },
  { label: "Payments", icon: CreditCard, href: "#" },
  { label: "Analytics", icon: BarChart3, href: "#" },
  { label: "Support", icon: LifeBuoy, href: "#", pill: "3" },
  { label: "Settings", icon: Settings, href: "#" },
];

function isActive(pathname: string, href: string) {
  if (href === "#") return false;
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const { label, icon: Icon, href, badge, pill } = item;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-accent text-foreground" : "text-foreground hover:bg-accent",
      )}
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      />
      <span className="flex-1 truncate">{label}</span>
      {badge && <span className="text-muted-foreground text-xs">{badge}</span>}
      {pill && (
        <span className="bg-destructive inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white">
          {pill}
        </span>
      )}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-sidebar border-sidebar-border sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r lg:flex">
      {/* Brand */}
      <Link href="/admin" className="flex items-center gap-3 px-5 py-[22px]">
        <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-[10px]">
          <Sprout className="size-[22px]" />
        </span>
        <span className="flex flex-col">
          <span className="text-[15px] font-semibold tracking-[-0.01em]">LawnLove</span>
          <span className="text-muted-foreground text-xs">Super Admin</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-1">
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.label} item={item} active={isActive(pathname, item.href)} />
        ))}

        <div className="text-muted-foreground flex items-center justify-between px-3 pt-4 pb-1.5 text-[11px] font-semibold tracking-[0.06em]">
          MANAGEMENT
        </div>
        {MANAGEMENT_NAV.map((item) => (
          <NavLink key={item.label} item={item} active={isActive(pathname, item.href)} />
        ))}

        <div className="text-muted-foreground px-3 pt-4 pb-1.5 text-[11px] font-semibold tracking-[0.06em]">
          OPERATIONS
        </div>
        {OPERATIONS_NAV.map((item) => (
          <NavLink key={item.label} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      {/* Account — static placeholder; wire to useSession() when going live. */}
      <div className="border-sidebar-border flex items-center gap-3 border-t px-4 py-3.5">
        <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full text-[13px] font-semibold">
          AM
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">Alex Morgan</p>
          <p className="text-muted-foreground truncate text-xs">alex@lawnlove.co</p>
        </div>
        <button
          type="button"
          aria-label="Log out"
          className="text-muted-foreground hover:bg-accent flex shrink-0 rounded-lg p-1.5 transition-colors"
        >
          <LogOut className="size-[18px]" />
        </button>
      </div>
    </aside>
  );
}
