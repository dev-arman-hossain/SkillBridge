"use client";

import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap, BookOpen, Loader2 } from "lucide-react";

export default function SelectRolePage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "TUTOR" | null>(
    null,
  );

  const handleRoleSelection = async (role: "STUDENT" | "TUTOR") => {
    if (!session?.user?.id) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setSelectedRole(role);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/admin/users/${session.user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      toast.success(`Role set to ${role}!`);

      setTimeout(() => {
        if (role === "STUDENT") {
          router.push("/student-dashboard");
        } else {
          router.push("/tutor-dashboard");
        }
        router.refresh();
      }, 500);
    } catch (error: any) {
      console.error("Role selection error:", error);
      toast.error(error.message || "Failed to set role");
      setIsLoading(false);
      setSelectedRole(null);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Please login to select your role
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-gray-600">
            Welcome, {session.user.name}! How would you like to use SkillBridge?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card
            className={`p-8 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-2 ${
              selectedRole === "STUDENT" ? "ring-4 ring-teal-500" : ""
            }`}
            onClick={() => !isLoading && handleRoleSelection("STUDENT")}
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-teal-600" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                I'm a Student
              </h2>

              <p className="text-gray-600 mb-6">
                Find expert tutors and book sessions to learn new skills and
                improve your knowledge
              </p>

              <div className="space-y-3 text-left mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-teal-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Browse and search tutors</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-teal-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Book tutoring sessions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-teal-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Leave reviews and ratings</p>
                </div>
              </div>

              <Button
                disabled={isLoading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-lg py-6"
              >
                {isLoading && selectedRole === "STUDENT" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Continue as Student"
                )}
              </Button>
            </div>
          </Card>

          <Card
            className={`p-8 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-2 ${
              selectedRole === "TUTOR" ? "ring-4 ring-blue-500" : ""
            }`}
            onClick={() => !isLoading && handleRoleSelection("TUTOR")}
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-blue-600" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                I'm a Tutor
              </h2>

              <p className="text-gray-600 mb-6">
                Share your expertise, teach students, and earn money by offering
                tutoring services
              </p>

              <div className="space-y-3 text-left mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Create your tutor profile</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Set your availability</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Manage your sessions</p>
                </div>
              </div>

              <Button
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-lg py-6"
              >
                {isLoading && selectedRole === "TUTOR" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Continue as Tutor"
                )}
              </Button>
            </div>
          </Card>
        </div>

        <p className="text-center text-gray-500 mt-8">
          Don't worry, you can change your role later by contacting support
        </p>
      </div>
    </div>
  );
}
