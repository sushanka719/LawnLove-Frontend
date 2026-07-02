import Image from "next/image";
import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Services",
    links: ["Lawn Mowing", "Yard Cleanup", "Landscaping", "Seasonal Services"],
  },
  {
    title: "Company",
    links: ["About us", "Reviews", "Pro"],
  },
  {
    title: "Support",
    links: ["How it works", "Contact", "Help center"],
  },
];

const SOCIAL_LINKS = [
  { name: "GitHub", icon: "/landing/social-github.svg", href: "#" },
  { name: "Reddit", icon: "/landing/social-reddit.svg", href: "#" },
  { name: "Twitter", icon: "/landing/social-twitter.svg", href: "#" },
  { name: "LinkedIn", icon: "/landing/social-linkedin.svg", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-lawn-bg-1 relative overflow-hidden pt-12 sm:pt-16">
      <div className="flex flex-col items-start gap-10 px-4 sm:px-6 md:flex-row md:gap-16 lg:gap-60 lg:px-[240px]">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image src="/landing/logo-mark.svg" alt="" width={52} height={63} />
          <span className="text-lawn-text-primary font-heading text-[28px] font-semibold tracking-tight sm:text-[35px]">
            LawnLove
          </span>
        </Link>

        <div className="grid w-full grid-cols-2 items-start gap-8 sm:flex sm:flex-1 sm:justify-between">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col items-start gap-2.5">
              <h3 className="text-lawn-primary text-lg leading-7 font-semibold tracking-tight">
                {column.title}
              </h3>
              {column.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-lawn-text-primary text-base leading-6 tracking-tight"
                >
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p
        aria-hidden
        className="text-lawn-bg-1 pointer-events-none mt-8 bg-gradient-to-b from-[#fdf7e2] to-[#d9deba] bg-clip-text text-center text-[18vw] leading-none font-semibold tracking-tighter text-transparent select-none sm:mt-11 lg:text-[240px]"
      >
        LawnLove
      </p>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-black/10 px-4 py-6 sm:flex-row sm:px-6 lg:px-[240px]">
        <p className="text-lawn-text-primary text-base leading-6 tracking-tight">
          © 2024 Lucidtech AS
        </p>
        <div className="flex items-center gap-6">
          {SOCIAL_LINKS.map((social) => (
            <Link key={social.name} href={social.href} aria-label={social.name}>
              <Image src={social.icon} alt="" width={30} height={30} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
