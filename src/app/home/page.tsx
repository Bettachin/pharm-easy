"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

interface PharmacyResult {
  id: number;
  name: string;
  lat: number;
  lng: number;
  hours: string;
  distance: number;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [popular] = useState(["Paracetamol", "Ibuprofen", "Vitamin C", "Amoxicillin", "Cough Syrup"]);
  const [results, setResults] = useState<PharmacyResult[]>([]);
  const [nearestId, setNearestId] = useState<number | null>(null);
  const [medInfo, setMedInfo] = useState<string>("");

  // ✅ Protect route
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role === "admin") router.push("/admin");
  }, [status, session, router]);

  // ✅ Request GPS initially
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
          setLocationDenied(false);
        },
        (err) => {
          console.error("GPS error:", err);
          setLocationDenied(true);
        }
      );
    } else {
      setLocationDenied(true);
    }
  };

  if (status === "loading") return <p className="text-center mt-8">Loading…</p>;

  // ✅ Search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPos) {
      alert("Please allow location access first.");
      return;
    }

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicine: search, userPos }),
      });
      if (!res.ok) throw new Error("Search failed");

      const { matches, nearestId }: { matches: PharmacyResult[]; nearestId: number | null } =
        await res.json();
      setResults(matches);
      setNearestId(nearestId);

      const infoRes = await fetch("/api/medicine-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicine: search }),
      });
      const infoData = await infoRes.json();
      setMedInfo(infoData.info || "No information found.");
    } catch (err) {
      console.error(err);
      alert("Error searching for medicine.");
    }
  };

  // ✅ Delete account
  const handleDeleteAccount = async () => {
    const confirmed = confirm("Are you sure you want to permanently delete your account?");
    if (!confirmed) return;

    const res = await fetch("/api/users/me", { method: "DELETE" });
    if (res.ok) {
      alert("Your account has been deleted.");
      await signOut({ callbackUrl: "/login" });
    } else {
      alert("Failed to delete your account.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* 🌐 Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Pharm-Easy Logo" width={40} height={40} className="rounded-md" />
          <h1 className="text-2xl font-bold text-blue-700">Pharm-Easy</h1>
        </div>

        <div className="flex gap-3 md:flex hidden">
          <Button variant="secondary" onClick={() => router.push("/home/update-account")}>
            ⚙️ Update Account
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            🗑️ Delete Account
          </Button>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
            🚪 Logout
          </Button>
        </div>

        {/* 🍔 Mobile Menu */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {/* 🧭 Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="flex flex-col items-center gap-2 bg-white shadow-md py-3 md:hidden">
          <Button variant="secondary" onClick={() => router.push("/home/update-account")}>
            ⚙️ Update Account
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            🗑️ Delete Account
          </Button>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
            🚪 Logout
          </Button>
        </div>
      )}

      {/* 🏠 Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-10 space-y-3"
      >
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, <span className="text-blue-600">{session?.user?.name}</span> 👋
        </h2>
        <p className="text-gray-600">
          Quickly find nearby pharmacies and get detailed information about your medicines.
        </p>
      </motion.div>

      {/* 🔍 Search Section */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 justify-center mt-8 px-6"
      >
        <Input
          type="text"
          placeholder="🔎 Search for a medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-lg"
        />
        <Button type="submit" size="lg">
          Search
        </Button>
      </form>

      {/* 🗺️ Map */}
      <div className="w-full max-w-5xl mx-auto mt-8 h-[450px] rounded-lg overflow-hidden shadow-md">
        <LeafletMap userPos={userPos} results={results} nearestId={nearestId} />
      </div>

      {/* 📍 Location Request */}
      {locationDenied && (
        <div className="flex justify-center mt-4">
          <Button onClick={requestLocation}>Request Location Access</Button>
        </div>
      )}

      {/* 🏥 Pharmacy & 💊 Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 px-6 max-w-6xl mx-auto">
        {results.length > 0 && (
          <div className="bg-white p-5 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              🏥 Nearest Pharmacies with {search}
            </h3>
            <ul className="space-y-2">
              {results.map((ph) => (
                <li key={ph.id} className="border p-3 rounded-lg bg-blue-50">
                  <b>{ph.name}</b> – {ph.distance.toFixed(2)} km away (Hours: {ph.hours})
                  {ph.id === nearestId && (
                    <span className="ml-2 text-green-600 font-semibold">✅ Nearest</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {medInfo && (
          <div className="bg-white p-5 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              💊 About {search}
            </h3>
            <div className="border p-3 rounded-lg bg-blue-50 whitespace-pre-wrap">
              {medInfo}
            </div>
          </div>
        )}
      </div>

      {/* ⭐ Popular Medicines */}
      <section className="mt-12 bg-blue-50 py-10 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          ⭐ Most Popular Medicines
        </h3>
        <ol className="list-decimal list-inside text-gray-700 max-w-sm mx-auto space-y-1 text-left">
          {popular.map((med, i) => (
            <li key={i}>{med}</li>
          ))}
        </ol>
      </section>

      {/* 🌐 Footer */}
      <footer className="bg-blue-700 text-white py-8 text-center mt-auto">
        <p className="text-lg font-semibold mb-1">Pharm-Easy © 2025</p>
        <p className="text-sm opacity-80">
          Smart Medicine Finder • Project by <b>Ctrl+Alt+Del</b> • Developed by{" "}
          <b>Zedric Abejuela</b>
        </p>
      </footer>
    </div>
  );
}
