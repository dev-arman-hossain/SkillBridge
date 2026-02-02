"use client";

import { useUserBookings, useTutorReviews, useCurrentUser } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, User, BookOpen, Star, Users, TrendingUp } from "lucide-react";
import { useMemo } from "react";

export default function TeacherDashboard() {
  const { data: session } = authClient.useSession();
  const { user, loading: userLoading } = useCurrentUser();
  const { bookings, loading, error } = useUserBookings(session?.user?.id || null);
  const tutorProfileId = user?.tutorProfile?.id || null;
  const { reviews, loading: reviewsLoading } = useTutorReviews(tutorProfileId);

 
  const tutorBookings = useMemo(() => {
    if (!user?.tutorProfile?.id) return [];
    return bookings.filter((b) => b.tutorId === user.tutorProfile?.id);
  }, [bookings, user?.tutorProfile?.id]);

  const upcomingBookings = useMemo(() => {
    return tutorBookings.filter(
      (b) => b.status === "PENDING" && new Date(b.sessionDate) > new Date()
    );
  }, [tutorBookings]);

  const completedBookings = useMemo(() => {
    return tutorBookings.filter((b) => b.status === "COMPLETED");
  }, [tutorBookings]);

  const uniqueStudents = useMemo(() => {
    const studentIds = new Set(tutorBookings.map((b) => b.studentId));
    return studentIds.size;
  }, [tutorBookings]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + parseFloat(r.rating), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  if (loading || userLoading || reviewsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600">Error loading dashboard: {error}</p>
        </Card>
      </div>
    );
  }

  if (!user?.tutorProfile) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Your Tutor Profile
          </h2>
          <p className="text-gray-600 mb-6">
            You need to create a tutor profile before you can start teaching.
          </p>
          <Link href="/tutor/profile">
            <Button className="bg-teal-500 hover:bg-teal-600">
              Create Profile
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
    
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">Manage your teaching sessions and track your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{tutorBookings.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-3xl font-bold text-teal-600">{upcomingBookings.length}</p>
            </div>
            <Clock className="w-12 h-12 text-teal-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedBookings.length}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-purple-600">{uniqueStudents}</p>
            </div>
            <Users className="w-12 h-12 text-purple-500" />
          </div>
        </Card>
      </div>

     
      {reviews.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Average Rating</p>
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                <span className="text-4xl font-bold text-gray-900">{averageRating}</span>
                <span className="text-gray-600">/ 5.0</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</p>
            </div>
            <div className="text-right">
              <Link href="/tutor/reviews">
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-100">
                  View All Reviews
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/tutor/availability">
          <Button variant="outline" className="w-full border-teal-500 text-teal-600 hover:bg-teal-50">
            <Calendar className="w-4 h-4 mr-2" />
            Manage Availability
          </Button>
        </Link>
        <Link href="/tutor/profile">
          <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Sessions</h2>
        </div>

        {upcomingBookings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-2">No upcoming sessions</p>
            <p className="text-sm text-gray-400">
              Students will book sessions based on your availability
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.student?.name || "Student"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {booking.student?.email || ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.sessionDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(booking.sessionDate).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {booking.sessionLink && (
                      <a
                        href={booking.sessionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full bg-teal-500 hover:bg-teal-600">
                          Start Session
                        </Button>
                      </a>
                    )}
                    <Link href={`/bookings/${booking.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

     
      {completedBookings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Completed Sessions</h2>
          <div className="space-y-4">
            {completedBookings.slice(0, 5).map((booking) => (
              <Card key={booking.id} className="p-6 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {booking.student?.name || "Student"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.sessionDate).toLocaleDateString()} at{" "}
                          {new Date(booking.sessionDate).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {booking.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
