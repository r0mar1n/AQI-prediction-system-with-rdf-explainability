import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { INDIA_CITIES, type City } from "@/data/cities";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* Fix leaflet marker icons */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* Center of India */
const INDIA_CENTER: [number, number] = [22.9734, 78.6569];

/* Bounds */
const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.4627, 68.1097],
  [35.5133, 97.3956],
];

/* Fly to selected city */
function FlyToCity({ city }: { city: City | null }) {
  const map = useMap();

  useEffect(() => {
    if (!city) return;
    map.flyTo([city.lat, city.lng], 7, { duration: 0.8 });
  }, [city, map]);

  return null;
}

export default function IndiaMapSection() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return INDIA_CITIES.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSearchTerm("");
    navigate(`/dashboard?lat=${city.lat}&lng=${city.lng}&city=${city.name}`);
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-card z-0">
      
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        minZoom={5}
        maxBounds={INDIA_BOUNDS}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        className="h-full w-full z-0"
        style={{ position: "relative", zIndex: 0 }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {INDIA_CITIES.map((city) => (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            eventHandlers={{
              click: () => handleCitySelect(city),
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{city.name}</div>
                <div>Lat: {city.lat}</div>
                <div>Lng: {city.lng}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        <FlyToCity city={selectedCity} />

      </MapContainer>

      {/* SEARCH BAR */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[400px] z-[1000]">
        <div className="bg-white/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-4">
          <input
            type="text"
            id="city-search"
            name="city"
            placeholder="🔍 Search city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />

          {searchTerm && (
            <div className="mt-3 max-h-48 overflow-y-auto text-sm border-t pt-3 space-y-1">
              {filteredCities.length === 0 ? (
                <div className="text-muted-foreground px-2">
                  No city found
                </div>
              ) : (
                filteredCities.map((city) => (
                  <div
                    key={city.name}
                    className="cursor-pointer px-3 py-2 rounded-lg hover:bg-muted transition"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}