"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  ClipboardList,
  HardHat,
  LayoutGrid,
  LogOut,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react";

import { UserAvatar } from "@/components/dashboard/user-avatar";
import { useSession, useSignOut } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

type NavItem = { label: string; icon: LucideIcon; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", icon: LayoutGrid, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Agents", icon: HardHat, href: "/admin/agents" },
  { label: "Bookings", icon: Calendar, href: "/admin/bookings" },
  { label: "Jobs", icon: ClipboardList, href: "/admin/jobs" },
  { label: "Disputes", icon: TriangleAlert, href: "/admin/disputes" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function itemClasses(active: boolean) {
  return cn(
    "flex w-full items-center gap-2.5 rounded-lg p-3 text-left text-lg font-medium tracking-tight transition-colors",
    active
      ? "bg-lawn-badge-bg text-lawn-primary"
      : "text-lawn-text-secondary hover:bg-black/[0.03]",
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const signOut = useSignOut();

  const user = session?.user;
  const displayName = user?.name || user?.email || "Admin";

  const handleSignOut = () => {
    if (signOut.isPending) return;
    signOut.mutate(undefined, { onSuccess: () => router.push("/") });
  };

  return (
    <aside className="bg-lawn-bg-2 hidden w-72 shrink-0 flex-col rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)] lg:flex">
      <Link href="/" className="flex h-22 shrink-0 items-center gap-2 px-5">
        <Image src="/landing/logo-mark.svg" alt="" width={32} height={39} />
        <span className="text-lawn-text-primary font-heading text-[22px] font-semibold tracking-tight">
          LawnLove
        </span>
        <span className="bg-lawn-badge-bg text-lawn-primary ml-1 rounded-md px-2 py-0.5 text-xs font-semibold tracking-tight">
          Admin
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-2 px-5 pt-6">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={itemClasses(active)}
            >
              <Icon className="size-7 shrink-0" strokeWidth={active ? 2 : 1.75} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

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
