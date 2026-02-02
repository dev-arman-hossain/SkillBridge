"use client";

import { useUserBookings } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, User, Video } from "lucide-react";

export default function StudentDashboard() {
  const { data: session } = authClient.useSession();
  const { bookings, loading, error } = useUserBookings(session?.user?.id || null);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600">Error loading bookings: {error}</p>
        </Card>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(
    (b) => b.status === "PENDING" && new Date(b.sessionDate) > new Date()
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "COMPLETED" || new Date(b.sessionDate) <= new Date()
  );

  return (
    <div className="p-8 space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">Manage your tutoring sessions</p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
            </div>
            <Calendar className="w-12 h-12 text-blue-500" />
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
              <p className="text-3xl font-bold text-green-600">{pastBookings.length}</p>
            </div>
            <User className="w-12 h-12 text-green-500" />
          </div>
        </Card>
      </div>

      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Sessions</h2>
          <Link href="/tutors">
            <Button variant="outline" className="border-teal-500 text-teal-600 hover:bg-teal-50">
              Book New Session
            </Button>
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No upcoming sessions</p>
            <Link href="/tutors">
              <Button className="bg-teal-500 hover:bg-teal-600">Find a Tutor</Button>
            </Link>
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
                          {booking.tutor?.user?.name || "Tutor"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {booking.tutor?.biography || "Professional Tutor"}
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
                          <Video className="w-4 h-4 mr-2" />
                          Join Session
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


      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Sessions</h2>
          <div className="space-y-4">
            {pastBookings.slice(0, 5).map((booking) => (
              <Card key={booking.id} className="p-6 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {booking.tutor?.user?.name || "Tutor"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.sessionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                    {booking.status === "COMPLETED" && (
                      <Link href={`/bookings/${booking.id}/review`}>
                        <Button size="sm" variant="outline">
                          Leave Review
                        </Button>
                      </Link>
                    )}
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
