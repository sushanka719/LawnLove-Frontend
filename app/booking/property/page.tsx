import { PropertyForm } from "@/components/booking/property-form";

export default function PropertyStepPage() {
  return (
    <main className="flex justify-center px-4 pb-16 sm:px-6 lg:px-10 xl:px-16 2xl:px-[240px]">
      <div className="w-full max-w-[1520px]">
        <PropertyForm />
      </div>
    </main>
  );
}
