"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  CircleQuestionMark,
  CreditCard,
  LayoutGrid,
  LogOut,
  MapPin,
  Notebook,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { UserAvatar } from "@/components/dashboard/user-avatar";
import { useSession, useSignOut } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: LucideIcon;
  // Only built screens get an href; the rest are inert placeholders for now.
  href?: string;
};

// Order + icons mirror the Figma agent dashboard (node 972:3144). Dashboard is
// the only built screen today; the rest are placeholders until their pages land.
const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/agent" },
  { label: "Bookings", icon: CreditCard },
  { label: "Employee", icon: Calendar },
  { label: "Service", icon: MapPin },
  { label: "Earning", icon: Notebook },
  { label: "Support", icon: CircleQuestionMark },
  { label: "Settings", icon: Settings },
];

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  return href === "/agent" ? pathname === href : pathname.startsWith(href);
}

function itemClasses(active: boolean) {
  return cn(
    "flex w-full items-center gap-2.5 rounded-lg p-3 text-left text-lg font-medium tracking-tight transition-colors",
    active
      ? "bg-lawn-badge-bg text-lawn-primary"
      : "text-lawn-text-secondary hover:bg-black/[0.03]",
  );
}

export function AgentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const signOut = useSignOut();

  const user = session?.user;
  const displayName = user?.name || user?.email || "Your account";

  const handleSignOut = () => {
    if (signOut.isPending) return;
    signOut.mutate(undefined, {
      onSuccess: () => router.push("/"),
    });
  };

  return (
    <aside className="bg-lawn-bg-2 sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 flex-col rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)] lg:top-6 lg:flex lg:h-[calc(100vh-3rem)]">
      {/* Logo */}
      <Link href="/agent" className="flex h-22 shrink-0 items-center gap-2 px-5">
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
      <div className="mx-5 mt-4 mb-6 flex items-center gap-2.5 rounded-[10px] p-3 shadow-[0px_0px_16px_2px_rgba(25,81,52,0.1)]">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <UserAvatar
            name={user?.name}
            email={user?.email}
            image={user?.image}
            className="size-10"
            textClassName="text-[19px]"
            sizes="40px"
          />
          <div className="min-w-0 flex-1">
            <p className="text-lawn-text-primary truncate text-base font-semibold tracking-tight">
              {displayName}
            </p>
            {user?.email && (
              <p className="text-lawn-text-tertiary truncate text-base font-medium tracking-tight">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signOut.isPending}
          aria-label="Log out"
          className="text-lawn-text-secondary hover:text-lawn-primary shrink-0 transition-colors disabled:opacity-50"
        >
          <LogOut className="size-6" strokeWidth={1.75} />
        </button>
      </div>
    </aside>
  );
}
