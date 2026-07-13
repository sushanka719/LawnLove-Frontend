import { BookingHeader } from "@/components/booking/booking-header";
import { StepsIndicator } from "@/components/booking/steps-indicator";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-lawn-bg-2 min-h-screen">
      <BookingHeader />
      <StepsIndicator />
      {children}
    </div>
  );
}
