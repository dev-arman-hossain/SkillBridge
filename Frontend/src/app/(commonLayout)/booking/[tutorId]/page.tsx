"use client";

import { useTutor, useCreateBooking } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { tutorApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  User,
  Star,
  ArrowLeft,
  Video,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Availability {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export default function BookingPage() {
  const params = useParams();
  const tutorId = params.tutorId as string;
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const { tutor, loading, error } = useTutor(tutorId);
  const { createBooking, loading: bookingLoading } = useCreateBooking();

  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionLink, setSessionLink] = useState("");
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [selectedDayAvailability, setSelectedDayAvailability] =
    useState<Availability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const getNextDayOfWeek = (dayName: string): string => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIndex = today.getDay();
    const targetIndex = days.indexOf(dayName);

    if (targetIndex === -1) return "";

    let daysUntilTarget = targetIndex - todayIndex;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7;
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);

    const year = targetDate.getFullYear();
    const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
    const day = targetDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const extractTimeFromDate = (dateString: string): string => {
    const date = new Date(dateString);

    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSlotSelect = (avail: Availability) => {
    setSelectedSlot(avail.id);

    const nextDate = getNextDayOfWeek(avail.dayOfWeek);
    setSessionDate(nextDate);

    const time = extractTimeFromDate(avail.startTime);
    setSessionTime(time);

    toast.success(`Selected ${avail.dayOfWeek}`, {
      description: `Date: ${nextDate}, Time: ${time}. You can adjust if needed.`,
    });
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!tutor?.tutorProfile?.id) return;

      try {
        setLoadingAvailability(true);

        const response = await tutorApi.getAvailability({
          tutorId: tutor.tutorProfile.id,
        });

        console.log("Availability response:", response);

        const availabilityData = response.data || [];
        setAvailability(
          Array.isArray(availabilityData) ? availabilityData : [],
        );

        if (availabilityData.length === 0) {
          console.warn(
            "No availability slots found for tutor:",
            tutor.tutorProfile.id,
          );
        } else {
          console.log(`Found ${availabilityData.length} availability slots`);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        setAvailability([]);
      } finally {
        setLoadingAvailability(false);
      }
    };

    if (tutor?.tutorProfile?.id) {
      fetchAvailability();
    }
  }, [tutor?.tutorProfile?.id]);

  useEffect(() => {
    if (sessionDate && availability.length > 0) {
      const [year, month, day] = sessionDate.split("-").map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const dayOfWeek = selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const dayAvailability = availability.find(
        (avail) => avail.dayOfWeek === dayOfWeek,
      );

      setSelectedDayAvailability(dayAvailability || null);

      if (dayAvailability) {
        setSelectedSlot(dayAvailability.id);
      } else {
        setSelectedSlot(null);
      }
    } else {
      setSelectedDayAvailability(null);
      setSelectedSlot(null);
    }
  }, [sessionDate, availability]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login to book a session", {
        description: "You need to be logged in to make a booking",
      });
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    const userRole = (session.user as any).role;
    if (userRole && userRole !== "STUDENT" && userRole !== "USER") {
      toast.error("Only students can book sessions", {
        description:
          "Please switch to a student account to book tutoring sessions",
      });
      return;
    }

    if (!sessionDate) {
      toast.error("Please select a date", {
        description: "Choose a date for your tutoring session",
      });
      return;
    }

    if (!sessionTime) {
      toast.error("Please select a time", {
        description: "Choose a time for your tutoring session",
      });
      return;
    }

    if (!tutor?.tutorProfile?.id) {
      toast.error("Tutor profile not found", {
        description: "This tutor hasn't set up their profile yet",
      });
      return;
    }

    const [year, month, day] = sessionDate.split("-").map(Number);
    const [hours, minutes] = sessionTime.split(":").map(Number);
    const selectedDateTimeUTC = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, 0, 0),
    );
    const now = new Date();

    if (selectedDateTimeUTC <= now) {
      toast.error("Invalid date/time", {
        description: "Please select a future date and time",
      });
      return;
    }

    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    if (selectedDateTimeUTC > threeMonthsFromNow) {
      toast.error("Date too far in the future", {
        description: "Please book within the next 3 months",
      });
      return;
    }

    if (sessionLink && !isValidUrl(sessionLink)) {
      toast.error("Invalid video link", {
        description:
          "Please enter a valid URL (e.g., https://meet.google.com/...)",
      });
      return;
    }

    try {
      const dateTimeString = selectedDateTimeUTC.toISOString();

      const loadingToast = toast.loading("Creating your booking...", {
        description: "Please wait while we process your request",
      });

      await createBooking({
        studentId: session.user.id,
        tutorId: tutor.tutorProfile.id,
        sessionDate: dateTimeString,
        sessionLink: sessionLink || `https://meet.google.com/new`,
      });

      toast.dismiss(loadingToast);

      const displayTime = selectedDateTimeUTC.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      });

      toast.success("Booking confirmed!", {
        description: `Session with ${tutor.name} on ${sessionDate} at ${displayTime}`,
      });

      setTimeout(() => {
        router.push("/student-dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Booking error:", err);

      if (err.message.includes("fetch") || err.message.includes("network")) {
        toast.error("Network error", {
          description: "Please check your internet connection and try again",
        });
        return;
      }

      if (
        err.message.includes("not available") ||
        err.message.includes("availability")
      ) {
        toast.error("Tutor not available", {
          description:
            "This tutor is not available at the selected time. Please choose a different time.",
        });
        return;
      }

      if (err.message.includes("time") || err.message.includes("slot")) {
        toast.error("Time slot unavailable", {
          description:
            "This time slot is already booked. Please choose another time.",
        });
        return;
      }

      if (err.message.includes("Tutor profile not found")) {
        toast.error("Tutor unavailable", {
          description:
            "This tutor's profile is not set up yet. Please try another tutor.",
        });
        return;
      }

      if (
        err.message.includes("session time") ||
        err.message.includes("between")
      ) {
        toast.error("Invalid session time", {
          description:
            "Please select a time within the tutor's availability window.",
        });
        return;
      }

      if (err.message.includes("400")) {
        toast.error("Invalid booking request", {
          description: "Please check your booking details and try again",
        });
        return;
      }

      if (err.message.includes("401")) {
        toast.error("Session expired", {
          description: "Please log in again to continue",
        });
        setTimeout(() => router.push("/login"), 1500);
        return;
      }

      if (err.message.includes("403")) {
        toast.error("Permission denied", {
          description: "You don't have permission to book sessions",
        });
        return;
      }

      if (err.message.includes("500")) {
        toast.error("Server error", {
          description:
            "Something went wrong on our end. Please try again later.",
        });
        return;
      }

      toast.error("Booking failed", {
        description:
          err.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith("http://") || url.startsWith("https://");
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
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

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/tutors">
            <Button
              variant="ghost"
              className="mb-8 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tutors
            </Button>
          </Link>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card className="border-0 shadow-xl dark:shadow-slate-950/50 rounded-2xl overflow-hidden sticky top-4 bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className="relative inline-block mb-6">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-xl shadow-teal-500/30">
                        <span className="text-4xl font-bold text-white">
                          {tutor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {tutor.name}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {tutor.email}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-6 bg-slate-50 dark:bg-slate-800 rounded-xl py-3 px-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-slate-600 dark:text-slate-300 ml-2 font-semibold">
                      (5.0)
                    </span>
                  </div>

                  {tutor.tutorProfile?.biography && (
                    <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                        About
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {tutor.tutorProfile.biography}
                      </p>
                    </div>
                  )}

                  {tutor.tutorProfile?.qualifications && (
                    <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                        Qualifications
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {tutor.tutorProfile.qualifications}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                      <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                        <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <span className="font-medium">Professional Tutor</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                      <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                        <Video className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <span className="font-medium">Online Sessions</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="border-0 shadow-xl dark:shadow-slate-950/50 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
                <div className="p-8">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                      Book a Session
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      Schedule a tutoring session with {tutor.name}
                    </p>
                  </div>

                  <Card className="border-0 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 mb-8 shadow-sm dark:border dark:border-teal-900/50">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-teal-900 dark:text-teal-100 flex items-center gap-2 text-lg">
                        <Clock className="w-5 h-5" />
                        Available Time Slots
                      </h3>
                      {!loadingAvailability && availability.length > 0 && (
                        <span className="text-xs bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-100 px-3 py-1.5 rounded-full font-semibold">
                          {availability.length}{" "}
                          {availability.length === 1 ? "slot" : "slots"}
                        </span>
                      )}
                    </div>

                    {loadingAvailability ? (
                      <div className="space-y-3">
                        <div className="h-14 bg-teal-200 dark:bg-teal-900/50 rounded-xl animate-pulse"></div>
                        <div className="h-14 bg-teal-200 dark:bg-teal-900/50 rounded-xl animate-pulse"></div>
                        <div className="h-14 bg-teal-200 dark:bg-teal-900/50 rounded-xl animate-pulse"></div>
                      </div>
                    ) : availability.length === 0 ? (
                      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-700">
                        <p className="text-teal-800 dark:text-teal-200 text-sm mb-2 font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          No specific availability set
                        </p>
                        <p className="text-teal-700 dark:text-teal-300 text-sm leading-relaxed">
                          This tutor hasn't set their availability schedule yet.
                          You can still book a session and the tutor will
                          confirm the time with you.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {availability.map((avail, index) => {
                          const startDate = new Date(avail.startTime);
                          const endDate = new Date(avail.endTime);
                          const startTime = startDate.toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              timeZone: "UTC",
                            },
                          );
                          const endTime = endDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: "UTC",
                          });

                          const isSelected = selectedSlot === avail.id;

                          return (
                            <button
                              key={avail.id || index}
                              type="button"
                              onClick={() => handleSlotSelect(avail)}
                              className={`w-full flex items-center justify-between text-sm p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-teal-100 dark:bg-teal-900/50 border-teal-500 dark:border-teal-400 shadow-lg ring-2 ring-teal-300 dark:ring-teal-700"
                                  : "bg-white dark:bg-slate-800 border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-md hover:bg-teal-50 dark:hover:bg-teal-950/30"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-2.5 h-2.5 rounded-full ${isSelected ? "bg-teal-600 dark:bg-teal-400" : "bg-green-500"}`}
                                ></div>
                                <span
                                  className={`font-bold min-w-[100px] text-left ${isSelected ? "text-teal-900 dark:text-teal-100" : "text-slate-700 dark:text-slate-200"}`}
                                >
                                  {avail.dayOfWeek}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-semibold ${isSelected ? "text-teal-800 dark:text-teal-200" : "text-slate-600 dark:text-slate-300"}`}
                                >
                                  {startTime} - {endTime}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                        <p className="text-xs text-teal-700 dark:text-teal-300 mt-3 flex items-center gap-1.5 bg-teal-100 dark:bg-teal-900/30 p-3 rounded-lg">
                          <Clock className="w-4 h-4" />
                          Click on a time slot to auto-fill the date and time
                          below
                        </p>
                      </div>
                    )}
                  </Card>

                  <form onSubmit={handleBooking} className="space-y-6">
                    <div>
                      <Label
                        htmlFor="date"
                        className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-semibold"
                      >
                        <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        Session Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        min={today}
                        value={sessionDate}
                        onChange={(e) => setSessionDate(e.target.value)}
                        required
                        disabled={bookingLoading}
                        className="w-full h-12 text-base dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      />

                      {sessionDate && (
                        <div className="mt-3">
                          {selectedDayAvailability ? (
                            <div className="flex items-start gap-3 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
                              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold mb-1">
                                  Tutor available on{" "}
                                  {selectedDayAvailability.dayOfWeek}
                                </p>
                                <p className="text-green-600 dark:text-green-400 text-xs">
                                  {new Date(
                                    selectedDayAvailability.startTime,
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: "UTC",
                                  })}{" "}
                                  -{" "}
                                  {new Date(
                                    selectedDayAvailability.endTime,
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: "UTC",
                                  })}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3 text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold mb-1">
                                  Tutor may not be available
                                </p>
                                <p className="text-yellow-600 dark:text-yellow-400 text-xs">
                                  No availability set for{" "}
                                  {(() => {
                                    const [year, month, day] = sessionDate
                                      .split("-")
                                      .map(Number);
                                    return new Date(
                                      year,
                                      month - 1,
                                      day,
                                    ).toLocaleDateString("en-US", {
                                      weekday: "long",
                                    });
                                  })()}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Select a future date for your session
                      </p>
                    </div>

                    <div>
                      <Label
                        htmlFor="time"
                        className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-semibold"
                      >
                        <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        Session Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={sessionTime}
                        onChange={(e) => setSessionTime(e.target.value)}
                        required
                        disabled={bookingLoading}
                        className="w-full h-12 text-base dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      />
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Choose your preferred time (24-hour format)
                      </p>
                    </div>

                    <div>
                      <Label
                        htmlFor="link"
                        className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-semibold"
                      >
                        <Video className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        Video Call Link (Optional)
                      </Label>
                      <Input
                        id="link"
                        type="url"
                        placeholder="https://meet.google.com/..."
                        value={sessionLink}
                        onChange={(e) => setSessionLink(e.target.value)}
                        disabled={bookingLoading}
                        className="w-full h-12 text-base dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                      />
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Leave empty to auto-generate a Google Meet link
                      </p>
                    </div>

                    {sessionDate && sessionTime && (
                      <Card className="border-0 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 dark:border dark:border-teal-900/50">
                        <h3 className="font-bold text-teal-900 dark:text-teal-100 mb-4 text-lg">
                          Booking Summary
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center py-2 border-b border-teal-200 dark:border-teal-800">
                            <span className="text-teal-700 dark:text-teal-300">
                              Tutor:
                            </span>
                            <span className="font-semibold text-teal-900 dark:text-teal-100">
                              {tutor.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-teal-200 dark:border-teal-800">
                            <span className="text-teal-700 dark:text-teal-300">
                              Date:
                            </span>
                            <span className="font-semibold text-teal-900 dark:text-teal-100">
                              {new Date(sessionDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-teal-200 dark:border-teal-800">
                            <span className="text-teal-700 dark:text-teal-300">
                              Time:
                            </span>
                            <span className="font-semibold text-teal-900 dark:text-teal-100">
                              {sessionTime}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-teal-700 dark:text-teal-300">
                              Status:
                            </span>
                            <span className="font-semibold text-teal-900 dark:text-teal-100 bg-teal-200 dark:bg-teal-900/50 px-3 py-1 rounded-full">
                              Pending Confirmation
                            </span>
                          </div>
                        </div>
                      </Card>
                    )}

                    {!session?.user && (
                      <Card className="border-0 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 dark:border dark:border-yellow-900/50">
                        <p className="text-yellow-900 dark:text-yellow-100 text-sm flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <span>
                            You need to be logged in to book a session.{" "}
                            <Link
                              href="/login"
                              className="underline font-semibold hover:text-yellow-700 dark:hover:text-yellow-300"
                            >
                              Login here
                            </Link>
                          </span>
                        </p>
                      </Card>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={bookingLoading || !session?.user}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-lg py-7 rounded-xl shadow-xl shadow-teal-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {bookingLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Booking...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5 mr-2" />
                            Confirm Booking
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>

              <Card className="border-0 shadow-xl dark:shadow-slate-950/50 rounded-2xl overflow-hidden mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border dark:border-blue-900/50">
                <div className="p-6">
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-4 text-lg">
                    What happens next?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-blue-800 dark:text-blue-200">
                      <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 font-bold text-blue-700 dark:text-blue-300">
                        1
                      </div>
                      <span>
                        Your booking request will be sent to the tutor
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-blue-800 dark:text-blue-200">
                      <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 font-bold text-blue-700 dark:text-blue-300">
                        2
                      </div>
                      <span>You'll receive a confirmation email</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-blue-800 dark:text-blue-200">
                      <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 font-bold text-blue-700 dark:text-blue-300">
                        3
                      </div>
                      <span>Join the session at the scheduled time</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-blue-800 dark:text-blue-200">
                      <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 font-bold text-blue-700 dark:text-blue-300">
                        4
                      </div>
                      <span>Leave a review after the session</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
