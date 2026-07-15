type DashboardPanelProps = {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * The scrolling content panel to the right of the sidebar: a rounded card with
 * a sticky-feeling header (title + subtitle + optional actions) and a scrollable
 * body. Shared by every dashboard screen.
 */
export function DashboardPanel({
  title,
  subtitle,
  actions,
  children,
}: DashboardPanelProps) {
  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <header className="flex shrink-0 flex-col gap-4 border-b border-[#cecece]/40 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <h1 className="text-lawn-primary text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-lawn-text-primary text-lg tracking-tight">{subtitle}</p>
        </div>
        {actions ? (
          <div className="flex items-center gap-4 lg:gap-5">{actions}</div>
        ) : null}
      </header>

      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
