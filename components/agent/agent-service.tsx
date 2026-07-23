"use client";

import { useState } from "react";
import { Pencil, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";

import { AgentTopbar } from "@/components/agent/agent-topbar";
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
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "@/hooks/use-services";
import type { Service } from "@/lib/api/services";
import { ApiError } from "@/lib/api/http";
import { formatCents } from "@/lib/jobs";

// Agent (crew owner) service catalog — live CRUD against /agent/services.
export function AgentService() {
  const { data: services, isLoading, isError } = useServices();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (service: Service) => {
    setEditing(service);
    setDialogOpen(true);
  };

  return (
    <div className="bg-lawn-bg-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl shadow-[0px_0px_12px_2px_rgba(116,116,116,0.1)]">
      <AgentTopbar
        title="Services"
        subtitle="The services you offer and their pricing."
        showSearch={false}
        actionLabel="New service"
        onAction={openCreate}
      />

      <div className="overflow-y-auto p-6 lg:p-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-lawn-text-secondary py-10 text-center">
            Couldn&apos;t load your services.
          </p>
        )}

        {services && services.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Wrench className="text-lawn-text-tertiary size-10" strokeWidth={1.5} />
            <p className="text-lawn-text-primary text-lg font-semibold">
              No services yet
            </p>
            <p className="text-lawn-text-secondary max-w-sm">
              Add the services your crew offers so customers know what you provide.
            </p>
            <Button className="mt-2" onClick={openCreate}>
              New service
            </Button>
          </div>
        )}

        {services && services.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => openEdit(service)}
              />
            ))}
          </div>
        )}
      </div>

      <ServiceDialog open={dialogOpen} onOpenChange={setDialogOpen} service={editing} />
    </div>
  );
}

function ServiceCard({ service, onEdit }: { service: Service; onEdit: () => void }) {
  const deleteService = useDeleteService();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${service.name}"?`)) return;
    try {
      await deleteService.mutateAsync(service.id);
      toast.success("Service deleted.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't delete that service.",
      );
    }
  };

  return (
    <div
      className={`bg-lawn-bg-2 flex flex-col gap-5 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] ${
        service.active ? "" : "opacity-60"
      }`}
    >
      <div className="flex flex-col gap-4 border-b border-[#e5e5e5] pb-5">
        <span className="bg-lawn-badge-bg flex size-14 items-center justify-center rounded-xl">
          <Wrench className="text-lawn-primary size-6" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-lawn-text-primary flex items-center gap-2 text-2xl font-semibold tracking-tight">
            {service.name}
            {!service.active && (
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600">
                Inactive
              </span>
            )}
          </p>
          {service.description && (
            <p className="text-lawn-text-tertiary text-base tracking-tight">
              {service.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="tracking-tight">
          <span className="text-lawn-text-primary text-xl font-semibold">
            {formatCents(service.price)}
          </span>
          <span className="text-lawn-text-tertiary text-base font-medium">
            {" "}
            {service.unit}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="size-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteService.isPending}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ServiceDialog({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}) {
  const isEdit = !!service;
  const createService = useCreateService();
  const updateService = useUpdateService();
  const pending = createService.isPending || updateService.isPending;

  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [price, setPrice] = useState(service ? String(service.price / 100) : "");
  const [unit, setUnit] = useState(service?.unit ?? "per visit");
  const [active, setActive] = useState(service?.active ?? true);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    const dollars = Number(price);
    if (!Number.isFinite(dollars) || dollars < 0) {
      setError("Enter a valid price.");
      return;
    }
    const body = {
      name: trimmedName,
      description: description.trim() || undefined,
      price: Math.round(dollars * 100),
      unit: unit.trim() || undefined,
      active,
    };

    try {
      if (isEdit && service) {
        await updateService.mutateAsync({ id: service.id, body });
        toast.success("Service updated.");
      } else {
        await createService.mutateAsync(body);
        toast.success("Service added.");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't save that service.");
    }
  };

  return (
    <Dialog key={service?.id ?? "new"} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit service" : "New service"}</DialogTitle>
          <DialogDescription>Shown in your public services catalog.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-lawn-text-primary text-sm font-medium">Name</span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lawn Mowing"
              autoFocus
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-lawn-text-primary text-sm font-medium">
              Description (optional)
            </span>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Weekly cut, edge and blow."
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5">
              <span className="text-lawn-text-primary text-sm font-medium">
                Price ($)
              </span>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="68"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-lawn-text-primary text-sm font-medium">Unit</span>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="per visit"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} />
            <span className="text-lawn-text-primary">Active (shown to customers)</span>
          </label>

          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Save changes" : "Add service"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
