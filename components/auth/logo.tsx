export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M14 2C8 2 3 7 3 14c0 6 4 11 9 12 1-6 1-11 1-15 0-4 0-7 1-9Z"
          fill="#1F6B3A"
        />
        <path d="M14 2c5 1 9 5 9 11 0 6-4 11-9 12-1-7-1-15 0-23Z" fill="#8CC63F" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-neutral-900">
        LawnLove
      </span>
    </div>
  );
}
