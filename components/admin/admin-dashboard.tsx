"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Download,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { BookingStatus } from "@/components/admin/booking-status";
import { CustomerInsights } from "@/components/admin/customer-insights";
import { FILTER_PERIODS } from "@/components/admin/dashboard-mock";
import { InviteAgentModal } from "@/components/admin/invite-agent-modal";
import { KpiCards } from "@/components/admin/kpi-cards";
import { RecentBookings } from "@/components/admin/recent-bookings";
import { RevenueAnalytics } from "@/components/admin/revenue-analytics";
import { Segmented } from "@/components/admin/segmented";
import { TopAgents } from "@/components/admin/top-agents";

function FilterButton({
  icon: Icon,
  children,
  chevron,
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  chevron?: boolean;
}) {
  return (
    <button
      type="button"
      className="border-border bg-background hover:bg-accent inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition-colors"
    >
      {Icon && <Icon className="text-muted-foreground size-[15px]" />}
      {children}
      {chevron && <ChevronDown className="text-muted-foreground size-3.5" />}
    </button>
  );
}

export function AdminDashboard() {
  const [period, setPeriod] = useState<(typeof FILTER_PERIODS)[number]>("Today");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleSent = (email: string) => {
    setInviteOpen(false);
    setToast(email ? `Invitation sent to ${email}` : "Invitation sent");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  return (
    <>
      <AdminTopbar onInvite={() => setInviteOpen(true)} />

      <main className="flex flex-col gap-6 px-8 pt-6 pb-12">
        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-3">
          <Segmented options={FILTER_PERIODS} value={period} onChange={setPeriod} />
          <FilterButton icon={MapPin} chevron>
            All Cities
          </FilterButton>
          <FilterButton icon={SlidersHorizontal} chevron>
            All Services
          </FilterButton>
          <FilterButton chevron>Agent Status</FilterButton>
          <div className="flex-1" />
          <FilterButton icon={RefreshCw}>Refresh</FilterButton>
          <FilterButton icon={Download}>Export</FilterButton>
        </div>

        {/* KPIs */}
        <KpiCards />

        {/* Revenue + booking status */}
        <div className="grid gap-5 lg:grid-cols-[1.9fr_1fr]">
          <RevenueAnalytics />
          <BookingStatus />
        </div>

        {/* Top agents + customer insights */}
        <div className="grid gap-5 lg:grid-cols-[1.9fr_1fr]">
          <TopAgents />
          <CustomerInsights />
        </div>

        {/* Recent bookings */}
        <RecentBookings />
      </main>

      <InviteAgentModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSent={handleSent}
      />

      {toast && (
        <div className="bg-primary text-primary-foreground fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-[10px] px-5 py-3 text-sm font-medium shadow-lg">
          <CheckCircle2 className="size-4" />
          {toast}
        </div>
      )}
    </>
  );
}
