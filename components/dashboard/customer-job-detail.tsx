"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { toast } from "sonner";

import { RatingStars } from "@/components/jobs/rating-stars";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveJob,
  useCustomerJob,
  useDisputeJob,
  useSubmitReview,
} from "@/hooks/use-customer-jobs";
import type { JobPhoto } from "@/lib/api/customer-jobs";
import { ApiError } from "@/lib/api/http";
import { formatScheduleDate, timeUntil, TIME_SLOT_LABELS } from "@/lib/jobs";

function errorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

export function CustomerJobDetail() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const { data: job, isLoading, isError } = useCustomerJob(jobId);

  const submitReview = useSubmitReview(jobId);
  const approve = useApproveJob(jobId);
  const dispute = useDisputeJob(jobId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const onSubmitReview = async () => {
    if (rating < 1) {
      toast.error("Please select a star rating.");
      return;
    }
    try {
      await submitReview.mutateAsync({ rating, comment: comment || undefined });
      toast.success("Thanks for your feedback!");
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't submit your review."));
    }
  };

  const onApprove = async () => {
    try {
      await approve.mutateAsync();
      toast.success("Approved — the payout has been released.");
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't approve the service."));
    }
  };

  const onDispute = async () => {
    try {
      await dispute.mutateAsync();
      toast.success("We've flagged this service for review.");
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't submit your dispute."));
    }
  };

  return (
    <DashboardPanel
      title="Your Service"
      subtitle="Review the work and photos from your visit."
    >
      <Link
        href="/dashboard"
        className="text-lawn-text-secondary hover:text-lawn-primary inline-flex w-fit items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : isError || !job ? (
        <p className="text-destructive text-base">
          We couldn&apos;t load this service. Please refresh and try again.
        </p>
      ) : (
        <div className="flex max-w-[900px] flex-col gap-6">
          {/* Summary */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
                {job.booking.address}
              </h2>
              <JobStatusBadge status={job.status} />
            </div>
            <p className="text-lawn-text-secondary text-sm">
              {formatScheduleDate(job.booking.scheduleDate)} ·{" "}
              {TIME_SLOT_LABELS[job.booking.timeSlot] ?? job.booking.timeSlot}
            </p>
          </div>

          {/* Review-window banner */}
          {job.status === "in_review" && (
            <div className="flex items-center gap-2 rounded-xl border border-[#f5c469] bg-[#fef3c7] px-4 py-3">
              <Clock className="size-5 shrink-0 text-[#b45309]" />
              <p className="text-sm font-medium text-[#7c4a03]">
                {timeUntil(job.reviewDeadline)
                  ? `You have ${timeUntil(job.reviewDeadline)} to review. If you do nothing, this is approved automatically.`
                  : "This service is being approved automatically."}
              </p>
            </div>
          )}

          {/* Photos */}
          {job.photos.before.length > 0 || job.photos.after.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <PhotoGallery title="Before" photos={job.photos.before} />
              <PhotoGallery title="After" photos={job.photos.after} />
            </div>
          ) : (
            <p className="text-lawn-text-secondary rounded-xl border border-[#cecece]/60 px-5 py-8 text-center text-base">
              Photos will appear here once your lawn has been serviced.
            </p>
          )}

          {/* Approve / dispute */}
          {job.status === "in_review" && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onApprove}
                disabled={approve.isPending}
                className="lawn-gradient-btn flex-1 rounded-xl px-6 py-3 text-base font-semibold text-white disabled:opacity-50"
              >
                {approve.isPending ? "Approving..." : "Approve & release payment"}
              </button>
              <button
                type="button"
                onClick={onDispute}
                disabled={dispute.isPending}
                className="border-destructive text-destructive flex-1 rounded-xl border px-6 py-3 text-base font-semibold disabled:opacity-50"
              >
                {dispute.isPending ? "Submitting..." : "Something's wrong"}
              </button>
            </div>
          )}

          {job.status === "disputed" && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              You&apos;ve flagged this service. Our team will follow up and the payout is
              on hold.
            </p>
          )}

          {/* Rating */}
          <div className="border-t border-[#cecece]/40 pt-6">
            {job.review ? (
              <div className="flex flex-col gap-2">
                <p className="text-lawn-text-primary text-base font-semibold">
                  Your rating
                </p>
                <RatingStars value={job.review.rating} />
                {job.review.comment && (
                  <p className="text-lawn-text-secondary text-sm">
                    “{job.review.comment}”
                  </p>
                )}
              </div>
            ) : job.completedAt ? (
              <div className="flex flex-col gap-3">
                <p className="text-lawn-text-primary text-base font-semibold">
                  Rate the work
                </p>
                <RatingStars value={rating} onChange={setRating} />
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment (optional)"
                  maxLength={1000}
                  className="min-h-24"
                />
                <button
                  type="button"
                  onClick={onSubmitReview}
                  disabled={submitReview.isPending}
                  className="lawn-gradient-btn w-fit rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {submitReview.isPending ? "Submitting..." : "Submit review"}
                </button>
              </div>
            ) : (
              <p className="text-lawn-text-secondary text-sm">
                You&apos;ll be able to rate the work once your service is complete.
              </p>
            )}
          </div>
        </div>
      )}
    </DashboardPanel>
  );
}

function PhotoGallery({ title, photos }: { title: string; photos: JobPhoto[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lawn-text-primary text-base font-semibold">{title}</p>
      {photos.length === 0 ? (
        <div className="text-lawn-text-tertiary flex h-32 items-center justify-center rounded-xl border border-[#cecece]/60 text-sm">
          No {title.toLowerCase()} photos
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
            >
              <Image
                src={photo.url}
                alt={`${title} photo`}
                fill
                sizes="(max-width: 640px) 50vw, 220px"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
