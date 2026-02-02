"use client";

import Link from "next/link";
import Image from "next/image";
import { Tutor } from "../../../types";

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const profileImage = tutor.tutorProfile?.profileImage || "/calculator.png";
  const biography = tutor.tutorProfile?.biography || "No biography available";
  const qualifications = tutor.tutorProfile?.qualifications || "Not specified";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 bg-linear-to-r from-blue-400 to-purple-500">
        <Image
          src={profileImage}
          alt={tutor.name}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/calculator.png";
          }}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {tutor.name}
        </h3>
        <p className="text-sm text-gray-600 mb-1">{tutor.email}</p>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Qualifications:
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">{qualifications}</p>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-700 line-clamp-3">{biography}</p>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href={`/tutors/${tutor.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Profile
          </Link>
          <Link
            href={`/booking/${tutor.id}`}
            className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Book Session
          </Link>
        </div>
      </div>
    </div>
  );
}
