"use client";

import { useAllUsers, useUpdateUser, useDeleteUser } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Users, Shield, GraduationCap, User, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = authClient.useSession();
  const token = session?.session?.token || null;

  const { users, loading, error, refetch } = useAllUsers(token);
  const { updateUser, loading: updating } = useUpdateUser(token);
  const { deleteUser, loading: deleting } = useDeleteUser(token);

  const [editingUser, setEditingUser] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await updateUser(userId, { role: newRole as any });
      toast.success("User role updated successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

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

  const handleToggleEmailVerified = async (userId: string, currentStatus: boolean) => {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

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
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600">Error loading users: {error}</p>
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
    <div className="p-8 space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users and platform settings</p>
      </div>

  
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-3xl font-bold text-red-600">{stats.admins}</p>
            </div>
            <Shield className="w-12 h-12 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tutors</p>
              <p className="text-3xl font-bold text-teal-600">{stats.tutors}</p>
            </div>
            <GraduationCap className="w-12 h-12 text-teal-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-3xl font-bold text-green-600">{stats.students}</p>
            </div>
            <User className="w-12 h-12 text-green-500" />
          </div>
        </Card>
      </div>


      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutor Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 font-semibold">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updating || user.id === session?.user?.id}
                      className="text-sm border rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="USER">User</option>
                      <option value="STUDENT">Student</option>
                      <option value="TUTOR">Tutor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleEmailVerified(user.id, user.emailVerified)}
                      disabled={updating}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                          user.emailVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.tutorProfile ? (
                      <div className="text-green-600">
                        ✓ {user.tutorProfile.categories?.length || 0} categories
                      </div>
                    ) : (
                      <div className="text-gray-400">No profile</div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      disabled={deleting || user.id === session?.user?.id}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
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
          <div className="p-8 text-center text-gray-500">
            <p>No users found</p>
          </div>
        )}
      </Card>
    </div>
  );
}
