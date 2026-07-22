"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { UserAvatar } from "@/components/dashboard/user-avatar";
import { useSession, useSignOut } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

/**
 * The signed-in user card pinned to the bottom of every sidebar (customer,
 * agent, admin). Reads the live session, links the identity to the profile page
 * when `profileHref` is given, and signs out via the shared `useSignOut`
 * mutation — redirecting home on success.
 */
export function SidebarAccountCard({
  profileHref,
  active = false,
  className,
}: {
  /** When set, the avatar + name link here (e.g. "/admin/profile"). */
  profileHref?: string;
  /** Highlight the card (e.g. when the profile route is active). */
  active?: boolean;
  /** Extra classes for outer spacing (margins) per sidebar. */
  className?: string;
}) {
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

  const identity = (
    <>
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
          <p className="text-lawn-text-tertiary truncate text-sm font-medium tracking-tight">
            {user.email}
          </p>
        )}
      </div>
    </>
  );

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-[10px] p-3 shadow-[0px_0px_16px_2px_rgba(25,81,52,0.1)]",
        active && "bg-lawn-badge-bg",
        className,
      )}
    >
      {profileHref ? (
        <Link
          href={profileHref}
          aria-label="View profile"
          aria-current={active ? "page" : undefined}
          className="flex min-w-0 flex-1 items-center gap-2.5"
        >
          {identity}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2.5">{identity}</div>
      )}
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
  );
}
