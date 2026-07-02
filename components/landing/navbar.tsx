"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { LawnButton } from "@/components/landing/lawn-button";

const MENU_ITEMS = [
  { label: "Home", href: "#", active: true },
  { label: "Services", href: "#services" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Why us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-lawn-bg-2 sticky top-0 z-50 shadow-[4px_0px_16px_0px_rgba(119,119,119,0.25)]">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10 lg:py-5 xl:px-16 xl:py-6 2xl:px-[240px]">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/landing/logo-mark.svg" alt="" width={32} height={39} />
          <span className="text-lawn-text-primary font-heading text-[22px] font-semibold tracking-tight">
            LawnLove
          </span>
        </Link>

        <nav className="hidden min-w-0 shrink items-center justify-center gap-4 xl:flex xl:gap-8 2xl:gap-14">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.active
                  ? "text-lawn-primary border-lawn-primary flex items-center justify-center border-b pb-0.5 text-sm font-semibold tracking-tight whitespace-nowrap 2xl:text-base"
                  : "flex items-center justify-center pb-0.5 text-sm font-semibold tracking-tight whitespace-nowrap text-[#4d4d4d] 2xl:text-base"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex xl:gap-4">
          <LawnButton
            href="#quote"
            variant="outline"
            className="px-4 py-2.5 text-sm 2xl:px-8 2xl:py-3 2xl:text-base"
          >
            Get a Quote
          </LawnButton>
          <LawnButton
            href="#login"
            className="px-4 py-2.5 text-sm 2xl:px-8 2xl:py-3 2xl:text-base"
          >
            Log in / Sign up
          </LawnButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="text-lawn-primary flex items-center justify-center rounded-lg p-2 xl:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open ? (
        <div className="bg-lawn-bg-2 flex flex-col gap-6 border-t border-black/5 px-4 py-6 sm:px-6 xl:hidden">
          <nav className="flex flex-col items-start gap-4">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  item.active
                    ? "text-lawn-primary text-base font-semibold tracking-tight"
                    : "text-base font-semibold tracking-tight text-[#4d4d4d]"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-stretch gap-3">
            <LawnButton href="#quote" variant="outline" className="w-full">
              Get a Quote
            </LawnButton>
            <LawnButton href="#login" className="w-full">
              Log in / Sign up
            </LawnButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
