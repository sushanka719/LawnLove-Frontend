import { AddAddressButton } from "@/components/dashboard/add-address-button";
import { AddressList } from "@/components/dashboard/address-list";
import { NotificationBell } from "@/components/dashboard/dashboard-actions";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export default function AddressPage() {
  return (
    <DashboardPanel
      title="Saved Addresses"
      subtitle="Properties we keep on file for faster booking."
      actions={
        <>
          <NotificationBell />
          <AddAddressButton />
        </>
      }
    >
      <AddressList />
    </DashboardPanel>
  );
}
