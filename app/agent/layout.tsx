import { BookingHeader } from "@/components/booking/booking-header";

export default function AgentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-lawn-bg-2 min-h-screen">
      <BookingHeader />
      <main className="mx-auto w-full max-w-[900px] px-4 py-8 sm:px-6 lg:py-10">
        {children}
      </main>
    </div>
  );
}
