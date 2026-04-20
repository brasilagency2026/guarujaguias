"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const GUARUJA_CENTER: [number, number] = [-46.2565, -23.9933];

const CATEGORY_COLORS: Record<string, string> = {
  restaurante:  "#e05a3a",
  hospedagem:   "#d4a853",
  beleza:       "#c2185b",
  turismo:      "#1a7fa0",
  loja:         "#7c3aed",
  saude:        "#2d7a4a",
  cultura:      "#0a4f6e",
  servicos:     "#666",
  eventos:      "#e65100",
};

const CATEGORY_ICONS: Record<string, string> = {
  restaurante: "🍽️",
  hospedagem:  "🏨",
  beleza:      "💅",
  turismo:     "🚤",
  loja:        "🛍️",
  saude:       "🏥",
  cultura:     "🎭",
  servicos:    "⚙️",
  eventos:     "🎵",
};

interface MapProps {
  selectedCategory?: string;
  onBusinessClick?: (business: any) => void;
  className?: string;
}

export default function GuarujaMap({ selectedCategory, onBusinessClick, className }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load nearby businesses
  const nearby = useQuery(
    api.businesses.getNearby,
    userPos
      ? { lat: userPos[1], lng: userPos[0], radiusKm: 10, category: selectedCategory }
      : { lat: GUARUJA_CENTER[1], lng: GUARUJA_CENTER[0], radiusKm: 15, category: selectedCategory }
  );

  // Init map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      // OpenFreeMap tiles — free, no API key needed
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: GUARUJA_CENTER,
      zoom: 13,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", () => setMapLoaded(true));

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update business markers
  useEffect(() => {
    if (!map.current || !mapLoaded || !nearby) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    nearby.forEach((business) => {
      const color = CATEGORY_COLORS[business.category] ?? "#666";
      const icon = CATEGORY_ICONS[business.category] ?? "📍";

      // Custom marker element
      const el = document.createElement("div");
      el.className = "map-marker";
      el.innerHTML = `
        <div style="
          background: ${color};
          color: white;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(0,0,0,0.25);
          transition: transform 0.15s;
        ">
          <span style="transform: rotate(45deg); font-size: 14px">${icon}</span>
        </div>
      `;

      el.addEventListener("mouseenter", () => {
        el.querySelector("div")!.style.transform = "rotate(-45deg) scale(1.2)";
      });
      el.addEventListener("mouseleave", () => {
        el.querySelector("div")!.style.transform = "rotate(-45deg) scale(1)";
      });

      // Popup
      const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="font-family: system-ui; min-width: 160px; padding: 2px">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px">${business.name}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 6px">${business.shortDescription}</div>
            ${"distanceKm" in business
              ? `<div style="font-size: 11px; color: ${color}; font-weight: 600">${(business as any).distanceKm.toFixed(1)} km de você</div>`
              : ""}
            <a href="/guia/${business.slug}" style="
              display: block; margin-top: 8px;
              background: ${color}; color: white;
              padding: 5px 10px; border-radius: 6px;
              font-size: 12px; text-decoration: none; text-align: center;
            ">Ver detalhes →</a>
          </div>
        `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([business.lng, business.lat])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener("click", () => {
        onBusinessClick?.(business);
        popup.addTo(map.current!);
      });

      markersRef.current.push(marker);
    });
  }, [nearby, mapLoaded, onBusinessClick]);

  // Geolocate user
  const locateUser = useCallback(() => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserPos(coords);
        setLocating(false);

        map.current?.flyTo({ center: coords, zoom: 14, duration: 1500 });

        // User location marker
        if (userMarkerRef.current) userMarkerRef.current.remove();

        const el = document.createElement("div");
        el.innerHTML = `
          <div style="
            width: 20px; height: 20px;
            background: #1a7fa0;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 6px rgba(26,127,160,0.25);
          "></div>
        `;
        userMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat(coords)
          .addTo(map.current!);
      },
      () => {
        setLocating(false);
        alert("Não foi possível obter sua localização.");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Locate button */}
      <button
        onClick={locateUser}
        disabled={locating}
        style={{
          position: "absolute",
          bottom: "80px",
          right: "10px",
          background: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px 14px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          fontSize: "13px",
          fontWeight: 600,
          color: "#1a7fa0",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          zIndex: 10,
        }}
      >
        {locating ? "⟳ Localizando..." : "📍 Minha localização"}
      </button>

      {/* Business count */}
      {nearby && (
        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "white",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "13px",
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 10,
        }}>
          {nearby.length} negócios {userPos ? "próximos" : "em Guarujá"}
        </div>
      )}
    </div>
  );
}
