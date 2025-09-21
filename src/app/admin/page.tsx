"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Protect the page: only admins can enter
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/home");
  }, [status, session, router]);

  if (status === "loading") return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
          Logout
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Users Section */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/admin/users")}
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Manage Users</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            View all registered users, check their roles, and manage accounts.
          </CardContent>
        </Card>

        {/* Logs Section */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/admin/logs")}
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold">View Logs</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            Review login and signup activity across the system.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
