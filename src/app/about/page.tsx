"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Pharm-Easy Logo" width={45} height={45} />
          <h1 className="text-2xl font-bold text-blue-700">Pharm-Easy</h1>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          Home
        </Button>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center px-6 mt-12">
        <motion.h2
          className="text-4xl font-extrabold text-blue-700 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Making Access to Medicine Simple and Smart 💊
        </motion.h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Pharm-Easy helps you quickly locate nearby pharmacies that stock your needed medicines.  
          With built-in GPS detection and verified pharmacy listings, we make healthcare access faster, safer, and easier.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 mt-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-blue-700 mb-3">Our Mission</h3>
          <p className="text-gray-700 leading-relaxed">
            We aim to bridge the gap between patients and pharmacies by leveraging modern web technologies.  
            Our mission is to ensure that no one experiences delays in getting essential medicine—no matter where they are.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/about-illustration.gif"
            alt="Healthcare illustration"
            width={500}
            height={350}
            className="rounded-xl shadow-md"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-blue-50 py-16 mt-16">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold text-blue-700 mb-8">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h4 className="text-xl font-semibold mb-2">📍 GPS-Based Search</h4>
              <p className="text-gray-600">
                Automatically detects your location and shows the nearest pharmacies with your searched medicine.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h4 className="text-xl font-semibold mb-2">💊 Reliable Data</h4>
              <p className="text-gray-600">
                Pharmacies are verified to ensure you get accurate availability and opening hours.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h4 className="text-xl font-semibold mb-2">🧭 Smart Navigation</h4>
              <p className="text-gray-600">
                Integrated with OpenRouteService for accurate driving paths between you and the nearest pharmacy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t mt-12">
        © {new Date().getFullYear()} Pharm-Easy. Built with ❤️ for better healthcare access.
      </footer>
    </div>
  );
}
