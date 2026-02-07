"use client";

import { useTutors, useCategories } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Search, Star, GraduationCap, BookOpen, Sparkles } from "lucide-react";
import { useState } from "react";

export default function TutorsPage() {
  const { tutors, loading, error } = useTutors();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.tutorProfile?.biography?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      tutor.tutorProfile?.categories?.some((cat: any) => cat.id === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-muted rounded-xl w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 border-border bg-card text-card-foreground text-center">
          <p className="text-destructive font-medium mb-2">Could not load tutors</p>
          <p className="text-muted-foreground text-sm mb-6">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-900 text-white py-14 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white/95 mb-6">
              <Sparkles className="w-4 h-4" />
              {tutors.length}+ expert tutors
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Find your perfect tutor
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Browse profiles, filter by subject, and book a session that fits your goals.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/15 dark:bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/30 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Filters Sidebar */}
          <aside className="lg:w-56 xl:w-64 flex-shrink-0">
            <Card className="p-5 sticky top-4 border-border bg-card text-card-foreground rounded-2xl shadow-sm">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                Category
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  All categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </Card>
          </aside>

          {/* Tutors Grid */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {filteredTutors.length} tutor{filteredTutors.length !== 1 ? "s" : ""} found
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {selectedCategory !== "all" || searchQuery
                  ? "Refine search or clear filters to see more."
                  : "Browse and select a tutor to view their profile."}
              </p>
            </div>

            {filteredTutors.length === 0 ? (
              <Card className="p-12 text-center border-border bg-card rounded-2xl">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-muted p-4">
                    <GraduationCap className="w-10 h-10 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-foreground font-medium mb-1">No tutors match your criteria</p>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  Try a different category or search term.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {filteredTutors.map((tutor) => {
                  const profileImage = tutor.tutorProfile?.profileImage;
                  return (
                    <Card
                      key={tutor.id}
                      className="group overflow-hidden border-border bg-card text-card-foreground rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-border transition-all duration-200"
                    >
                      <div className="p-5 md:p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="relative w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-border">
                            {profileImage ? (
                              <>
                                <Image
                                  src={profileImage}
                                  alt={tutor.name}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = "none";
                                    const wrap = target.closest(".relative");
                                    const fallback = wrap?.querySelector(".tutor-initial");
                                    if (fallback instanceof HTMLElement) fallback.style.display = "flex";
                                  }}
                                />
                                <span className="tutor-initial absolute inset-0 flex items-center justify-center text-xl font-bold text-muted-foreground bg-muted" style={{ display: "none" }}>
                                  {tutor.name.charAt(0).toUpperCase()}
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-bold text-muted-foreground">
                                {tutor.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-foreground truncate">
                              {tutor.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500"
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">5.0</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                          {tutor.tutorProfile?.biography ||
                            "Experienced tutor ready to help you succeed."}
                        </p>

                        <div className="mb-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Specializations
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {tutor.tutorProfile?.categories?.slice(0, 3).map((cat: any) => (
                              <span
                                key={cat.id}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
                              >
                                {cat.name}
                              </span>
                            )) ?? (
                              <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs">
                                Multiple subjects
                              </span>
                            )}
                          </div>
                        </div>

                        <Link href={`/tutors/${tutor.id}`} className="block">
                          <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                            View profile
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
