import { PaymentForm } from "@/components/booking/payment-form";

export default function PaymentStepPage() {
  return (
    <main className="flex justify-center px-4 pb-16 sm:px-6 lg:px-10 xl:px-16 2xl:px-[240px]">
      <div className="w-full max-w-[1520px]">
        <PaymentForm />
      </div>
    </main>
  );
}
