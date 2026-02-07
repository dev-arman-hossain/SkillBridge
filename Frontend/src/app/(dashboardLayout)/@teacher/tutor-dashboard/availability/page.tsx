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
import { ArrowLeft, Calendar, Trash2 } from "lucide-react";
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
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!user?.tutorProfile) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile required</h2>
          <p className="text-gray-600 mb-4">Create a tutor profile first to manage availability.</p>
          <Link href="/tutor-dashboard/profile">
            <Button className="bg-teal-600 hover:bg-teal-700">Create profile</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <Link
        href="/tutor-dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Availability</h1>
        <p className="text-gray-600 mt-1">Set when you are available for sessions</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Add time slot</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
          <div className="space-y-2 min-w-[140px]">
            <Label>Day</Label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            <Label>Start</Label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="space-y-2">
            <Label>End</Label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <Button type="submit" disabled={creating} className="bg-teal-600 hover:bg-teal-700">
            {creating ? "Adding..." : "Add slot"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Your slots</h2>
        {availLoading ? (
          <div className="animate-pulse h-24 bg-gray-100 rounded" />
        ) : availability.length === 0 ? (
          <p className="text-gray-500">No availability set. Add a slot above.</p>
        ) : (
          <ul className="space-y-3">
            {availability.map((slot) => (
              <li
                key={slot.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span className="font-medium">{slot.dayOfWeek}</span>
                  <span className="text-gray-500 text-sm">
                    {formatTime(new Date(slot.startTime))} – {formatTime(new Date(slot.endTime))}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(slot.id)}
                  disabled={deleting}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
