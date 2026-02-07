"use client";

import { useUserBookings } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, User, Video, BookOpen, Sparkles } from "lucide-react";

export default function StudentDashboard() {
  const { data: session } = authClient.useSession();
  const { bookings, loading, error } = useUserBookings(
    session?.user?.id || null,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-8 p-6 md:p-8">
          <div className="h-10 bg-muted rounded-xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-muted rounded-2xl" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 border-border bg-card text-center">
          <p className="text-destructive font-medium mb-2">Error loading bookings</p>
          <p className="text-muted-foreground text-sm mb-6">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </Card>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(
    (b) => b.status === "PENDING" && new Date(b.sessionDate) > new Date(),
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "COMPLETED" || new Date(b.sessionDate) <= new Date(),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-900 text-white py-10 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
        <div className="relative container mx-auto px-4 md:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white/95 mb-4">
            <Sparkles className="w-4 h-4" />
            Student Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Student"}!
          </h1>
          <p className="text-white/90 mt-2 text-lg">
            Manage your tutoring sessions and track your progress.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{bookings.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </div>
            </Card>
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{upcomingBookings.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/15">
                  <Clock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </Card>
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{pastBookings.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/15">
                  <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Upcoming */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-foreground">Upcoming Sessions</h2>
              <Link href="/tutors">
                <Button className="rounded-xl bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto">
                  Find a Tutor
                </Button>
              </Link>
            </div>

            {upcomingBookings.length === 0 ? (
              <Card className="border-border bg-card rounded-2xl shadow-sm p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">No upcoming sessions</p>
                <p className="text-muted-foreground text-sm mb-6">Book a session with a tutor to get started.</p>
                <Link href="/tutors">
                  <Button className="rounded-xl bg-primary text-primary-foreground hover:opacity-90">
                    Find a Tutor
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {booking.tutor?.user?.name || "Tutor"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.tutor?.biography || "Professional Tutor"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.sessionDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(booking.sessionDate).toLocaleTimeString()}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-medium">
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {booking.sessionLink && (
                          <a href={booking.sessionLink} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:opacity-90">
                              <Video className="w-4 h-4 mr-2" />
                              Join Session
                            </Button>
                          </a>
                        )}
                        <Link href={`/bookings/${booking.id}`}>
                          <Button variant="outline" className="w-full rounded-xl">
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

          {/* Past */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Past Sessions</h2>
              <div className="space-y-4">
                {pastBookings.slice(0, 5).map((booking) => (
                  <Card key={booking.id} className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {booking.tutor?.user?.name || "Tutor"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.sessionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === "COMPLETED"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {booking.status}
                        </span>
                        {booking.status === "COMPLETED" && (
                          <Link href={`/bookings/${booking.id}/review`}>
                            <Button size="sm" variant="outline" className="rounded-lg">
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
      </div>
    </div>
  );
}
