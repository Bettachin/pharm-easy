"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import { pharmacies } from "@/lib/pharmacies";
import { useEffect, useState } from "react";

// 🔵 Default blue icon (user location)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🟥 Red icon for pharmacies that match search
const redIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🟢 Green icon for nearest pharmacy
const greenIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ✅ Recenter map when userPos changes
function RecenterOnUser({ userPos }: { userPos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (userPos) map.setView(userPos, 15);
  }, [userPos, map]);
  return null;
}

export default function LeafletMap({
  userPos,
  results = [],
  nearestId,
}: {
  userPos: [number, number] | null;
  results?: { id: number; lat: number; lng: number; name: string; hours?: string }[];
  nearestId?: number | null;
}) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

useEffect(() => {
  async function fetchRoute() {
    if (!userPos || !nearestId) return;

    const nearest = results.find((r) => r.id === nearestId);
    if (!nearest) return;

    try {
      console.log("🗺️ Fetching ORS route...");

      const response = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_ORS_KEY
            ? process.env.NEXT_PUBLIC_ORS_KEY.startsWith("Bearer ")
              ? process.env.NEXT_PUBLIC_ORS_KEY
              : `Bearer ${process.env.NEXT_PUBLIC_ORS_KEY}`
            : "",
        },
        body: JSON.stringify({
          coordinates: [
            [userPos[1], userPos[0]], // start [lng, lat]
            [nearest.lng, nearest.lat], // end [lng, lat]
          ],
          instructions: false,
          preference: "fastest", // or "shortest"
        }),
      });

      const data = await response.json();
      console.log("ORS Response:", data);

      if (!data.features?.[0]?.geometry?.coordinates) {
        console.error("❌ No route geometry found:", data);
        setRouteCoords([]);
        return;
      }

      // ✅ Convert [lng, lat] → [lat, lng]
      const encoded = data.features[0].geometry.coordinates;
      const decoded = encoded.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
      setRouteCoords(decoded);
    } catch (error) {
      console.error("Route fetch error:", error);
      setRouteCoords([]);
    }
  }

  fetchRoute();
}, [userPos, nearestId, results]);


  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden">
      <MapContainer
        center={userPos ?? [7.1907, 125.4553]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        />

        <RecenterOnUser userPos={userPos} />

        {/* 🔵 User Location */}
        {userPos && (
          <Marker position={userPos} icon={defaultIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* 🔵 All pharmacies (default blue) */}
        {pharmacies.map((ph) => (
          <Marker key={ph.id} position={[ph.lat, ph.lng]} icon={defaultIcon}>
            <Popup>
              <b>{ph.name}</b>
              <br />
              Hours: {ph.hours}
            </Popup>
          </Marker>
        ))}

        {/* 🟥/🟢 Search results */}
        {results.map((ph) => (
          <Marker
            key={`res-${ph.id}`}
            position={[ph.lat, ph.lng]}
            icon={ph.id === nearestId ? greenIcon : redIcon}
          >
            <Popup>
              <b>{ph.name}</b>
              <br />
              <i>Has your searched medicine</i>
              {ph.hours && (
                <>
                  <br />
                  Hours: {ph.hours}
                </>
              )}
              {ph.id === nearestId && (
                <>
                  <br />
                  <b className="text-green-600">Nearest</b>
                </>
              )}
            </Popup>
          </Marker>
        ))}

        {/* 🚗 Route path (ORS or fallback) */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords as any} pathOptions={{ color: "blue", weight: 6, opacity: 0.9 }} />
        )}
      </MapContainer>
    </div>
  );
}
