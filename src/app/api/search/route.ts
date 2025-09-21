import { NextResponse } from "next/server";
import { haversineDistance } from "@/lib/utils/distance";
import { pharmacies } from "@/lib/pharmacies"; // or fetch from DB

export async function POST(req: Request) {
  const { medicine, userPos } = await req.json() as {
    medicine: string;
    userPos: [number, number];
  };

  // ✅ Filter pharmacies whose inventory contains the medicine
  const matches = pharmacies
    .filter(ph =>
      ph.medicines?.some(m =>
        m.toLowerCase().includes(medicine.toLowerCase())
      )
    )
    .map(ph => ({
      id: ph.id,
      name: ph.name,
      lat: ph.lat,
      lng: ph.lng,
      hours: ph.hours,
      distance: haversineDistance(userPos, [ph.lat, ph.lng])
    }))
    .sort((a, b) => a.distance - b.distance);

  // ✅ Find the closest pharmacy among matches
  const nearestId = matches.length > 0 ? matches[0].id : null;

  // ✅ Send both the list and the nearest pharmacy ID
  return NextResponse.json({
    matches,
    nearestId
  });
}
