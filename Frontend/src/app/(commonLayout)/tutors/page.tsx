"use client";

import { useTutors, useCategories } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Star, GraduationCap } from "lucide-react";
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
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600">Error loading tutors: {error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Tutor</h1>
          <p className="text-xl text-teal-50 mb-8">
            Browse {tutors.length}+ expert tutors ready to help you succeed
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for tutors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4">Filter by Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === "all"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          {/* Tutors Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredTutors.length} Tutor{filteredTutors.length !== 1 ? "s" : ""} Found
              </h2>
            </div>

            {filteredTutors.length === 0 ? (
              <Card className="p-12 text-center">
                <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No tutors found matching your criteria</p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 bg-teal-500 hover:bg-teal-600"
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTutors.map((tutor) => (
                  <Card
                    key={tutor.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-teal-600">
                            {tutor.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 truncate">
                            {tutor.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">(5.0)</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {tutor.tutorProfile?.biography || "Experienced tutor ready to help you succeed"}
                      </p>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Specializations:</p>
                        <div className="flex flex-wrap gap-2">
                          {tutor.tutorProfile?.categories?.slice(0, 3).map((cat: any) => (
                            <span
                              key={cat.id}
                              className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs"
                            >
                              {cat.name}
                            </span>
                          )) || (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              Multiple subjects
                            </span>
                          )}
                        </div>
                      </div>

                      <Link href={`/tutors/${tutor.id}`}>
                        <Button className="w-full bg-teal-500 hover:bg-teal-600">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
