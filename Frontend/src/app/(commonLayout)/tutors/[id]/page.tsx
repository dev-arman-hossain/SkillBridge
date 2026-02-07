"use client";

import { useTutor, useTutorReviews } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, ArrowLeft, Calendar, Award, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TutorDetailPage() {
  const params = useParams();
  const tutorId = params.id as string;

  const { tutor, loading, error } = useTutor(tutorId);
  const { reviews, loading: reviewsLoading } = useTutorReviews(
    tutor?.tutorProfile?.id || null,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
            <div className="h-10 bg-muted rounded-xl w-1/4" />
            <div className="h-48 md:h-56 bg-muted rounded-2xl" />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 h-80 bg-muted rounded-2xl" />
              <div className="h-64 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 border-border bg-card text-card-foreground text-center">
          <p className="text-destructive font-medium mb-2">Tutor Not Found</p>
          <p className="text-muted-foreground text-sm mb-6">
            {error || "The tutor you're looking for doesn't exist."}
          </p>
          <Link href="/tutors">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tutors
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const averageRating = 5.0;

  const profileImage = tutor.tutorProfile?.profileImage;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero – same style as Find Tutors page */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-900 text-white py-14 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
        <div className="relative container mx-auto px-4">
          <Link href="/tutors">
            <Button
              variant="ghost"
              className="mb-6 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tutors
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 pb-4">
            <div className="relative group flex-shrink-0">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white/15 dark:bg-white/10 flex items-center justify-center overflow-hidden ring-2 ring-white/20 shadow-xl transition-transform duration-300 group-hover:scale-[1.02]">
                {profileImage ? (
                  <>
                    <Image
                      src={profileImage}
                      alt={tutor.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const wrap = target.closest(".relative");
                        const fallback = wrap?.querySelector(".tutor-initial");
                        if (fallback instanceof HTMLElement) fallback.style.display = "flex";
                      }}
                    />
                    <span className="tutor-initial absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold text-white/90 bg-white/10" style={{ display: "none" }}>
                      {tutor.name.charAt(0).toUpperCase()}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl md:text-5xl font-bold text-white/90">
                    {tutor.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-400 rounded-full p-1.5 shadow-lg ring-2 ring-white/30">
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white/95">
                <Sparkles className="w-4 h-4" />
                Expert tutor
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                {tutor.name}
              </h1>
              <p className="text-white/90 text-lg md:text-xl">
                {tutor.tutorProfile?.qualifications || "Professional Tutor"}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-white/15 dark:bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-white/95 ml-1">{averageRating}</span>
                </div>
                <span className="text-white/60">•</span>
                <span className="text-white/90">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>

              <Link href={`/booking/${tutorId}`}>
                <Button
                  size="lg"
                  className="rounded-xl bg-white text-emerald-700 hover:bg-white/95 dark:text-teal-900 font-semibold px-6 py-5 shadow-lg transition-opacity hover:opacity-90"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-primary rounded-full" />
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    About Me
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {tutor.tutorProfile?.biography ||
                    "This tutor hasn't added a biography yet."}
                </p>
              </div>
            </Card>

            {tutor.tutorProfile?.qualifications && (
              <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                      Qualifications
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {tutor.tutorProfile.qualifications}
                  </p>
                </div>
              </Card>
            )}

            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-primary rounded-full" />
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    Student Reviews
                  </h2>
                </div>

                {reviewsLoading ? (
                  <div className="space-y-5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded-lg w-3/4 mb-2" />
                        <div className="h-4 bg-muted rounded-lg w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-10 bg-muted/50 rounded-xl">
                    <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to leave a review!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-border pb-5 last:border-0 last:pb-0 transition-colors hover:bg-muted/30 -mx-2 px-4 py-3 rounded-xl"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                              {(review.student?.name || "S").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">
                                {review.student?.name || "Student"}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < parseInt(review.rating)
                                        ? "fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500"
                                        : "fill-muted text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium flex-shrink-0">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground text-sm mt-2 pl-[52px] leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden p-5 md:p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                Teaching Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {tutor.tutorProfile?.categories?.map((cat: any) => (
                  <span
                    key={cat.id}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
                  >
                    {cat.name}
                  </span>
                )) ?? (
                  <span className="text-muted-foreground text-sm">No subjects listed</span>
                )}
              </div>
            </Card>

            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden p-5 md:p-6">
              <h3 className="font-semibold text-foreground mb-4 text-base">
                Performance Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm font-medium">Total Reviews</span>
                  <span className="font-semibold text-foreground">{reviews.length}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm font-medium">Average Rating</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{averageRating}</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500" />
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm font-medium">Response Time</span>
                  <span className="font-medium text-foreground text-sm px-2.5 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    Fast
                  </span>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-800 dark:via-teal-800 dark:to-cyan-800 text-white shadow-sm">
              <div className="p-5 md:p-6">
                <h3 className="font-semibold text-lg mb-1">Ready to Start Learning?</h3>
                <p className="text-white/90 text-sm mb-4 leading-relaxed">
                  Book your first session with {tutor.name.split(" ")[0]} and begin your learning journey today!
                </p>
                <Link href={`/booking/${tutorId}`}>
                  <Button className="w-full rounded-xl bg-white text-emerald-700 hover:bg-white/95 dark:text-teal-900 font-semibold py-5 shadow-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
