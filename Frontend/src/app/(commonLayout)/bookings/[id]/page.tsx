"use client";

import { useBooking } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Video } from "lucide-react";

export default function BookingDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data: session } = authClient.useSession();
  const { booking, loading, error } = useBooking(id || null);

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

  const isStudent = session?.user?.id === booking.studentId;
  const isTutor = session?.user?.id === booking.tutor?.userId;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Link
        href={isTutor ? "/tutor-dashboard" : "/student-dashboard"}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking details</h1>
        <p className="text-gray-600 mt-1">
          {isStudent
            ? "Your session with the tutor"
            : isTutor
              ? "Session with student"
              : "Booking information"}
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
            <User className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {isStudent
                ? booking.tutor?.user?.name || "Tutor"
                : booking.student?.name || "Student"}
            </h2>
            <p className="text-sm text-gray-500">
              {isStudent
                ? booking.tutor?.user?.email
                : booking.student?.email}
            </p>
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

        {booking.sessionLink && booking.status === "PENDING" && (
          <a
            href={booking.sessionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Video className="w-4 h-4 mr-2" />
              Join session
            </Button>
          </a>
        )}

        {isStudent && booking.status === "COMPLETED" && (
          <Link href={`/bookings/${booking.id}/review`}>
            <Button variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50">
              Leave a review
            </Button>
          </Link>
        )}
      </Card>
    </div>
  );
}
