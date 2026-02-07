"use client";

import { useUserBookings, useTutorReviews, useCurrentUser } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, User, BookOpen, Star, Users, TrendingUp, Sparkles } from "lucide-react";
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
    if (reviews.length === 0) return "0";
    const sum = reviews.reduce((acc, r) => acc + parseFloat(r.rating), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  if (loading || userLoading || reviewsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-8 p-6 md:p-8">
          <div className="h-10 bg-muted rounded-xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
          <p className="text-destructive font-medium mb-2">Error loading dashboard</p>
          <p className="text-muted-foreground text-sm mb-6">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </Card>
      </div>
    );
  }

  if (!user?.tutorProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 border-border bg-card text-center rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-3">Complete Your Tutor Profile</h2>
          <p className="text-muted-foreground mb-6">
            Create a tutor profile to start receiving bookings.
          </p>
          <Link href="/tutor-dashboard/profile">
            <Button className="rounded-xl bg-primary text-primary-foreground hover:opacity-90">
              Create Profile
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-900 text-white py-10 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
        <div className="relative container mx-auto px-4 md:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white/95 mb-4">
            <Sparkles className="w-4 h-4" />
            Tutor Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Tutor"}!
          </h1>
          <p className="text-white/90 mt-2 text-lg">
            Manage your teaching sessions and track your progress.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{tutorBookings.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="w-8 h-8 text-primary" />
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
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{completedBookings.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/15">
                  <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </Card>
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Students</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{uniqueStudents}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
            </Card>
          </div>

          {/* Rating */}
          {reviews.length > 0 && (
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6 bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/15">
                    <Star className="w-8 h-8 text-amber-600 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold text-foreground">{averageRating} <span className="text-muted-foreground font-normal text-base">/ 5</span></p>
                    <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
                  </div>
                </div>
                <Link href="/tutor-dashboard/reviews">
                  <Button variant="outline" className="rounded-xl border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15">
                    View All Reviews
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/tutor-dashboard/availability">
              <Button variant="outline" className="w-full rounded-xl h-12 border-primary/50 text-primary hover:bg-primary/10">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Availability
              </Button>
            </Link>
            <Link href="/tutor-dashboard/profile">
              <Button variant="outline" className="w-full rounded-xl h-12 border-border hover:bg-muted/50">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* Upcoming */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Sessions</h2>
            {upcomingBookings.length === 0 ? (
              <Card className="border-border bg-card rounded-2xl shadow-sm p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">No upcoming sessions</p>
                <p className="text-sm text-muted-foreground">
                  Students will book based on your availability.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{booking.student?.name || "Student"}</h3>
                            <p className="text-sm text-muted-foreground">{booking.student?.email || ""}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
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
                              Start Session
                            </Button>
                          </a>
                        )}
                        <Link href={`/tutor-dashboard/bookings/${booking.id}`}>
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

          {/* Recent completed */}
          {completedBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Completed Sessions</h2>
              <div className="space-y-4">
                {completedBookings.slice(0, 5).map((booking) => (
                  <Card key={booking.id} className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{booking.student?.name || "Student"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.sessionDate).toLocaleDateString()} at{" "}
                            {new Date(booking.sessionDate).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        {booking.status}
                      </span>
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
