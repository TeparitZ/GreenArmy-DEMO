'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { TreePine, ImageIcon, ArrowLeft } from 'lucide-react';

export default function PostActivityPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [eventTitle, setEventTitle] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [checkingOwner, setCheckingOwner] = useState(true);

  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [treesPlanted, setTreesPlanted] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setEventTitle(data.title ?? '');
        setIsOwner(data.organizerId === user?.id);
      })
      .finally(() => setCheckingOwner(false));
  }, [id, user]);

  if (authLoading || checkingOwner) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48 mx-auto" />
      </div>
    );
  }

  if (!user || !isOwner) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">เฉพาะเจ้าของกิจกรรมเท่านั้น</p>
        <Link href={`/events/${id}`} className="text-green-600 hover:underline text-sm">
          กลับหน้ากิจกรรม
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!description.trim()) {
      setError('กรุณากรอกคำอธิบาย');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          imageUrl: imageUrl || null,
          treesPlanted: parseInt(treesPlanted) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        router.push(`/events/${id}`);
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link
        href={`/events/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> กลับหน้ากิจกรรม
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
          <TreePine size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">โพสต์อัปเดต</h1>
          <p className="text-sm text-gray-400 line-clamp-1">{eventTitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              คำอธิบายความคืบหน้า <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              placeholder="อธิบายสิ่งที่เกิดขึ้นในวันนี้ ปัญหาที่พบ หรือความสำเร็จที่น่าภูมิใจ..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800 placeholder-gray-300 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <ImageIcon size={13} className="inline mr-1" />
              URL รูปภาพ (ไม่บังคับ)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800 placeholder-gray-300"
            />
          </div>

          {imageUrl && (
            <div className="rounded-xl overflow-hidden h-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <TreePine size={13} className="inline mr-1 text-green-500" />
              จำนวนต้นไม้ที่ปลูกในครั้งนี้ (ไม่บังคับ)
            </label>
            <div className="relative">
              <input
                type="number"
                value={treesPlanted}
                onChange={(e) => setTreesPlanted(e.target.value)}
                min="0"
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800 placeholder-gray-300"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                ต้น
              </span>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        <div className="flex gap-3">
          <Link
            href={`/events/${id}`}
            className="flex-1 py-3 text-center border border-gray-200 text-gray-600 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'กำลังโพสต์...' : 'โพสต์อัปเดต'}
          </button>
        </div>
      </form>
    </div>
  );
}
