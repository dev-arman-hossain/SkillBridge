"use client";

import { useAllUsers, useUpdateUser, useDeleteUser } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, Shield, GraduationCap, User, Trash2, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = authClient.useSession();

  const { users, loading, error, refetch } = useAllUsers();
  const { updateUser, loading: updating } = useUpdateUser();
  const { deleteUser, loading: deleting } = useDeleteUser();

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUser(userId, { role: newRole as any });
      toast.success("User role updated successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      await deleteUser(userId);
      toast.success("User deleted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const handleToggleEmailVerified = async (
    userId: string,
    currentStatus: boolean,
  ) => {
    try {
      await updateUser(userId, { emailVerified: !currentStatus });
      toast.success("Email verification status updated!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update verification status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-8 p-6 md:p-8">
          <div className="h-10 bg-muted rounded-xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-muted rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 border-border bg-card text-center rounded-2xl shadow-sm">
          <p className="text-destructive font-medium mb-2">Error loading users</p>
          <p className="text-muted-foreground text-sm mb-6">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="rounded-xl">
            Try again
          </Button>
        </Card>
      </div>
    );
  }

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    tutors: users.filter((u) => u.role === "TUTOR").length,
    students: users.filter((u) => u.role === "STUDENT").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-900 text-white py-10 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
        <div className="relative container mx-auto px-4 md:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white/95 mb-4">
            <Sparkles className="w-4 h-4" />
            Admin Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            User Management
          </h1>
          <p className="text-white/90 mt-2 text-lg">
            Manage users, roles, and platform settings.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{stats.total}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
            </Card>
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{stats.admins}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/15">
                  <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </Card>
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tutors</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{stats.tutors}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/15">
                  <GraduationCap className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </Card>
            <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Students</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{stats.students}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/15">
                  <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* User table */}
          <Card className="border-border bg-card text-card-foreground rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">User Management</h2>
              <p className="text-sm text-muted-foreground mt-1">Change roles and manage accounts.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tutor Profile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{user.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updating || user.id === session?.user?.id}
                          className="text-sm rounded-lg border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <option value="USER">User</option>
                          <option value="STUDENT">Student</option>
                          <option value="TUTOR">Tutor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleToggleEmailVerified(user.id, user.emailVerified)
                          }
                          disabled={updating}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              user.emailVerified
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            }`}
                          >
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.tutorProfile ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            ✓ {user.tutorProfile.categories?.length || 0} categories
                          </span>
                        ) : (
                          <span className="text-muted-foreground">No profile</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={deleting || user.id === session?.user?.id}
                          className="rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No users found.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
