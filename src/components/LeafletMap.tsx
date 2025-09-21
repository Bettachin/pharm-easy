"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import { pharmacies } from "@/lib/pharmacies";
import { useEffect, useState } from "react";

// 🔵 Default blue icon
const defaultIcon = L.icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🟥 Red icon for all pharmacies that have the searched medicine
const redIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png",
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🟢 Green icon for nearest match
const greenIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png",
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
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

  // 🔑 Fetch route from ORS when userPos & nearestId change
  useEffect(() => {
    async function fetchRoute() {
      if (!userPos || !nearestId) return;

      const nearest = results.find((r) => r.id === nearestId);
      if (!nearest) return;

      try {
        const res = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${
            process.env.NEXT_PUBLIC_ORS_KEY
          }&start=${userPos[1]},${userPos[0]}&end=${nearest.lng},${nearest.lat}`
        );
        const data = await res.json();

        const encoded = data.features[0].geometry.coordinates;
        // ORS returns coordinates as [lng, lat]; we need [lat, lng]
        const decoded = encoded.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
        setRouteCoords(decoded);
      } catch (err) {
        console.error("Route fetch error:", err);
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

        {/* 🚗 Draw the road path if available */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" weight={8} opacity={0.9} />
        )}
      </MapContainer>
    </div>
  );
}
