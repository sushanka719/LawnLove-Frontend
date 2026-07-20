import { DashboardCard } from "@/components/admin/dashboard-card";
import { CUSTOMER_INSIGHTS } from "@/components/admin/dashboard-mock";

export function CustomerInsights() {
  return (
    <DashboardCard className="p-6">
      <div className="text-[17px] font-semibold tracking-[-0.01em]">
        Customer Insights
      </div>
      <div className="text-muted-foreground mt-0.5 text-[13px]">User base health</div>

      <div className="my-5 grid grid-cols-2 gap-3">
        <div className="border-border rounded-xl border p-3.5">
          <div className="text-2xl font-semibold tracking-[-0.02em]">12,840</div>
          <div className="text-muted-foreground mt-0.5 text-xs">Total Users</div>
        </div>
        <div className="border-border rounded-xl border p-3.5">
          <div className="text-2xl font-semibold tracking-[-0.02em]">1,204</div>
          <div className="text-muted-foreground mt-0.5 text-xs">New This Month</div>
        </div>
      </div>

      {CUSTOMER_INSIGHTS.map((insight) => (
        <div key={insight.label} className="mb-4 last:mb-0">
          <div className="mb-[7px] flex justify-between text-[13px]">
            <span>{insight.label}</span>
            <span className="font-semibold">{insight.value}</span>
          </div>
          <div className="bg-muted h-[7px] overflow-hidden rounded-full">
            <div
              className="h-full rounded-full"
              style={{ width: insight.width, background: insight.color }}
            />
          </div>
        </div>
      ))}
    </DashboardCard>
  );
}
