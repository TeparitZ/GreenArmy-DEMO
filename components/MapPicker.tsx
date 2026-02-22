'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, MousePointerClick } from 'lucide-react';

interface PickedLocation {
  lat: number;
  lng: number;
  address: string;
}

interface MapPickerProps {
  onChange: (loc: PickedLocation) => void;
}

export default function MapPicker({ onChange }: MapPickerProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  const [address, setAddress] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setGeocoding(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { 'User-Agent': 'GreenArmy/1.0' } }
        );
        const data = await res.json();
        const addr: string = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setAddress(addr);
        onChange({ lat, lng, address: addr });
      } catch {
        const addr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setAddress(addr);
        onChange({ lat, lng, address: addr });
      } finally {
        setGeocoding(false);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    let mounted = true;

    const initMap = (centerLat: number, centerLng: number, zoom: number) => {
      import('leaflet').then((L) => {
        if (!mounted || !divRef.current) return;

        const map = L.map(divRef.current, { zoomControl: true }).setView(
          [centerLat, centerLng],
          zoom
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const makeIcon = () =>
          L.divIcon({
            html: `<div style="
              width:22px;height:22px;
              background:#22c55e;
              border-radius:50%;
              border:3px solid white;
              box-shadow:0 2px 10px rgba(0,0,0,0.35);
            "></div>`,
            className: '',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

        const placeMarker = (lat: number, lng: number) => {
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            const m = L.marker([lat, lng], {
              icon: makeIcon(),
              draggable: true,
            }).addTo(map);

            m.on('dragend', () => {
              const pos = m.getLatLng();
              reverseGeocode(pos.lat, pos.lng);
            });

            markerRef.current = m;
          }
          setHasSelected(true);
          reverseGeocode(lat, lng);
        };

        map.on('click', (e: L.LeafletMouseEvent) => {
          placeMarker(e.latlng.lat, e.latlng.lng);
        });

        mapRef.current = map;
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (mounted) initMap(pos.coords.latitude, pos.coords.longitude, 14);
        },
        () => {
          // denied or unavailable — fall back to Bangkok
          if (mounted) initMap(13.7563, 100.5018, 11);
        },
        { timeout: 6000 }
      );
    } else {
      initMap(13.7563, 100.5018, 11);
    }

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-2">
      {/* Hint banner */}
      {!hasSelected && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-3 py-2 rounded-xl">
          <MousePointerClick size={15} className="shrink-0" />
          กดบนแผนที่เพื่อเลือกสถานที่ หรือลากหมุดเพื่อปรับตำแหน่ง
        </div>
      )}

      {/* Map */}
      <div
        ref={divRef}
        className="w-full rounded-xl overflow-hidden border border-gray-200"
        style={{ height: '320px' }}
      />

      {/* Selected address display */}
      <div className="flex items-start gap-2 min-h-[2rem]">
        <MapPin size={15} className={`mt-0.5 shrink-0 ${hasSelected ? 'text-green-500' : 'text-gray-300'}`} />
        {!hasSelected ? (
          <span className="text-sm text-gray-300 italic">ยังไม่ได้เลือกสถานที่</span>
        ) : geocoding ? (
          <span className="text-sm text-gray-400 animate-pulse">กำลังโหลดที่อยู่...</span>
        ) : (
          <span className="text-sm text-gray-700 leading-relaxed">{address}</span>
        )}
      </div>
    </div>
  );
}
