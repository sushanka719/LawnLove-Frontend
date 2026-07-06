import Image from "next/image";
import Link from "next/link";

export function AuthCard({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-lawn-bg-2 flex w-full max-w-[480px] flex-col items-center gap-8 rounded-2xl px-6 py-10 shadow-[0px_4px_4px_0px_rgba(66,41,159,0.08)] sm:px-10 sm:py-12">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/landing/logo-mark.svg"
            alt="LawnLove"
            width={32}
            height={39}
            className="h-[39px] w-8"
          />
          <span className="text-lawn-text-primary text-[22px] font-semibold tracking-[-0.88px]">
            LawnLove
          </span>
        </Link>
        <h1 className="text-lawn-text-primary text-center text-2xl leading-8 font-semibold tracking-[-0.24px]">
          {title}
        </h1>
      </div>
      <div className="flex w-full max-w-[400px] flex-col items-center gap-4">
        {children}
      </div>
      {footer && (
        <p className="text-lawn-text-primary max-w-[392px] text-center text-xs leading-4">
          {footer}
        </p>
      )}
    </div>
  );
}
