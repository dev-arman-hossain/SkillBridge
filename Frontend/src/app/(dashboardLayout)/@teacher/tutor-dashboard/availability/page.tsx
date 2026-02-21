"use client";

import {
  useCurrentUser,
  useAvailability,
  useCreateAvailability,
  useDeleteAvailability,
} from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Calendar, Trash2, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function formatTime(date: Date) {
  return date.toTimeString().slice(0, 5);
}

export default function TutorAvailabilityPage() {
  const { data: session } = authClient.useSession();
  const { user, loading: userLoading } = useCurrentUser();
  const tutorProfileId = user?.tutorProfile?.id || undefined;
  const { availability, loading: availLoading, refetch } = useAvailability(tutorProfileId);
  const { createAvailability, loading: creating } = useCreateAvailability();
  const { deleteAvailability, loading: deleting } = useDeleteAvailability();

  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.tutorProfile?.id) {
      toast.error("Create a tutor profile first");
      return;
    }
    if (!dayOfWeek) {
      toast.error("Please select a day");
      return;
    }
    try {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      await createAvailability({
        tutorId: user.tutorProfile.id,
        dayOfWeek,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      toast.success("Availability added");
      refetch();
      setDayOfWeek("");
    } catch (err: any) {
      toast.error(err.message || "Failed to add availability");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAvailability(id);
      toast.success("Slot removed");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  if (userLoading || !session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-8 p-6 md:p-8">
          <div className="h-10 bg-muted rounded-xl w-1/3" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user?.tutorProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 border-border bg-card text-center rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-3">Profile required</h2>
          <p className="text-muted-foreground mb-6">Create a tutor profile first to manage availability.</p>
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
          <Link
            href="/tutor-dashboard"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white/95 mb-4">
            <Sparkles className="w-4 h-4" />
            Availability
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Set Your Teaching Schedule
          </h1>
          <p className="text-white/90 mt-2 text-lg max-w-xl">
            Choose the days and times you are available to teach students.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Add slot form */}
          <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Add New Time Slot</h2>
            </div>

            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="day" className="text-foreground font-medium">Day of week</Label>
                <select
                  id="day"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                >
                  <option value="">Select day</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start" className="text-foreground font-medium">Start time</Label>
                <input
                  id="start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end" className="text-foreground font-medium">End time</Label>
                <input
                  id="end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>
              <Button
                type="submit"
                disabled={creating}
                className="w-full rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-medium py-2.5"
              >
                {creating ? "Adding..." : "Add Slot"}
              </Button>
            </form>
          </Card>

          {/* List slots */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Current Availability</h2>
              </div>
              {availability.length > 0 && (
                <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {availability.length} {availability.length === 1 ? 'slot' : 'slots'}
                </span>
              )}
            </div>

            {availLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse h-20 bg-muted rounded-2xl" />
                ))}
              </div>
            ) : availability.length === 0 ? (
              <Card className="border-border bg-card rounded-2xl shadow-sm p-12 text-center border-dashed">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-bold text-lg mb-2">No availability set</p>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Add your first time slot above to let students know when they can book sessions with you.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availability.map((slot) => (
                  <Card
                    key={slot.id}
                    className="group border-border bg-card text-card-foreground rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                          <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{slot.dayOfWeek}</p>
                          <p className="text-sm text-muted-foreground font-medium">
                            {formatTime(new Date(slot.startTime))} – {formatTime(new Date(slot.endTime))}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(slot.id)}
                        disabled={deleting}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Remove slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
