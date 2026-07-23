import { DollarSign } from "lucide-react";

import { AgentTopbar } from "@/components/agent/agent-topbar";

// Agent (crew owner) settings — Figma node 1154:13105.
//
// Visual mockup: a "Business" preferences card with name / service-area fields
// and a save action. Wire the form to the agent settings API once exposed.
export function AgentSettings() {
  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Settings"
        subtitle="Business preferences and availability."
        showSearch={false}
        actionLabel="Request Payout"
        actionIcon={DollarSign}
      />

      <div className="overflow-y-auto p-6 lg:p-8">
        <section className="max-w-3xl rounded-xl border border-[#e5e5e5] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
          <h2 className="text-lawn-text-primary text-lg font-semibold tracking-tight">
            Business
          </h2>

          <div className="mt-5 flex flex-col gap-4">
            <Field
              label="Business Name"
              name="businessName"
              placeholder="Business Name"
            />
            <Field label="Service Area" name="serviceArea" placeholder="Service Area" />
          </div>

          <button
            type="button"
            className="bg-lawn-primary mt-5 rounded-[10px] px-5 py-2.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Save changes
          </button>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className="placeholder:text-lawn-text-tertiary text-lawn-text-primary focus:border-lawn-primary-light w-full rounded-[10px] border border-[#cecece] px-4 py-3 text-base tracking-tight transition-colors outline-none"
      />
    </label>
  );
}
