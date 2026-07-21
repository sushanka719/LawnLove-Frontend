"use client";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useScheduleAccountDeletion } from "@/hooks/use-account";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  graceDays: number;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
  graceDays,
}: DeleteAccountDialogProps) {
  const schedule = useScheduleAccountDeletion();

  const onConfirm = () => {
    if (schedule.isPending) return;
    schedule.mutate(undefined, {
      onSuccess: () => {
        toast.success(
          `Account scheduled for deletion in ${graceDays} days. You can cancel any time before then.`,
        );
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-lawn-bg-2 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lawn-text-primary text-xl font-bold tracking-tight">
            Delete account?
          </DialogTitle>
          <DialogDescription className="text-lawn-text-secondary text-base">
            Your account will be scheduled for permanent deletion in {graceDays}{" "}
            days. Until then nothing is lost — you can keep using Lawn Love and
            cancel the deletion at any time from this page. After {graceDays}{" "}
            days your account and its data are removed for good.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={schedule.isPending}
            className="bg-destructive w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {schedule.isPending ? "Scheduling..." : "Schedule deletion"}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={schedule.isPending}
            className="text-lawn-text-secondary hover:text-lawn-text-primary w-full rounded-xl px-8 py-3 text-base font-semibold tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep my account
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
