"use client";

import { useTutor, useCreateBooking } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { tutorApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
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
  Sparkles,
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

        const availabilityData = response.data || [];
        setAvailability(
          Array.isArray(availabilityData) ? availabilityData : [],
        );
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
            <div className="h-10 bg-muted rounded-xl w-1/4" />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="h-80 bg-muted rounded-2xl" />
              <div className="md:col-span-2 h-96 bg-muted rounded-2xl" />
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

  const today = new Date().toISOString().split("T")[0];
  const profileImage = tutor.tutorProfile?.profileImage;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero – match Find Tutors / Tutor profile */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-900 text-white py-10 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
        <div className="relative container mx-auto px-4">
          <Link href={`/tutors/${tutorId}`}>
            <Button variant="ghost" className="mb-6 text-white/80 hover:text-white hover:bg-white/10 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white/95">
              <Sparkles className="w-4 h-4" />
              Book a session
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Schedule with {tutor.name}
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-1">
              <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden sticky top-4">
                <div className="p-6">
                  <div className="text-center mb-5">
                    <div className="relative inline-block mb-4">
                      <div className="relative w-24 h-24 rounded-2xl bg-muted flex items-center justify-center overflow-hidden ring-2 ring-border">
                        {profileImage ? (
                          <>
                            <Image
                              src={profileImage}
                              alt={tutor.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = "none";
                                const wrap = target.closest(".relative");
                                const fallback = wrap?.querySelector(".tutor-initial");
                                if (fallback instanceof HTMLElement) fallback.style.display = "flex";
                              }}
                            />
                            <span className="tutor-initial absolute inset-0 flex items-center justify-center text-2xl font-bold text-muted-foreground bg-muted" style={{ display: "none" }}>
                              {tutor.name.charAt(0).toUpperCase()}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-muted-foreground">
                            {tutor.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      {tutor.name}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {tutor.tutorProfile?.qualifications || "Professional Tutor"}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-5 bg-muted/50 rounded-xl py-2.5 px-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2 font-medium">5.0</span>
                  </div>

                  {tutor.tutorProfile?.biography && (
                    <div className="mb-5 pb-5 border-b border-border">
                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full" />
                        About
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {tutor.tutorProfile.biography}
                      </p>
                    </div>
                  )}

                  {tutor.tutorProfile?.qualifications && (
                    <div className="mb-5 pb-5 border-b border-border">
                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full" />
                        Qualifications
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {tutor.tutorProfile.qualifications}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/40 rounded-lg p-3">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-medium">Professional Tutor</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/40 rounded-lg p-3">
                      <Video className="w-4 h-4 text-primary" />
                      <span className="font-medium">Online Sessions</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
              <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      Choose date & time
                    </h2>
                    <p className="text-muted-foreground">
                      Pick an available slot or enter your preferred session time.
                    </p>
                  </div>

                  <Card className="border border-border p-5 md:p-6 bg-muted/30 rounded-xl mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Available Time Slots
                      </h3>
                      {!loadingAvailability && availability.length > 0 && (
                        <span className="text-xs bg-primary/15 text-primary px-2.5 py-1 rounded-full font-medium">
                          {availability.length} {availability.length === 1 ? "slot" : "slots"}
                        </span>
                      )}
                    </div>

                    {loadingAvailability ? (
                      <div className="space-y-3">
                        <div className="h-14 bg-muted rounded-xl animate-pulse" />
                        <div className="h-14 bg-muted rounded-xl animate-pulse" />
                        <div className="h-14 bg-muted rounded-xl animate-pulse" />
                      </div>
                    ) : availability.length === 0 ? (
                      <div className="bg-card p-5 rounded-xl border border-dashed border-border">
                        <p className="text-foreground text-sm mb-2 font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                          No specific availability set
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          This tutor hasn't set their availability yet. You can still book and the tutor will confirm the time.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {availability.map((avail, index) => {
                          const startDate = new Date(avail.startTime);
                          const endDate = new Date(avail.endTime);
                          const startTime = startDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: "UTC",
                          });
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
                                  ? "bg-primary/10 border-primary shadow-sm ring-2 ring-primary/20"
                                  : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? "bg-primary" : "bg-emerald-500"}`} />
                                <span className={`font-semibold min-w-[100px] text-left ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                                  {avail.dayOfWeek}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={isSelected ? "text-foreground font-medium" : "text-muted-foreground"}>
                                  {startTime} – {endTime}
                                </span>
                                {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                              </div>
                            </button>
                          );
                        })}
                        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
                          <Clock className="w-4 h-4 shrink-0" />
                          Click a slot to auto-fill date and time below.
                        </p>
                      </div>
                    )}
                  </Card>

                  <form onSubmit={handleBooking} className="space-y-6">
                    <div>
                      <Label htmlFor="date" className="flex items-center gap-2 mb-2 font-medium text-foreground">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
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
                        className="w-full h-11 rounded-lg"
                      />
                      {sessionDate && (
                        <div className="mt-3">
                          {selectedDayAvailability ? (
                            <div className="flex items-start gap-3 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium mb-1">Tutor available on {selectedDayAvailability.dayOfWeek}</p>
                                <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                                  {new Date(selectedDayAvailability.startTime).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: "UTC",
                                  })}{" "}
                                  –{" "}
                                  {new Date(selectedDayAvailability.endTime).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: "UTC",
                                  })}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3 text-sm text-amber-700 dark:text-amber-300 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium mb-1">Tutor may not be available</p>
                                <p className="text-amber-600 dark:text-amber-400 text-xs">
                                  No availability set for{" "}
                                  {(() => {
                                    const [y, m, d] = sessionDate.split("-").map(Number);
                                    return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long" });
                                  })()}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">Select a future date for your session.</p>
                    </div>

                    <div>
                      <Label htmlFor="time" className="flex items-center gap-2 mb-2 font-medium text-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Session Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={sessionTime}
                        onChange={(e) => setSessionTime(e.target.value)}
                        required
                        disabled={bookingLoading}
                        className="w-full h-11 rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Preferred time (24h).</p>
                    </div>

                    <div>
                      <Label htmlFor="link" className="flex items-center gap-2 mb-2 font-medium text-foreground">
                        <Video className="w-4 h-4 text-muted-foreground" />
                        Video Call Link (optional)
                      </Label>
                      <Input
                        id="link"
                        type="url"
                        placeholder="https://meet.google.com/..."
                        value={sessionLink}
                        onChange={(e) => setSessionLink(e.target.value)}
                        disabled={bookingLoading}
                        className="w-full h-11 rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Leave empty to use a default Meet link.</p>
                    </div>

                    {sessionDate && sessionTime && (
                      <Card className="border border-border p-5 bg-muted/30 rounded-xl">
                        <h3 className="font-semibold text-foreground mb-3">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Tutor</span>
                            <span className="font-medium text-foreground">{tutor.name}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium text-foreground">{new Date(sessionDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Time</span>
                            <span className="font-medium text-foreground">{sessionTime}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-medium text-foreground bg-primary/15 text-primary px-2.5 py-1 rounded-full text-xs">
                              Pending
                            </span>
                          </div>
                        </div>
                      </Card>
                    )}

                    {!session?.user && (
                      <Card className="border border-amber-500/30 p-4 bg-amber-500/10 rounded-xl">
                        <p className="text-foreground text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                          <span>
                            You must be logged in to book.{" "}
                            <Link href="/login" className="underline font-medium text-primary hover:opacity-90">
                              Log in
                            </Link>
                          </span>
                        </p>
                      </Card>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={bookingLoading || !session?.user}
                        className="flex-1 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-semibold py-6 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {bookingLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin inline-block mr-2" />
                            Booking...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4 mr-2" />
                            Confirm Booking
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>

              <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden p-6">
                <h3 className="font-semibold text-foreground mb-3">What happens next?</h3>
                <ul className="space-y-3">
                  {[
                    "Your booking request is sent to the tutor.",
                    "You'll get a confirmation.",
                    "Join the session at the scheduled time.",
                    "Leave a review after the session.",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="w-6 h-6 rounded-full bg-primary/15 text-primary font-medium flex items-center justify-center flex-shrink-0 text-xs">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
