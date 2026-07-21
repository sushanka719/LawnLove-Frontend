import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminPlans } from "@/components/admin/admin-plans";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { buttonVariants } from "@/components/ui/button";

export default function AdminPlansPage() {
  return (
    <DashboardPanel
      title="Plans"
      subtitle="Booking plans customers choose from."
      actions={
        <Link
          href="/admin/plans/new"
          className={buttonVariants({ variant: "default", size: "lg" })}
        >
          <Plus /> New plan
        </Link>
      }
    >
      <AdminPlans />
    </DashboardPanel>
  );
}
