"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/home");

    async function fetchUsers() {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    }
    fetchUsers();
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Button
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            ← Back
          </Button>
        <h1 className="text-2xl font-bold">Admin Dashboard – Users</h1>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
          Logout
        </Button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
