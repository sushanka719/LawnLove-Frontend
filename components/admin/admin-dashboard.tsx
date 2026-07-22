"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { BookingStatus } from "@/components/admin/booking-status";
import { InviteAgentModal } from "@/components/admin/invite-agent-modal";
import { KpiCards } from "@/components/admin/kpi-cards";
import { RecentBookings } from "@/components/admin/recent-bookings";
import { RevenueAnalytics } from "@/components/admin/revenue-analytics";

export function AdminDashboard() {
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

      <main className="flex flex-col gap-6 pb-4">
        <KpiCards />

        <div className="grid gap-6 lg:grid-cols-[1.9fr_1fr]">
          <RevenueAnalytics />
          <BookingStatus />
        </div>

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
