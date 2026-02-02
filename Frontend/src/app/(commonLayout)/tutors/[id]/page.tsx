"use client";

import { useTutor, useTutorReviews } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Star, ArrowLeft, Calendar, Award, BookOpen } from "lucide-react";
import Link from "next/link";

export default function TutorDetailPage() {
  const params = useParams();
  const tutorId = params.id as string;
  const router = useRouter();

  const { tutor, loading, error } = useTutor(tutorId);
  const { reviews, loading: reviewsLoading } = useTutorReviews(
    tutor?.tutorProfile?.id || null,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6 max-w-5xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="p-8 max-w-2xl mx-auto border-red-200 bg-red-50">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Tutor Not Found
            </h2>
            <p className="text-red-600 mb-6">
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
      </div>
    );
  }

  const averageRating = 5.0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <Link href="/tutors">
            <Button
              variant="ghost"
              className="mb-8 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tutors
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-10 pb-8">
            <div className="relative group">
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-2xl shadow-teal-500/30 transition-transform duration-500 group-hover:scale-105">
                <span className="text-6xl font-bold text-white">
                  {tutor.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-tight">
                  {tutor.name}
                </h1>
                <p className="text-teal-300 dark:text-teal-200 text-xl font-medium">
                  {tutor.tutorProfile?.qualifications || "Professional Tutor"}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold ml-1">
                    {averageRating}
                  </span>
                </div>
                <span className="text-white/60">•</span>
                <span className="text-white/80 text-lg">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>

              <Link href={`/booking/${tutorId}`}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold px-8 py-6 rounded-xl shadow-xl shadow-teal-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/40"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <Card className="border-0 shadow-xl dark:shadow-slate-950/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-500 bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    About Me
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  {tutor.tutorProfile?.biography ||
                    "This tutor hasn't added a biography yet."}
                </p>
              </div>
            </Card>

            {tutor.tutorProfile?.qualifications && (
              <Card className="border-0 shadow-xl dark:shadow-slate-950/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-500 bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                      Qualifications
                    </h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                    {tutor.tutorProfile.qualifications}
                  </p>
                </div>
              </Card>
            )}

            <Card className="border-0 shadow-xl dark:shadow-slate-950/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-500 bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Student Reviews
                  </h2>
                </div>

                {reviewsLoading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 mb-3"></div>
                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                      No reviews yet. Be the first to leave a review!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div
                        key={review.id}
                        className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0 transition-all duration-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 -mx-4 px-4 py-4 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {(review.student?.name || "S")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white text-lg">
                                {review.student?.name || "Student"}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < parseInt(review.rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-slate-600 dark:text-slate-300 mt-3 ml-16 leading-relaxed">
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
            <Card className="border-0 shadow-xl dark:shadow-slate-950/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-500 bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    Teaching Subjects
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.tutorProfile?.categories?.map((cat: any) => (
                    <span
                      key={cat.id}
                      className="px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-semibold border border-teal-100 dark:border-teal-800 hover:border-teal-300 dark:hover:border-teal-600 transition-colors duration-300"
                    >
                      {cat.name}
                    </span>
                  )) || (
                    <span className="text-slate-500 dark:text-slate-400 text-sm">
                      No subjects listed
                    </span>
                  )}
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-xl dark:shadow-slate-950/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-500 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 dark:border dark:border-slate-800">
              <div className="p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-lg">
                  Performance Stats
                </h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      Total Reviews
                    </span>
                    <span className="font-bold text-2xl text-slate-900 dark:text-white">
                      {reviews.length}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      Average Rating
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-2xl text-slate-900 dark:text-white">
                        {averageRating}
                      </span>
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      Response Time
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm">
                      Fast
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">
                  Ready to Start Learning?
                </h3>
                <p className="text-teal-50 dark:text-teal-100 text-sm mb-5 leading-relaxed">
                  Book your first session with {tutor.name.split(" ")[0]} and
                  begin your learning journey today!
                </p>
                <Link href={`/booking/${tutorId}`}>
                  <Button className="w-full bg-white text-teal-600 hover:bg-slate-50 dark:bg-slate-100 dark:text-teal-700 dark:hover:bg-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Calendar className="w-5 h-5 mr-2" />
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
