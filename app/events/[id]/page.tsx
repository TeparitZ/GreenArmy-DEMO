'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  TreePine,
  ExternalLink,
  Plus,
  Clock,
  Trash2,
  ArrowLeft,
  UserCircle,
} from 'lucide-react';
import { EventDetail } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/StatusBadge';
import DonateModal from '@/components/DonateModal';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
      <span className="text-sm text-gray-400">กำลังโหลดแผนที่...</span>
    </div>
  ),
});

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [joinMsg, setJoinMsg] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchEvent = useCallback(async () => {
    const res = await fetch(`/api/events/${id}`);
    if (res.ok) {
      const data = await res.json();
      setEvent(data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-100 rounded-3xl" />
          <div className="h-8 bg-gray-100 rounded-xl w-2/3" />
          <div className="h-4 bg-gray-100 rounded-xl w-1/2" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">ไม่พบกิจกรรมนี้</p>
        <Link href="/" className="text-green-600 hover:underline text-sm">
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === event.organizerId;
  const isAdmin = user?.role === 'ADMIN';
  const isJoined = event.participants.some((p) => p.userId === user?.id);
  const dateStr = new Date(event.date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const mapsUrl = `https://www.google.com/maps?q=${event.lat},${event.lng}`;

  const handleJoin = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setJoining(true);
    setJoinMsg('');
    const res = await fetch(`/api/events/${id}/join`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setJoinMsg('เข้าร่วมสำเร็จ! ขอบคุณที่มาร่วมสร้างสิ่งดีๆ 🌿');
      fetchEvent();
    } else {
      setJoinMsg(data.error);
    }
    setJoining(false);
  };

  const handleDelete = async () => {
    if (!confirm('ยืนยันการลบกิจกรรมนี้?')) return;
    setDeleting(true);
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      alert(data.error);
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> กลับ
      </Link>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden mb-6 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-72 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/800x400/f0fdf4/22c55e?text=GreenArmy';
          }}
        />
        <div className="absolute top-4 left-4">
          <StatusBadge status={event.status} />
        </div>
        {(isOwner || isAdmin) && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Title + Meta */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">{event.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar size={15} className="text-green-400" />
            {dateStr}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={15} className="text-green-400" />
            {event.address}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={15} className="text-green-400" />
            จัดโดย {event.organizerName}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-xl font-bold text-green-600 mb-1">
            <Users size={18} />
            {event.participantCount}
          </div>
          <p className="text-xs text-green-600/70">อาสาสมัคร</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-xl font-bold text-green-600 mb-1">
            <Heart size={18} />
            ฿{event.totalDonations.toLocaleString()}
          </div>
          <p className="text-xs text-green-600/70">ยอดบริจาครวม</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-xl font-bold text-green-600 mb-1">
            <TreePine size={18} />
            {event.totalTrees.toLocaleString()}
          </div>
          <p className="text-xs text-green-600/70">ต้นไม้ที่ปลูกแล้ว</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        {event.acceptVolunteers && !isOwner && (
          <button
            onClick={handleJoin}
            disabled={joining || isJoined}
            className={`flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-colors ${
              isJoined
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : 'bg-green-500 text-white hover:bg-green-600 disabled:opacity-50'
            }`}
          >
            {joining ? 'กำลังดำเนินการ...' : isJoined ? '✓ เข้าร่วมแล้ว' : 'เข้าร่วมอาสาสมัคร'}
          </button>
        )}
        {event.acceptDonations && !isOwner && (
          <button
            onClick={() => {
              if (!user) {
                router.push('/auth/login');
                return;
              }
              setShowDonate(true);
            }}
            className="flex-1 py-3.5 rounded-2xl font-semibold text-sm bg-white border border-green-300 text-green-600 hover:bg-green-50 transition-colors"
          >
            <Heart size={15} className="inline mr-1.5" />
            บริจาคเงิน
          </button>
        )}
        {isOwner && (
          <Link
            href={`/events/${id}/post-activity`}
            className="flex-1 py-3.5 rounded-2xl font-semibold text-sm bg-green-500 text-white hover:bg-green-600 transition-colors text-center"
          >
            <Plus size={15} className="inline mr-1.5" />
            โพสต์อัปเดต
          </Link>
        )}
      </div>

      {joinMsg && (
        <div
          className={`mb-6 px-4 py-3 rounded-2xl text-sm ${
            joinMsg.includes('สำเร็จ')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {joinMsg}
        </div>
      )}

      {/* Description */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">เกี่ยวกับกิจกรรม</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
      </div>

      {/* Organizer */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">
          <UserCircle size={16} className="inline mr-1.5 text-green-500" />
          ผู้จัดกิจกรรม
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
            <span className="text-green-600 font-bold text-lg">
              {event.organizerName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{event.organizerName}</p>
            <p className="text-sm text-gray-400">ผู้จัดกิจกรรม GreenArmy</p>
          </div>
          {isOwner && (
            <span className="ml-auto px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
              คุณคือผู้จัด
            </span>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">
            <MapPin size={16} className="inline mr-1.5 text-green-500" />
            สถานที่จัดกิจกรรม
          </h2>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-green-600 font-medium hover:underline bg-green-50 px-3 py-1.5 rounded-xl"
          >
            <ExternalLink size={12} />
            เปิดใน Google Maps
          </a>
        </div>

        {/* Embedded interactive map */}
        <MapView lat={event.lat} lng={event.lng} address={event.address} height={280} />

        {/* Address bar below map */}
        <div className="mt-3 flex items-start gap-2 bg-gray-50 rounded-xl px-4 py-3">
          <MapPin size={14} className="text-green-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800">{event.address}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {event.lat.toFixed(5)}, {event.lng.toFixed(5)}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      {event.activities.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-5">
            <Clock size={16} className="inline mr-1.5 text-green-500" />
            ความคืบหน้า ({event.activities.length} อัปเดต)
          </h2>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-green-100" />
            <div className="space-y-6">
              {event.activities.map((a) => (
                <div key={a.id} className="relative pl-9">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-green-100 border-2 border-green-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{a.authorName}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(a.createdAt).toLocaleDateString('th-TH', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{a.description}</p>
                    {a.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.imageUrl}
                        alt="activity"
                        className="w-full rounded-xl object-cover max-h-52 mb-3"
                      />
                    )}
                    {a.treesPlanted > 0 && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        <TreePine size={11} />
                        ปลูกแล้ว {a.treesPlanted.toLocaleString()} ต้น
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Participants */}
      {event.participants.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            <Users size={16} className="inline mr-1.5 text-green-500" />
            อาสาสมัคร ({event.participants.length} คน)
          </h2>
          <div className="flex flex-wrap gap-2">
            {event.participants.map((p) => (
              <span
                key={p.id}
                className="px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-full"
              >
                {p.userName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Donate Modal */}
      {showDonate && event && (
        <DonateModal
          eventId={event.id}
          eventTitle={event.title}
          onClose={() => setShowDonate(false)}
          onSuccess={() => {
            setShowDonate(false);
            fetchEvent();
          }}
        />
      )}
    </div>
  );
}
