import { Droplet, LeafyGreen, Scissors, type LucideIcon } from "lucide-react";

import { AgentTopbar } from "@/components/agent/agent-topbar";

// Agent (crew owner) services list — Figma node 1136:11957.
//
// Visual mockup wired to static data: the services the crew offers, their
// per-square pricing, and how many times each has been booked. Wire to the
// pricing/services API once exposed.

type Service = {
  name: string;
  description: string;
  price: string;
  unit: string;
  booked: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const SERVICES: Service[] = [
  {
    name: "Lawn Mowing",
    description: "Weekly or biweekly cut, edge and blow.",
    price: "$68",
    unit: "/per sq",
    booked: "142 booked",
    icon: LeafyGreen,
    iconBg: "bg-[#ffedd5]",
    iconColor: "text-[#ea580c]",
  },
  {
    name: "Fertilization",
    description: "Seasonal nutrient treatment program.",
    price: "$89",
    unit: "/per sq",
    booked: "56 booked",
    icon: Droplet,
    iconBg: "bg-[#dbeafe]",
    iconColor: "text-[#1d4ed8]",
  },
  {
    name: "Hedge Trimming",
    description: "Shrub and hedge shaping",
    price: "$56",
    unit: "/per sq",
    booked: "64 booked",
    icon: Scissors,
    iconBg: "bg-[#dcfce7]",
    iconColor: "text-[#16a34a]",
  },
];

export function AgentService() {
  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Services"
        subtitle="The services you offer and their pricing."
        showSearch={false}
        actionLabel="New service"
      />

      <div className="overflow-y-auto p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <div className="bg-lawn-bg-2 flex flex-col gap-5 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)]">
      <div className="flex flex-col gap-5 border-b border-[#e5e5e5] pb-5">
        <span
          className={`flex size-14 items-center justify-center rounded-xl ${service.iconBg}`}
        >
          <Icon className={`size-6 ${service.iconColor}`} strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-lawn-text-primary text-2xl font-semibold tracking-tight">
            {service.name}
          </p>
          <p className="text-lawn-text-tertiary text-base tracking-tight">
            {service.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <p className="flex-1 tracking-tight">
          <span className="text-lawn-text-primary text-xl font-semibold">
            {service.price}
          </span>
          <span className="text-lawn-text-tertiary text-base font-medium">
            {service.unit}
          </span>
        </p>
        <p className="text-lawn-text-tertiary text-base tracking-tight whitespace-nowrap">
          {service.booked}
        </p>
      </div>
    </div>
  );
}
