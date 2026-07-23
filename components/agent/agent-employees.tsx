"use client";

import { useState } from "react";
import { Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { AgentTopbar, InitialsAvatar } from "@/components/agent/agent-topbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateEmployee,
  useDeleteEmployee,
  useEmployees,
  useUpdateEmployee,
} from "@/hooks/use-employees";
import type { Employee } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/http";

// Deterministic avatar color from the name so a crew member keeps the same hue.
const AVATAR_COLORS = ["#195134", "#35ab6e", "#2563eb", "#b45309", "#7c3aed", "#be123c"];
function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// Agent (crew owner) employees list — live CRUD against /agent/employees.
// dailyCap + active feed the scheduler: an inactive crew member (or one at cap)
// is skipped when visits are assigned.
export function AgentEmployees() {
  const { data: employees, isLoading, isError } = useEmployees();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (employee: Employee) => {
    setEditing(employee);
    setDialogOpen(true);
  };

  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Employees"
        subtitle="Manage your field crew and their daily capacity."
        showSearch={false}
        actionLabel="Add employee"
        onAction={openCreate}
      />

      <div className="overflow-y-auto p-6 lg:p-8">
        <p className="text-lawn-text-secondary mb-4 text-base tracking-tight">
          Each crew member&apos;s <span className="font-semibold">daily cap</span> and{" "}
          <span className="font-semibold">active</span> status directly control scheduling
          — visits are assigned to the least-loaded active crew member with capacity that
          day.
        </p>

        <div className="bg-lawn-bg-2 overflow-hidden rounded-xl shadow-[0px_4px_16px_0px_rgba(74,74,74,0.14)]">
          {isLoading && (
            <div className="space-y-4 p-6">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-lawn-text-secondary px-6 py-10 text-center">
              Couldn&apos;t load your crew. Please try again.
            </p>
          )}

          {employees && employees.length === 0 && (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <Users className="text-lawn-text-tertiary size-10" strokeWidth={1.5} />
              <p className="text-lawn-text-primary text-lg font-semibold">No crew yet</p>
              <p className="text-lawn-text-secondary max-w-sm">
                Add your first employee so the scheduler has someone to assign visits to.
              </p>
              <Button className="mt-2" onClick={openCreate}>
                Add employee
              </Button>
            </div>
          )}

          {employees?.map((employee, i) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              last={i === employees.length - 1}
              onEdit={() => openEdit(employee)}
            />
          ))}
        </div>
      </div>

      <EmployeeDialog open={dialogOpen} onOpenChange={setDialogOpen} employee={editing} />
    </div>
  );
}

function EmployeeRow({
  employee,
  last,
  onEdit,
}: {
  employee: Employee;
  last: boolean;
  onEdit: () => void;
}) {
  const deleteEmployee = useDeleteEmployee();

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Remove ${employee.name}? Their upcoming visits will be released and reassigned.`,
      )
    ) {
      return;
    }
    try {
      await deleteEmployee.mutateAsync(employee.id);
      toast.success(`${employee.name} removed.`);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't remove that employee.",
      );
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 px-6 py-5 ${
        last ? "" : "border-b border-[#cecece]/40"
      } ${employee.active ? "" : "opacity-60"}`}
    >
      <div className="flex min-w-0 items-center gap-4">
        <InitialsAvatar
          name={employee.name}
          color={avatarColor(employee.name)}
          className="size-14 text-[24.5px]"
        />
        <div className="min-w-0">
          <p className="text-lawn-text-primary flex items-center gap-2 text-lg font-semibold tracking-tight">
            {employee.name}
            {!employee.active && (
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600">
                Inactive
              </span>
            )}
          </p>
          <p className="text-lawn-text-secondary text-base tracking-tight">
            <span className="text-lawn-text-primary font-bold">{employee.dailyCap}</span>{" "}
            /day cap ·{" "}
            <span className="text-lawn-text-primary font-bold">{employee.jobsCount}</span>{" "}
            total visits
            {employee.phone ? ` · ${employee.phone}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="size-4" /> Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteEmployee.isPending}
        >
          <Trash2 className="size-4" /> Remove
        </Button>
      </div>
    </div>
  );
}

function EmployeeDialog({
  open,
  onOpenChange,
  employee,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}) {
  const isEdit = !!employee;
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const pending = createEmployee.isPending || updateEmployee.isPending;

  // Keyed remount (see parent) resets these when switching create/edit target.
  const [name, setName] = useState(employee?.name ?? "");
  const [phone, setPhone] = useState(employee?.phone ?? "");
  const [email, setEmail] = useState(employee?.email ?? "");
  const [dailyCap, setDailyCap] = useState(String(employee?.dailyCap ?? 5));
  const [active, setActive] = useState(employee?.active ?? true);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    const cap = Number(dailyCap);
    if (!Number.isInteger(cap) || cap < 1 || cap > 50) {
      setError("Daily cap must be a whole number between 1 and 50.");
      return;
    }

    const body = {
      name: trimmedName,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      dailyCap: cap,
      active,
    };

    try {
      if (isEdit && employee) {
        await updateEmployee.mutateAsync({ id: employee.id, body });
        toast.success("Employee updated.");
      } else {
        await createEmployee.mutateAsync(body);
        toast.success("Employee added.");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't save that employee.");
    }
  };

  return (
    <Dialog
      // Remount the body on target change so the fields re-seed from the row.
      key={employee?.id ?? "new"}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit employee" : "Add employee"}</DialogTitle>
          <DialogDescription>
            Daily cap and active status feed the scheduler.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <Field label="Name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              autoFocus
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone (optional)">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="555-123-4567"
              />
            </Field>
            <Field label="Daily cap">
              <Input
                type="number"
                min={1}
                max={50}
                value={dailyCap}
                onChange={(e) => setDailyCap(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Email (optional)">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} />
            <span className="text-lawn-text-primary">
              Active (available for scheduling)
            </span>
          </label>

          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Save changes" : "Add employee"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-lawn-text-primary text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
