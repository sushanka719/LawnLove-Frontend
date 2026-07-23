import {
  EMPLOYEES,
  SERVICE_TAG_STYLES,
  type Employee,
  type ServiceTag,
} from "@/components/agent/agent-mock";
import { AgentTopbar, InitialsAvatar } from "@/components/agent/agent-topbar";

// Agent (crew owner) employees list — Figma node 1136:11527.
//
// Visual mockup wired to static data (see `agent-mock.ts`): the agent backend
// does not yet expose crew members. One row per crew member with their weekly
// job count and service specialties.
export function AgentEmployees() {
  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Employees"
        subtitle="Manage your field crew and their assignments."
      />

      <div className="overflow-y-auto p-6 lg:p-8">
        <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
          {EMPLOYEES.map((employee, i) => (
            <EmployeeRow key={i} employee={employee} last={i === EMPLOYEES.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmployeeRow({ employee, last }: { employee: Employee; last: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 px-6 py-5 ${
        last ? "" : "border-b border-[#cecece]/40"
      }`}
    >
      <div className="flex min-w-0 items-center gap-4">
        <InitialsAvatar
          name={employee.name}
          color={employee.color}
          className="size-14 text-[24.5px]"
        />
        <div className="min-w-0">
          <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
            {employee.name}
          </p>
          <p className="text-lawn-text-secondary text-base tracking-tight">
            <span className="text-lawn-text-primary font-bold">
              {employee.jobsThisWeek}
            </span>{" "}
            jobs this week
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {employee.services.map((service) => (
          <ServiceTagPill key={service} service={service} />
        ))}
      </div>
    </div>
  );
}

function ServiceTagPill({ service }: { service: ServiceTag }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-base font-medium tracking-tight whitespace-nowrap ${SERVICE_TAG_STYLES[service]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {service}
    </span>
  );
}
