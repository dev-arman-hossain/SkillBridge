"use client";

import { useCurrentUser, useCategories, useCreateTutorProfile, useUpdateTutorProfile } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, ImageIcon, Award, BookOpen, Sparkles } from "lucide-react";
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
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-8 p-6 md:p-8">
          <div className="h-10 bg-muted rounded-xl w-1/3" />
          <div className="max-w-2xl space-y-6">
            <div className="h-32 bg-muted rounded-2xl" />
            <div className="h-24 bg-muted rounded-2xl" />
            <div className="h-24 bg-muted rounded-2xl" />
            <div className="h-40 bg-muted rounded-2xl" />
          </div>
        </div>
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
            {hasProfile ? "Edit Profile" : "Create Profile"}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            {hasProfile ? "Edit" : "Create"} Tutor Profile
          </h1>
          <p className="text-white/90 mt-2 text-lg max-w-xl">
            {hasProfile
              ? "Update your bio, qualifications, and teaching subjects."
              : "Complete your tutor profile to start receiving bookings from students."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile image */}
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ImageIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Profile Photo</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative w-24 h-24 rounded-2xl bg-muted flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-border min-w-[96px] min-h-[96px]">
                  {profileImage ? (
                    <>
                      <Image
                        src={profileImage}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                        sizes="96px"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const wrap = e.currentTarget.closest(".relative");
                          const fallback = wrap?.querySelector(".profile-initial");
                          if (fallback instanceof HTMLElement) fallback.style.display = "flex";
                        }}
                      />
                      <span className="profile-initial absolute inset-0 flex items-center justify-center text-2xl font-bold text-muted-foreground bg-muted" style={{ display: "none" }}>
                        {user?.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-muted-foreground">
                      {user?.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Label htmlFor="profileImage" className="text-foreground">Image URL</Label>
                  <Input
                    id="profileImage"
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                    className="mt-2 rounded-xl border-input bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter a direct link to your profile image. It will appear on your public tutor page.
                  </p>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">About You</h2>
              </div>
              <div className="space-y-2">
                <Label htmlFor="biography" className="text-foreground">Biography</Label>
                <textarea
                  id="biography"
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y min-h-[120px]"
                  placeholder="Tell students about your teaching experience, approach, and what makes your sessions valuable..."
                />
              </div>
            </Card>

            {/* Qualifications */}
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Qualifications</h2>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualifications" className="text-foreground">Degrees & credentials</Label>
                <Input
                  id="qualifications"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="e.g. PhD Mathematics (MIT), 10+ years teaching experience"
                  className="rounded-xl border-input bg-background"
                />
              </div>
            </Card>

            {/* Categories */}
            {!categoriesLoading && categories.length > 0 && (
              <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Teaching Subjects</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the subjects or topics you teach. Students use these to find you.
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isSelected = categoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.id)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-transparent"
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
                {categoryIds.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    {categoryIds.length} selected
                  </p>
                )}
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Link href="/tutor-dashboard" className="sm:order-2">
                <Button type="button" variant="outline" className="w-full sm:w-auto rounded-xl">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={creating || updating}
                className="flex-1 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-medium py-6 sm:py-5"
              >
                {creating || updating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin inline-block mr-2 align-middle" />
                    Saving...
                  </>
                ) : hasProfile ? (
                  "Save changes"
                ) : (
                  "Create profile"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
