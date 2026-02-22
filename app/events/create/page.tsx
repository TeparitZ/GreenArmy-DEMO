'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, ImageIcon, MapPin, Calendar } from 'lucide-react';

// Load map only on client side (no SSR)
const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
      <span className="text-sm text-gray-400">กำลังโหลดแผนที่...</span>
    </div>
  ),
});

const statusOptions = [
  { value: 'UPCOMING', label: 'กำลังรับสมัคร' },
  { value: 'ONGOING', label: 'กำลังดำเนินการ' },
  { value: 'COMPLETED', label: 'สำเร็จแล้ว' },
];

interface FormState {
  title: string;
  description: string;
  date: string;
  address: string;
  lat: number | null;
  lng: number | null;
  imageUrl: string;
  status: string;
  acceptDonations: boolean;
  acceptVolunteers: boolean;
}

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    date: '',
    address: '',
    lat: null,
    lng: null,
    imageUrl: '',
    status: 'UPCOMING',
    acceptDonations: false,
    acceptVolunteers: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMapChange = useCallback(
    (loc: { lat: number; lng: number; address: string }) => {
      setForm((prev) => ({ ...prev, lat: loc.lat, lng: loc.lng, address: loc.address }));
    },
    []
  );

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">กรุณาเข้าสู่ระบบก่อน</p>
      </div>
    );
  }

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.date) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบ');
      return;
    }

    if (form.lat === null || form.lng === null || !form.address) {
      setError('กรุณาเลือกสถานที่จัดกิจกรรมบนแผนที่');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        router.push(`/events/${data.id}`);
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
          <Leaf size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">สร้างกิจกรรมปลูกป่า</h1>
          <p className="text-sm text-gray-400">ชวนคนมาร่วมสร้างผลกระทบด้วยกัน</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">ข้อมูลกิจกรรม</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ชื่อกิจกรรม <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
              maxLength={120}
              placeholder="เช่น ปลูกป่าชายเลน บางปู ครั้งที่ 3"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800 placeholder-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              คำอธิบาย <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
              rows={4}
              placeholder="อธิบายกิจกรรม เป้าหมาย และสิ่งที่อาสาสมัครจะได้ทำ..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800 placeholder-gray-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Calendar size={13} className="inline mr-1" />
                วันที่จัดกิจกรรม <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">สถานะ</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800 bg-white"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location — Map Picker */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-green-500" />
            <h2 className="font-semibold text-gray-800">สถานที่จัดกิจกรรม</h2>
            <span className="text-red-400 text-sm">*</span>
          </div>
          <p className="text-xs text-gray-400 -mt-2">
            กดบนแผนที่เพื่อปักหมุด ระบบจะดึงที่อยู่ให้อัตโนมัติ
          </p>

          <MapPicker onChange={handleMapChange} />

          {/* Show coordinates after selection */}
          {form.lat !== null && form.lng !== null && (
            <div className="flex gap-4 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-xl">
              <span>Lat: {form.lat.toFixed(5)}</span>
              <span>Lng: {form.lng.toFixed(5)}</span>
            </div>
          )}
        </div>

        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">
            <ImageIcon size={16} className="inline mr-1.5 text-green-500" />
            รูปภาพปก
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL รูปภาพ</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800 placeholder-gray-300"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              แนะนำใช้รูปจาก Unsplash (หากไม่กรอก จะใช้รูปค่าเริ่มต้น)
            </p>
          </div>
          {form.imageUrl && (
            <div className="rounded-xl overflow-hidden h-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imageUrl}
                alt="preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">ตัวเลือกการรับสมัคร</h2>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.acceptVolunteers}
                onChange={(e) => set('acceptVolunteers', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-green-500"
              />
              <div>
                <span className="font-medium text-gray-800 text-sm">รับอาสาสมัคร</span>
                <p className="text-xs text-gray-400 mt-0.5">
                  ให้ผู้ใช้กดลงทะเบียนเข้าร่วมกิจกรรมได้
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.acceptDonations}
                onChange={(e) => set('acceptDonations', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-green-500"
              />
              <div>
                <span className="font-medium text-gray-800 text-sm">รับบริจาคเงิน</span>
                <p className="text-xs text-gray-400 mt-0.5">
                  เปิดให้ผู้สนับสนุนบริจาคเพื่อกิจกรรมนี้ได้
                </p>
              </div>
            </label>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'กำลังสร้าง...' : 'สร้างกิจกรรม'}
          </button>
        </div>
      </form>
    </div>
  );
}
