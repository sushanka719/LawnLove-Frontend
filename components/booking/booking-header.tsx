import Image from "next/image";
import Link from "next/link";

export function BookingHeader() {
  return (
    <header className="bg-lawn-bg-2 sticky top-0 z-50 shadow-[4px_0px_16px_0px_rgba(119,119,119,0.25)]">
      <div className="flex items-center px-4 py-4 sm:px-6 lg:px-10 lg:py-5 xl:px-16 xl:py-6 2xl:px-[240px]">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/landing/logo-mark.svg" alt="" width={32} height={39} />
          <span className="text-lawn-text-primary font-heading text-[22px] font-semibold tracking-tight">
            LawnLove
          </span>
        </Link>
      </div>
    </header>
  );
}
