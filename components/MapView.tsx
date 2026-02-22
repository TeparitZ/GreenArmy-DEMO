'use client';

import { useEffect, useRef } from 'react';

interface MapViewProps {
  lat: number;
  lng: number;
  address: string;
  height?: number;
}

export default function MapView({ lat, lng, address, height = 260 }: MapViewProps) {
  const divRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    let mounted = true;

    import('leaflet').then((L) => {
      if (!mounted || !divRef.current) return;

      const map = L.map(divRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        dragging: true,
      }).setView([lat, lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: `
          <div style="
            position:relative;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <div style="
              width:28px;height:28px;
              background:#22c55e;
              border-radius:50% 50% 50% 0;
              border:3px solid white;
              box-shadow:0 3px 12px rgba(0,0,0,0.35);
              transform:rotate(-45deg);
            "></div>
          </div>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -32],
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:system-ui,sans-serif;font-size:12px;max-width:220px;line-height:1.5">${address}</div>`,
          { maxWidth: 240 }
        )
        .openPopup();

      mapRef.current = map;
    });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, address]);

  return (
    <div
      ref={divRef}
      className="w-full rounded-xl overflow-hidden border border-gray-100"
      style={{ height }}
    />
  );
}
