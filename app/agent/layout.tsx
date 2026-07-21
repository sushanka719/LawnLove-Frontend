import { AgentSidebar } from "@/components/agent/agent-sidebar";

export default function AgentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-lawn-bg-2 flex min-h-screen gap-4 p-4 lg:gap-6 lg:p-6">
      <AgentSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
