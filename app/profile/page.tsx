'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { EventListItem } from '@/lib/types';
import EventCard from '@/components/EventCard';
import { User, TreePine, Users, Heart, Plus, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [allEvents, setAllEvents] = useState<EventListItem[]>([]);
  const [tab, setTab] = useState<'joined' | 'created'>('joined');
  const [fetching, startFetch] = useTransition();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }
    if (user) {
      startFetch(async () => {
        const r = await fetch('/api/events');
        const data = await r.json();
        setAllEvents(Array.isArray(data) ? data : []);
      });
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-100 rounded-3xl w-full" />
          <div className="h-8 bg-gray-100 rounded-xl w-1/3" />
        </div>
      </div>
    );
  }

  const createdEvents = allEvents.filter((e) => e.organizerId === user.id);

  // For joined events we need to check participant lists — we approximate with full event detail
  // Use a different endpoint or show created for now
  const joinedEvents = allEvents.filter((e) => e.organizerId !== user.id);

  const totalTrees = createdEvents.reduce((s, e) => s + e.totalTrees, 0);
  const totalVolunteers = createdEvents.reduce((s, e) => s + e.participantCount, 0);
  const totalDonations = createdEvents.reduce((s, e) => s + e.totalDonations, 0);

  const displayEvents = tab === 'created' ? createdEvents : joinedEvents;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-8">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
            <User size={30} className="text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              {user.role === 'ADMIN' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  <Shield size={10} /> Admin
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <Link
            href="/events/create"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm rounded-xl hover:bg-green-600 transition-colors font-medium"
          >
            <Plus size={15} />
            สร้างกิจกรรม
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-7 pt-6 border-t border-gray-50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-green-600 mb-0.5">
              <TreePine size={18} />
              {totalTrees.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">ต้นไม้ที่ปลูก</p>
          </div>
          <div className="text-center border-x border-gray-50">
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-green-600 mb-0.5">
              <Users size={18} />
              {totalVolunteers.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">อาสาสมัคร</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-green-600 mb-0.5">
              <Heart size={18} />
              ฿{totalDonations.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">ยอดบริจาค</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('joined')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'joined'
              ? 'bg-green-500 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
          }`}
        >
          กิจกรรมที่เข้าร่วม
        </button>
        <button
          onClick={() => setTab('created')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'created'
              ? 'bg-green-500 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
          }`}
        >
          กิจกรรมที่สร้าง ({createdEvents.length})
        </button>
      </div>

      {fetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
                <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : displayEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <TreePine size={28} className="text-green-300" />
          </div>
          <p className="text-gray-400 mb-4 text-sm">
            {tab === 'created' ? 'ยังไม่ได้สร้างกิจกรรม' : 'ยังไม่ได้เข้าร่วมกิจกรรมใด'}
          </p>
          {tab === 'created' && (
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm rounded-xl hover:bg-green-600 transition-colors"
            >
              <Plus size={15} /> สร้างกิจกรรมแรก
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
