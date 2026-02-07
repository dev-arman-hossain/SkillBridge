"use client";

import { useBooking, useUpdateBookingStatus, useUserBookings } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { toast } from "sonner";

export default function TutorBookingDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data: session } = authClient.useSession();
  const { booking, loading, error, refetch } = useBooking(id || null);
  const { updateStatus, loading: updating } = useUpdateBookingStatus();
  const { refetch: refetchBookings } = useUserBookings(session?.user?.id || null);

  const handleStatusChange = async (status: "PENDING" | "COMPLETED" | "CANCELLED") => {
    if (!id) return;
    try {
      await updateStatus(id, status);
      toast.success("Booking updated");
      refetch();
      refetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    }
  };

  if (!id) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <p className="text-gray-600">Invalid booking ID.</p>
          <Link href="/tutor-dashboard">
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
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8">
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600">{error || "Booking not found"}</p>
          <Link href="/tutor-dashboard">
            <Button variant="outline" className="mt-4">
              Back to Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isTutorBooking =
    session?.user?.id &&
    (booking.tutor?.userId === session.user.id || booking.tutorId === booking.tutor?.id);

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
        <h1 className="text-3xl font-bold text-gray-900">Booking details</h1>
        <p className="text-gray-600 mt-1">Session with student</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
            <User className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {booking.student?.name || "Student"}
            </h2>
            <p className="text-sm text-gray-500">{booking.student?.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(booking.sessionDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {new Date(booking.sessionDate).toLocaleTimeString()}
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              booking.status === "COMPLETED"
                ? "bg-green-100 text-green-800"
                : booking.status === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {booking.status}
          </span>
        </div>

        {booking.sessionLink && (
          <a
            href={booking.sessionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="bg-teal-600 hover:bg-teal-700">
              Join session
            </Button>
          </a>
        )}

        {isTutorBooking && booking.status === "PENDING" && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button
              onClick={() => handleStatusChange("COMPLETED")}
              disabled={updating}
              className="bg-green-600 hover:bg-green-700"
            >
              Mark completed
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusChange("CANCELLED")}
              disabled={updating}
              className="text-red-600 hover:bg-red-50"
            >
              Cancel booking
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
