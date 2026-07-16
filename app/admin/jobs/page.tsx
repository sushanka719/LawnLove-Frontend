import { Suspense } from "react";

import { AdminJobs } from "@/components/admin/admin-jobs";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AdminJobsPage() {
  return (
    <DashboardPanel
      title="Jobs"
      subtitle="Dispatch agents and track every service visit."
    >
      {/* AdminJobs reads ?status= via useSearchParams — Next requires a
          Suspense boundary around client components that do. */}
      <Suspense fallback={null}>
        <AdminJobs />
      </Suspense>
    </DashboardPanel>
  );
}
