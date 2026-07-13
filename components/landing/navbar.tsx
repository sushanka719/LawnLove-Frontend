"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";

import { LawnButton } from "@/components/landing/lawn-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useSession, useSignOut } from "@/hooks/use-session";

const MENU_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Why us", href: "#why-us" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
];

function getInitials(name?: string, email?: string) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }
  return email?.[0]?.toUpperCase() ?? "?";
}

function ProfileMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  const signOut = useSignOut();
  const user = session?.user;

  if (!user) return null;

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => router.push("/"),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none">
        <Avatar>
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{getInitials(user.name, user.email)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const isLoggedIn = !isPending && !!session?.user;
  const [activeHref, setActiveHref] = useState("#home");
  const isClickScrolling = useRef(false);
  const clickScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      isClickScrolling.current = true;
      setActiveHref(href);
      element.scrollIntoView({ behavior: "smooth" });

      if (clickScrollTimeout.current) clearTimeout(clickScrollTimeout.current);
      clickScrollTimeout.current = setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    const sectionIds = MENU_ITEMS.map((item) => item.href.replace("#", ""));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const closest = visible.reduce((best, entry) => {
            const bestDist = Math.abs(best.boundingClientRect.top);
            const entryDist = Math.abs(entry.boundingClientRect.top);
            return entryDist < bestDist ? entry : best;
          });
          setActiveHref(`#${closest.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      if (clickScrollTimeout.current) {
        clearTimeout(clickScrollTimeout.current);
      }
    };
  }, []);

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
              onClick={(e) => handleScroll(e, item.href)}
              className={
                activeHref === item.href
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
            href="/booking/address"
            variant="outline"
            className="px-4 py-2.5 text-sm 2xl:px-8 2xl:py-3 2xl:text-base"
          >
            Get a Quote
          </LawnButton>
          {isLoggedIn ? (
            <ProfileMenu />
          ) : (
            <LawnButton
              href="/login"
              className="px-4 py-2.5 text-sm 2xl:px-8 2xl:py-3 2xl:text-base"
            >
              Log in / Sign up
            </LawnButton>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="text-lawn-primary flex items-center justify-center rounded-lg p-2 xl:hidden"
          >
            <Menu className="size-6" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="bg-lawn-bg-2 flex w-[300px] flex-col gap-6 border-1 border-black/5 px-6 py-6 sm:w-[340px] sm:px-6"
          >
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex shrink-0 items-center gap-2"
            >
              <Image src="/landing/logo-mark.svg" alt="" width={32} height={39} />
              <span className="text-lawn-text-primary font-heading text-[22px] font-semibold tracking-tight">
                LawnLove
              </span>
            </Link>

            <nav className="flex flex-col items-start gap-4">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    handleScroll(e, item.href);
                    setOpen(false);
                  }}
                  className={
                    activeHref === item.href
                      ? "text-lawn-primary text-base font-semibold tracking-tight"
                      : "text-base font-semibold tracking-tight text-[#4d4d4d]"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col items-stretch gap-3">
              <LawnButton href="/booking/address" variant="outline" className="w-full">
                Get a Quote
              </LawnButton>
              {isLoggedIn ? (
                <div className="flex items-center justify-center">
                  <ProfileMenu />
                </div>
              ) : (
                <LawnButton href="/login" className="w-full">
                  Log in / Sign up
                </LawnButton>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
