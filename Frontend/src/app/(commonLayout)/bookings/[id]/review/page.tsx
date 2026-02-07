"use client";

import { useBooking, useCreateReview } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BookingReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const { data: session } = authClient.useSession();
  const { booking, loading, error } = useBooking(id || null);
  const { createReview, loading: submitting } = useCreateReview();

  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !booking || !session?.user?.id) return;
    if (booking.studentId !== session.user.id) {
      toast.error("Only the student who attended can leave a review.");
      return;
    }
    if (booking.status !== "COMPLETED") {
      toast.error("You can only review completed sessions.");
      return;
    }
    try {
      await createReview({
        bookingId: id,
        studentId: session.user.id,
        tutorId: booking.tutorId,
        rating,
        comment: comment || undefined,
      });
      toast.success("Review submitted!");
      router.push("/student-dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    }
  };

  if (!id) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="p-6">
          <p className="text-gray-600">Invalid booking ID.</p>
          <Link href="/student-dashboard">
            <Button variant="outline" className="mt-4">
              Back to Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600">{error || "Booking not found"}</p>
          <Link href="/student-dashboard">
            <Button variant="outline" className="mt-4">
              Back to Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const canReview =
    session?.user?.id === booking.studentId && booking.status === "COMPLETED";

  if (!canReview) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="p-6">
          <p className="text-gray-600">
            You can only leave a review for a completed session you attended.
          </p>
          <Link href={`/bookings/${id}`}>
            <Button variant="outline" className="mt-4">
              Back to booking
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Link
        href={`/bookings/${id}`}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to booking
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leave a review</h1>
        <p className="text-gray-600 mt-1">
          How was your session with {booking.tutor?.user?.name || "your tutor"}?
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Rating</Label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {["5", "4", "3", "2", "1"].map((r) => (
                <option key={r} value={r}>
                  {r} star{r === "1" ? "" : "s"}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Share your experience..."
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="bg-teal-600 hover:bg-teal-700">
              {submitting ? "Submitting..." : "Submit review"}
            </Button>
            <Link href={`/bookings/${id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
