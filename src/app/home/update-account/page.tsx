"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

export default function UpdateAccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      setForm({
        name: session.user.name || "",
        email: session.user.email || "",
        password: "",
      });
    }
  }, [session]);

  if (!mounted) return null; // ✅ Prevent hydration mismatch

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/account/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess("✅ Account updated successfully!");
      setTimeout(() => router.push("/home"), 1500);
    } else {
      setError("❌ Failed to update account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* 🌐 Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Pharm-Easy Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <h1 className="text-2xl font-bold text-blue-700">Pharm-Easy</h1>
        </div>

        <Button variant="outline" onClick={() => router.push("/home")}>
          🏠 Back to Home
        </Button>
      </header>

      {/* ✨ Update Account Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 py-12 gap-10">
        {/* Left: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-1 justify-center"
        >
          <Image
            src="/hero-medical.png"
            alt="Update account illustration"
            width={480}
            height={380}
            className="drop-shadow-lg rounded-xl"
          />
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-w-md w-full bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            🧾 Update Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              type="text"
              placeholder="👤 Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="📧 Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="🔑 New Password (optional)"
              value={form.password}
              onChange={handleChange}
            />

            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full text-lg py-5">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/home")}
              className="w-full text-lg py-5"
            >
              Cancel
            </Button>
          </form>
        </motion.div>
      </main>

      {/* 🌐 Footer */}
      <footer className="bg-blue-700 text-white py-6 text-center">
        <p className="text-sm opacity-90">
          Pharm-Easy © 2025 • Project by <b>Ctrl+Alt+Del</b> • Developed by{" "}
          <b>Zedric Abejuela</b>
        </p>
      </footer>
    </div>
  );
}
