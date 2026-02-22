'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { TreePine, Users, Heart, Plus, Leaf, Navigation, Loader2 } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { EventListItem, EventStatus } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const statusFilters: { label: string; value: EventStatus | 'ALL' }[] = [
  { label: 'ทั้งหมด', value: 'ALL' },
  { label: 'กำลังรับสมัคร', value: 'UPCOMING' },
  { label: 'กำลังดำเนินการ', value: 'ONGOING' },
  { label: 'สำเร็จแล้ว', value: 'COMPLETED' },
];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type SortMode = 'latest' | 'nearest';
type GeoState = 'idle' | 'loading' | 'granted' | 'denied';

export default function HomePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [filter, setFilter] = useState<EventStatus | 'ALL'>('ALL');
  const [fetching, startFetch] = useTransition();

  const [sortMode, setSortMode] = useState<SortMode>('latest');
  const [geoState, setGeoState] = useState<GeoState>('idle');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoMsg, setGeoMsg] = useState('');

  // Fetch events when filter changes
  useEffect(() => {
    const url = filter === 'ALL' ? '/api/events' : `/api/events?status=${filter}`;
    startFetch(async () => {
      const r = await fetch(url);
      const data = await r.json();
      setEvents(Array.isArray(data) ? data : []);
    });
  }, [filter]);

  // Request user geolocation and switch to nearest sort
  const handleNearestSort = () => {
    if (sortMode === 'nearest') {
      setSortMode('latest');
      return;
    }
    if (!navigator.geolocation) {
      setGeoMsg('เบราว์เซอร์ของคุณไม่รองรับ Geolocation');
      return;
    }
    setGeoState('loading');
    setGeoMsg('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState('granted');
        setSortMode('nearest');
        setGeoMsg('');
      },
      () => {
        setGeoState('denied');
        setGeoMsg('ไม่สามารถเข้าถึงตำแหน่งได้ กรุณาอนุญาตการเข้าถึง Location');
      }
    );
  };

  // Compute sorted + annotated events
  const displayedEvents: (EventListItem & { distance?: number })[] =
    sortMode === 'nearest' && userLocation
      ? [...events]
          .map((e) => ({
            ...e,
            distance: haversine(userLocation.lat, userLocation.lng, e.lat, e.lng),
          }))
          .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
      : events;

  const totalTrees = events.reduce((s, e) => s + e.totalTrees, 0);
  const totalPeople = events.reduce((s, e) => s + e.participantCount, 0);
  const totalDonations = events.reduce((s, e) => s + e.totalDonations, 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Leaf size={14} />
            พื้นที่รวมพลังเพื่อโลกที่ดีกว่า
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            ร่วมกันปลูกป่า
            <span className="text-green-500"> เพื่อโลก</span>
            <br />
            ที่ดีกว่าของพวกเราทุกคน
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            GreenArmy คือพื้นที่ที่ใครก็ได้สามารถเริ่มหรือเข้าร่วมกิจกรรมปลูกป่า
            โปร่งใส เห็นผลลัพธ์จริง
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Link
                href="/events/create"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 transition-colors"
              >
                <Plus size={18} />
                สร้างกิจกรรมของคุณ
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 transition-colors"
              >
                <Plus size={18} />
                เริ่มต้นเลย — ฟรี
              </Link>
            )}
            <a
              href="#events"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-green-300 hover:text-green-600 transition-colors"
            >
              ดูกิจกรรมทั้งหมด
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-green-600 mb-1">
                <TreePine size={22} />
                {totalTrees.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">ต้นไม้ที่ปลูกแล้ว</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-green-600 mb-1">
                <Users size={22} />
                {totalPeople.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">อาสาสมัคร</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-green-600 mb-1">
                <Heart size={22} />
                ฿{totalDonations.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">ยอดบริจาครวม</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">กิจกรรมปลูกป่า</h2>

            {/* Nearest button */}
            <button
              onClick={handleNearestSort}
              disabled={geoState === 'loading'}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                sortMode === 'nearest'
                  ? 'bg-green-500 text-white border-green-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600'
              }`}
            >
              {geoState === 'loading' ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Navigation size={15} />
              )}
              {sortMode === 'nearest' ? 'เรียงตามระยะทาง (เปิดอยู่)' : 'เรียงตามใกล้ฉัน'}
            </button>
          </div>

          {/* Geo error message */}
          {geoMsg && (
            <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl flex items-center gap-2">
              <Navigation size={14} />
              {geoMsg}
            </p>
          )}

          {/* Status filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f.value
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Distance info bar */}
        {sortMode === 'nearest' && userLocation && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-xl mb-6">
            <Navigation size={14} className="text-green-500" />
            เรียงตามระยะทางจากตำแหน่งของคุณ ({userLocation.lat.toFixed(3)},{' '}
            {userLocation.lng.toFixed(3)})
          </div>
        )}

        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                  <div className="h-4 bg-gray-100 rounded-lg w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <TreePine size={32} className="text-green-300" />
            </div>
            <p className="text-gray-400 mb-4">ยังไม่มีกิจกรรมในหมวดนี้</p>
            {user && (
              <Link
                href="/events/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl text-sm font-medium hover:bg-green-600"
              >
                <Plus size={16} /> สร้างกิจกรรมแรก
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
              <EventCard key={event.id} event={event} distance={event.distance} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
