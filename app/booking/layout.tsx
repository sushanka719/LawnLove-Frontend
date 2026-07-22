import { Suspense } from "react";

import { BookingGuard } from "@/components/booking/booking-guard";
import { BookingHeader } from "@/components/booking/booking-header";
import { StepsIndicator } from "@/components/booking/steps-indicator";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-lawn-bg-2 min-h-screen">
      <BookingHeader />
      <StepsIndicator />
      {/* BookingGuard reads ?redirect_status= via useSearchParams — Next
          requires a Suspense boundary around client components that do. */}
      <Suspense fallback={null}>
        <BookingGuard>{children}</BookingGuard>
      </Suspense>
    </div>
  );
}
