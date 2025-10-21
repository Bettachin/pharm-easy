"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X } from "lucide-react";

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
  const [popular] = useState<string[]>([
    "Paracetamol",
    "Ibuprofen",
    "Vitamin C",
    "Amoxicillin",
    "Cough Syrup",
  ]);

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

      // Fetch ready-made medicine info
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
    <div className="p-4 space-y-8 max-w-5xl mx-auto min-h-screen flex flex-col">
      {/* 🔝 Top bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pharm-Easy</h1>

        {/* 🍔 Hamburger menu (mobile) */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* 🧭 Navigation buttons */}
        <div className={`flex-col md:flex-row gap-2 ${menuOpen ? "flex" : "hidden"} md:flex`}>
          <Button
            variant="secondary"
            onClick={() => {
              setMenuOpen(false);
              router.push("/home/update-account");
            }}
          >
            Update Account
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setMenuOpen(false);
              handleDeleteAccount();
            }}
          >
            Delete My Account
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setMenuOpen(false);
              signOut({ callbackUrl: "/login" });
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <p className="text-lg">Welcome, {session?.user?.name} 👋</p>

      {/* 🔎 Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-2 max-w-xl w-full mx-auto"
      >
        <Input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="w-full sm:w-auto">
          Search
        </Button>
      </form>

      {/* 🗺️ Map Section */}
      <div className="w-full h-[400px] sm:h-[500px]">
        <LeafletMap userPos={userPos} results={results} nearestId={nearestId} />
      </div>

      {/* 📍 Location Request */}
      {locationDenied && (
        <div className="flex justify-center">
          <Button onClick={requestLocation} className="mt-2">
            Request Location Access
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* 🏥 Pharmacy List */}
        {results.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Nearest pharmacies with {search}
            </h2>
            <ul className="space-y-2">
              {results.map((ph) => (
                <li
                  key={ph.id}
                  className="border p-3 rounded-lg bg-white shadow-sm"
                >
                  <b>{ph.name}</b> – {ph.distance.toFixed(2)} km away (Hours: {ph.hours})
                  {ph.id === nearestId && (
                    <span className="ml-2 text-green-600 font-semibold">(Nearest)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 💊 Medicine Info */}
        {medInfo && (
          <div>
            <h2 className="text-xl font-semibold mb-2">About {search}</h2>
            <div className="border p-3 rounded-lg bg-gray-50 whitespace-pre-wrap">
              {medInfo}
            </div>
          </div>
        )}
      </div>

      {/* ⭐ Popular Medicines */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Most Popular Medicines</h2>
        <ol className="list-decimal list-inside space-y-1">
          {popular.map((med, i) => (
            <li key={i}>{med}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
