"use client";

import { useCurrentUser, useCategories, useCreateTutorProfile, useUpdateTutorProfile } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function TutorProfilePage() {
  const { data: session } = authClient.useSession();
  const { user, loading: userLoading, refetch: refetchUser } = useCurrentUser();
  const { categories, loading: categoriesLoading } = useCategories();
  const { createProfile, loading: creating } = useCreateTutorProfile();
  const { updateProfile, loading: updating } = useUpdateTutorProfile();

  const [biography, setBiography] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  const hasProfile = !!user?.tutorProfile;

  useEffect(() => {
    if (user?.tutorProfile) {
      setBiography(user.tutorProfile.biography || "");
      setProfileImage(user.tutorProfile.profileImage || "");
      setQualifications(user.tutorProfile.qualifications || "");
      setCategoryIds(user.tutorProfile.categories?.map((c) => c.id) || []);
    }
  }, [user]);

  const handleCategoryToggle = (id: string) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    try {
      if (hasProfile) {
        await updateProfile(session.user.id, {
          biography: biography || undefined,
          profileImage: profileImage || undefined,
          qualifications: qualifications || undefined,
          categoryIds: categoryIds.length ? categoryIds : undefined,
        });
        toast.success("Profile updated successfully");
      } else {
        await createProfile({
          userId: session.user.id,
          biography: biography || undefined,
          profileImage: profileImage || undefined,
          qualifications: qualifications || undefined,
          categoryIds: categoryIds.length ? categoryIds : undefined,
        });
        toast.success("Profile created successfully");
      }
      refetchUser();
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    }
  };

  if (userLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
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
        <h1 className="text-3xl font-bold text-gray-900">
          {hasProfile ? "Edit" : "Create"} Tutor Profile
        </h1>
        <p className="text-gray-600 mt-1">
          {hasProfile
            ? "Update your bio, qualifications and categories."
            : "Complete your tutor profile to start receiving bookings."}
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="biography">Biography</Label>
            <textarea
              id="biography"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Tell students about your teaching experience..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileImage">Profile image URL</Label>
            <Input
              id="profileImage"
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualifications">Qualifications</Label>
            <Input
              id="qualifications"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              placeholder="e.g. PhD Mathematics, MIT"
            />
          </div>

          {!categoriesLoading && categories.length > 0 && (
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={categoryIds.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="rounded border-gray-300"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={creating || updating}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {creating || updating ? "Saving..." : hasProfile ? "Update profile" : "Create profile"}
            </Button>
            <Link href="/tutor-dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
