"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CircleQuestionMark,
  CreditCard,
  LayoutGrid,
  MapPin,
  Notebook,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { SidebarAccountCard } from "@/components/dashboard/sidebar-account-card";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: LucideIcon;
  // Only built screens get an href; the rest are inert placeholders for now.
  href?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { label: "Bookings", icon: Calendar, href: "/dashboard/bookings" },
  { label: "Address", icon: MapPin, href: "/dashboard/address" },
  { label: "Payment methods", icon: CreditCard, href: "/dashboard/payment-methods" },
  { label: "Invoices", icon: Notebook, href: "/dashboard/invoices" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  { label: "Support", icon: CircleQuestionMark, href: "/dashboard/support" },
];

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

function itemClasses(active: boolean) {
  return cn(
    "flex w-full items-center gap-2.5 rounded-lg p-3 text-left text-lg font-medium tracking-tight transition-colors",
    active
      ? "bg-lawn-badge-bg text-lawn-primary"
      : "text-lawn-text-secondary hover:bg-black/[0.03]",
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-lawn-bg-2 hidden w-72 shrink-0 flex-col rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)] lg:flex">
      {/* Logo */}
      <Link href="/" className="flex h-22 shrink-0 items-center gap-2 px-5">
        <Image src="/landing/logo-mark.svg" alt="" width={32} height={39} />
        <span className="text-lawn-text-primary font-heading text-[22px] font-semibold tracking-tight">
          LawnLove
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 px-5 pt-6">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = isActive(pathname, href);
          const content = (
            <>
              <Icon className="size-7 shrink-0" strokeWidth={active ? 2 : 1.75} />
              <span>{label}</span>
            </>
          );

          return href ? (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={itemClasses(active)}
            >
              {content}
            </Link>
          ) : (
            <button key={label} type="button" className={itemClasses(false)}>
              {content}
            </button>
          );
        })}
      </nav>

      {/* User card */}
      <SidebarAccountCard
        profileHref="/dashboard/profile"
        active={isActive(pathname, "/dashboard/profile")}
        className="mx-5 mt-4 mb-6"
      />
    </aside>
  );
}
