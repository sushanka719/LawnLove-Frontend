import Image from "next/image";
import Link from "next/link";

import { LawnButton } from "@/components/landing/lawn-button";

const MENU_ITEMS = [
  { label: "Home", href: "#", active: true },
  { label: "Services", href: "#services" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Why us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  return (
    <header className="bg-lawn-bg-2 sticky top-0 z-50 flex items-center justify-between px-[240px] py-6 shadow-[4px_0px_16px_0px_rgba(119,119,119,0.25)]">
      <Link href="/" className="flex shrink-0 items-center gap-2">
        <Image src="/landing/logo-mark.svg" alt="" width={32} height={39} />
        <span className="text-lawn-text-primary font-heading text-[22px] font-semibold tracking-tight">
          LawnLove
        </span>
      </Link>

      <nav className="flex shrink-0 items-center justify-center gap-14">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={
              item.active
                ? "text-lawn-primary border-lawn-primary flex items-center justify-center border-b pb-0.5 text-base font-semibold tracking-tight"
                : "flex items-center justify-center pb-0.5 text-base font-semibold tracking-tight text-[#4d4d4d]"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-4">
        <LawnButton href="#quote" variant="outline">
          Get a Quote
        </LawnButton>
        <LawnButton href="#login">Log in / Sign up</LawnButton>
      </div>
    </header>
  );
}
