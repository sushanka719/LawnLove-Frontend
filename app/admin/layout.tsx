import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="admin-theme bg-background text-foreground flex min-h-screen gap-4 p-4 lg:gap-6 lg:p-6">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">{children}</div>
    </div>
  );
}
