import { ReviewSummary } from "@/components/booking/review-summary";

export default function ReviewStepPage() {
  return (
    <main className="flex justify-center px-4 pb-16 sm:px-6 lg:px-10 xl:px-16 2xl:px-[240px]">
      <div className="w-full max-w-[1520px]">
        <ReviewSummary />
      </div>
    </main>
  );
}
