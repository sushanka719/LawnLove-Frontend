type MeasuredAreaCardProps = {
  areaSqFt: number;
  estimatedAreaSqFt: number;
  totalPrice: number;
};

export function MeasuredAreaCard({
  areaSqFt,
  estimatedAreaSqFt,
  totalPrice,
}: MeasuredAreaCardProps) {
  return (
    <div className="bg-lawn-bg-2 flex w-full flex-col gap-4 rounded-xl p-6 shadow-[0px_4px_8px_0px_rgba(74,74,74,0.14)]">
      <p className="text-lawn-text-secondary font-heading text-lg font-semibold">
        MEASURED AREA
      </p>
      <div className="flex flex-col gap-3 border-b border-[#cecece] pb-4">
        <div className="flex items-center justify-between">
          <p className="text-lawn-text-tertiary text-base font-medium">Lawn area</p>
          <p className="text-lawn-text-primary text-lg font-semibold">
            {areaSqFt.toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lawn-text-tertiary text-base">Estimated area</p>
          <p className="text-lawn-text-primary text-2xl font-semibold">
            {estimatedAreaSqFt.toLocaleString()} sq ft
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-lawn-text-primary text-lg font-medium">Total price</p>
        <p className="text-lawn-primary text-2xl font-semibold">${totalPrice}</p>
      </div>
    </div>
  );
}
