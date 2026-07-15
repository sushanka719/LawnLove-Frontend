import { Plus } from "lucide-react";

import { AddressList } from "@/components/dashboard/address-list";
import {
  GradientButton,
  NotificationBell,
} from "@/components/dashboard/dashboard-actions";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AddressPage() {
  return (
    <DashboardPanel
      title="Saved Addresses"
      subtitle="Properties we keep on file for faster booking."
      actions={
        <>
          <NotificationBell />
          <GradientButton icon={Plus}>Add address</GradientButton>
        </>
      }
    >
      <AddressList />
    </DashboardPanel>
  );
}
