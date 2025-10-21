"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

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

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button onClick={() => router.push("/signup")}>Get Started</Button>
        </div>
      </header>

      {/* 🏠 Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 py-16 gap-10">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Find Medicines Fast, <br />
            Stay Healthy with <span className="text-blue-600">Pharm-Easy</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Pharm-Easy helps you quickly locate nearby pharmacies with the medicine you
            need — powered by live GPS detection and smart AI-enhanced search.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={() => router.push("/login")}>
              🔍 Search Medicines
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/about")}
            >
              ℹ️ Learn More
            </Button>
          </div>
        </motion.div>

        {/* Hero Illustration (kept your image) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex justify-center"
        >
          <Image
            src="/hero-medical.png"
            alt="Medicine search illustration"
            width={500}
            height={400}
            className="drop-shadow-lg rounded-xl"
          />
        </motion.div>
      </main>

      {/* 💡 Features Section (now using emojis) */}
      <section className="bg-white py-20 px-6 lg:px-20 text-center">
        <h3 className="text-3xl font-semibold mb-10 text-gray-800">
          Why Choose Pharm-Easy?
        </h3>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl shadow-md hover:shadow-lg transition bg-blue-50"
          >
            <div className="text-5xl mb-3">📍</div>
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              GPS-Based Search
            </h4>
            <p className="text-gray-600">
              Instantly locate the nearest pharmacies that have your required medicines
              available in stock.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl shadow-md hover:shadow-lg transition bg-blue-50"
          >
            <div className="text-5xl mb-3">💊</div>
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              Smart Medicine Info
            </h4>
            <p className="text-gray-600">
              Get instant access to dosage guidelines, side effects, and safe usage tips
              for common medications.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl shadow-md hover:shadow-lg transition bg-blue-50"
          >
            <div className="text-5xl mb-3">🔒</div>
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              Safe & Secure
            </h4>
            <p className="text-gray-600">
              Your health data is handled securely and never shared. Privacy and trust are
              our top priorities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🌐 Footer */}
      <footer className="bg-blue-700 text-white py-8 text-center">
        <p className="text-lg font-semibold mb-1">💊 Pharm-Easy © 2025</p>
        <p className="text-sm opacity-80">
          Smart Medicine Finder • Project by <b>Ctrl+Alt+Del</b> • Developed by{" "}
          <b>Zedric Abejuela</b>
        </p>
      </footer>
    </div>
  );
}
