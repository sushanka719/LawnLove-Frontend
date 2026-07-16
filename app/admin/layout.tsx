import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-lawn-bg-2 min-h-screen p-4 sm:p-6">
      <div className="flex h-[calc(100dvh-2rem)] gap-6 sm:h-[calc(100dvh-3rem)]">
        <AdminSidebar />
        {children}
      </div>
    </div>
  );
}
