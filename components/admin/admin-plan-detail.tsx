"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminPlanForm } from "@/components/admin/admin-plan-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPlan, useDeletePlan } from "@/hooks/use-plans";
import { ApiError } from "@/lib/api/http";

export function AdminPlanDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: plan, isLoading, isError } = useAdminPlan(params.id);
  const deletePlan = useDeletePlan();
  const [confirming, setConfirming] = useState(false);

  if (isError) {
    return (
      <p className="text-destructive text-base">
        We couldn&apos;t load this plan. It may have been deleted.
      </p>
    );
  }

  if (isLoading || !plan) {
    return (
      <div className="flex max-w-[820px] flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const onDelete = () => {
    deletePlan.mutate(plan.id, {
      onSuccess: () => {
        toast.success("Plan deleted.");
        router.push("/admin/plans");
      },
      onError: (e) =>
        toast.error(
          e instanceof ApiError ? e.message : "Couldn't delete the plan.",
        ),
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <AdminPlanForm plan={plan} />

      <div className="max-w-[820px] border-t border-[#cecece]/40 pt-6">
        <p className="text-lawn-primary text-lg font-semibold">Danger zone</p>
        <p className="text-lawn-text-tertiary mb-3 text-sm">
          Permanently delete this plan. This cannot be undone.
        </p>
        {confirming ? (
          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              size="lg"
              disabled={deletePlan.isPending}
              onClick={onDelete}
            >
              {deletePlan.isPending ? "Deleting…" : "Confirm delete"}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="destructive"
            size="lg"
            onClick={() => setConfirming(true)}
          >
            Delete plan
          </Button>
        )}
      </div>
    </div>
  );
}
