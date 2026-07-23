import { Bell, Plus, Search, type LucideIcon } from "lucide-react";

/**
 * Shared header for the agent crew screens (Dashboard, Bookings) — Figma nodes
 * 1111:8359 / 1126:10646. A page title + subtitle on the left, and a search
 * box, notification bell, and gradient "Add employee" action on the right.
 */
export function AgentTopbar({
  title,
  subtitle,
  showSearch = true,
  actionLabel = "Add employee",
  actionIcon: ActionIcon = Plus,
  onAction,
  showAction = true,
}: {
  title: string;
  subtitle: string;
  /** Show the search box (hidden on screens like Services that omit it). */
  showSearch?: boolean;
  /** Label for the primary gradient action (e.g. "Add employee", "New service"). */
  actionLabel?: string;
  /** Icon for the primary gradient action (defaults to a plus). */
  actionIcon?: LucideIcon;
  /** Click handler for the primary action. When omitted the button is inert. */
  onAction?: () => void;
  /** Hide the primary action button entirely (screens with no primary action). */
  showAction?: boolean;
}) {
  return (
    <header className="flex shrink-0 flex-col gap-4 border-b border-[#cecece]/40 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="min-w-0">
        <h1 className="text-lawn-primary text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-lawn-text-primary text-lg tracking-tight">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4 lg:gap-5">
        {showSearch && (
          /* Search — visual only for now (no backing endpoint). */
          <div className="text-lawn-text-tertiary hidden items-center gap-2.5 rounded-[10px] border border-[#cecece] px-4 py-2.5 md:flex lg:w-[420px] lg:max-w-[507px]">
            <Search className="size-6 shrink-0" strokeWidth={1.75} />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="placeholder:text-lawn-text-tertiary text-lawn-text-primary w-full bg-transparent text-lg tracking-tight outline-none"
            />
          </div>
        )}

        <button
          type="button"
          aria-label="Notifications"
          className="text-lawn-text-primary hover:text-lawn-primary shrink-0 transition-colors"
        >
          <Bell className="size-7" strokeWidth={1.75} />
        </button>

        {showAction && (
          <button
            type="button"
            onClick={onAction}
            className="lawn-gradient-btn flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold tracking-tight whitespace-nowrap text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90"
          >
            <ActionIcon className="size-6" strokeWidth={2} />
            {actionLabel}
          </button>
        )}
      </div>
    </header>
  );
}

/** Initials avatar circle used in the schedule / bookings tables. */
export function InitialsAvatar({
  name,
  color,
  className = "size-10 text-[17.5px]",
}: {
  name: string;
  color: string;
  className?: string;
}) {
  const initial = name.trim()[0]?.toUpperCase() ?? "?";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-medium text-white ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initial}
    </span>
  );
}
