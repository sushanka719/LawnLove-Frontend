"use client";

import { useSession } from "@/hooks/use-session";

export default function DashboardPage() {
  const { data: session } = useSession();
  const name = session?.user?.name || session?.user?.email || "there";

  return (
    <div className="bg-lawn-bg-2 min-h-screen">
      <header className="border-b border-black/5 px-4 py-6 sm:px-6 lg:px-10 xl:px-16 2xl:px-[240px]">
        <h1 className="font-heading text-lawn-text-primary text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
      </header>

      <main className="px-4 py-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-[240px]">
        <p className="text-lawn-text-primary text-lg">Welcome back, {name}.</p>
      </main>
    </div>
  );
}
