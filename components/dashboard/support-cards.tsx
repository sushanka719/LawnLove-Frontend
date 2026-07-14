import { Mail, Phone, type LucideIcon } from "lucide-react";

type SupportChannel = {
  icon: LucideIcon;
  title: string;
  value: string;
};

const CHANNELS: SupportChannel[] = [
  { icon: Mail, title: "Email us", value: "help@lawnlove.com" },
  { icon: Phone, title: "Contact us", value: "123 12568 2365" },
];

export function SupportCards() {
  return (
    <div className="grid max-w-[840px] grid-cols-1 gap-6 sm:grid-cols-2">
      {CHANNELS.map(({ icon: Icon, title, value }) => (
        <div
          key={title}
          className="bg-lawn-bg-2 flex flex-col gap-4 rounded-xl p-8 shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]"
        >
          <div className="bg-lawn-badge-bg flex size-12 items-center justify-center rounded-[10px]">
            <Icon className="text-lawn-primary size-5" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lawn-text-primary text-xl font-bold tracking-tight">
              {title}
            </p>
            <p className="text-lawn-text-secondary text-base">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
