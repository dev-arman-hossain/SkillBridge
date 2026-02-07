"use client";

import { useCurrentUser, useTutorReviews } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

export default function TutorReviewsPage() {
  const { data: session } = authClient.useSession();
  const { user, loading: userLoading } = useCurrentUser();
  const tutorProfileId = user?.tutorProfile?.id || null;
  const { reviews, loading: reviewsLoading, error } = useTutorReviews(tutorProfileId);

  if (userLoading || !session) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!user?.tutorProfile) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile required</h2>
          <p className="text-gray-600 mb-4">Create a tutor profile to see reviews.</p>
          <Link href="/tutor-dashboard/profile">
            <Button className="bg-teal-600 hover:bg-teal-700">Create profile</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <Link
        href="/tutor-dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-1">What students say about your sessions</p>
      </div>

      {reviewsLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      ) : reviews.length === 0 ? (
        <Card className="p-8 text-center">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No reviews yet. Complete sessions to get feedback.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                  <span className="text-teal-600 font-semibold">
                    {review.student?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900">
                      {review.student?.name || "Student"}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <Star className="w-4 h-4 fill-amber-500" />
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {review.reviewDate
                      ? new Date(review.reviewDate).toLocaleDateString()
                      : ""}
                  </p>
                  {review.comment && (
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
