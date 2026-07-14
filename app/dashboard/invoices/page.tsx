import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { InvoiceList } from "@/components/dashboard/invoice-list";

export default function InvoicesPage() {
  return (
    <DashboardPanel title="Invoices" subtitle="Receipts for every completed visit.">
      <InvoiceList />
    </DashboardPanel>
  );
}
