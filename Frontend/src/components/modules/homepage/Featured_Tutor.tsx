'use client'

import Link from "next/link";
import { useTutors } from "@/hooks/useApi";
import TutorCard from "../../card/Tutorcard";

const Featured_Tutor = () => {
  const { tutors, loading, error } = useTutors();

  return (
    <div>
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#0A0A0A]">
                Featured <span className="text-teal-500">Tutors</span>
              </h2>
              <p className="mt-2 text-gray-500">
                Learn from highly rated tutors who are passionate about teaching
              </p>
            </div>

            <Link
              href="/tutors"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-xl border border-teal-500 px-5 py-2 text-teal-600 hover:bg-teal-50 transition"
            >
              View All Tutors →
            </Link>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading tutors...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tutors.map((tutor) => (
                <TutorCard tutor={tutor} key={tutor.id} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Featured_Tutor;
