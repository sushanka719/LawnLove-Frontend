import Image from "next/image";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-900">
      <Image src="/images/lawnman.png" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 w-full max-w-[380px] px-4">
        <div className="rounded-2xl bg-[#FBFAF7] p-8 shadow-xl">{children}</div>
      </div>
    </div>
  );
}
