"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // ✅ Prevent hydration mismatch

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Enforce exactly 8-character password
    if (form.password.length !== 8) {
      setError("Password must be exactly 8 characters long.");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.ok) {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    } else {
      setError("Invalid email or password.");
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
        <Button variant="outline" onClick={() => router.push("/")}>
          🏠 Home
        </Button>
      </header>

      {/* 💊 Login Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 py-12 gap-10">
        {/* Left: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-1 justify-center"
        >
          <Image
            src="/login-medical.png"
            alt="Medicine search illustration"
            width={480}
            height={380}
            className="drop-shadow-lg rounded-xl"
          />
        </motion.div>

        {/* Right: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-w-md w-full bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            🔐 Login to Pharm-Easy
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="🔑 Password (8 characters)"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full text-lg py-5">
              Login
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
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
