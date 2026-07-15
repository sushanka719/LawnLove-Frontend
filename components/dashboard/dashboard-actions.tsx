import Link from "next/link";
import { Bell, Plus, Search, type LucideIcon } from "lucide-react";

const gradientButtonClasses =
  "lawn-gradient-btn flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold tracking-tight whitespace-nowrap text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90";

/** Primary gradient action button used in dashboard headers. Renders a link
 * when `href` is given, otherwise an inert button (static screens). */
export function GradientButton({
  href,
  icon: Icon,
  children,
}: {
  href?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  const content = (
    <>
      <Icon className="size-6" strokeWidth={2} />
      {children}
    </>
  );

  return href ? (
    <Link href={href} className={gradientButtonClasses}>
      {content}
    </Link>
  ) : (
    <button type="button" className={gradientButtonClasses}>
      {content}
    </button>
  );
}

/** Green outlined button used for secondary actions (Pause plan, Change password, …). */
export function OutlineButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="border-lawn-primary-light text-lawn-primary hover:bg-lawn-primary-light/10 shrink-0 rounded-xl border-[1.2px] px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap transition-colors"
    >
      {children}
    </button>
  );
}

export function DashboardSearch() {
  return (
    <div className="text-lawn-text-tertiary hidden flex-1 items-center gap-2.5 rounded-[10px] border border-[#cecece] px-4 py-2.5 md:flex lg:w-[420px] lg:max-w-[507px]">
      <Search className="size-6 shrink-0" strokeWidth={1.75} />
      <span className="text-lg tracking-tight">Search...</span>
    </div>
  );
}

export function NotificationBell() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="text-lawn-text-primary hover:text-lawn-primary shrink-0 transition-colors"
    >
      <Bell className="size-7" strokeWidth={1.75} />
    </button>
  );
}

export function NewBookingButton() {
  return (
    <GradientButton href="/booking/address" icon={Plus}>
      New booking
    </GradientButton>
  );
}
