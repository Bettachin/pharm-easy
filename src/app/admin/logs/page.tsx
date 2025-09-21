"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Log {
  id: number;
  action: string;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/home");

    async function fetchLogs() {
      const res = await fetch("/api/admin/logs");
      if (res.ok) setLogs(await res.json());
    }
    fetchLogs();
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      {/* Top bar with Back + Logout */}
      <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">Admin Dashboard – Logs</h1>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
          Logout
        </Button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Action</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="p-2 border">{log.id}</td>
              <td className="p-2 border">
                {log.user.name} ({log.user.email})
              </td>
              <td className="p-2 border">{log.action}</td>
              <td className="p-2 border">
                {new Date(log.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
