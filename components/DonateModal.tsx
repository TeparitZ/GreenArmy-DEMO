'use client';

import { useState } from 'react';
import { X, Heart } from 'lucide-react';

interface DonateModalProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const presets = [100, 300, 500, 1000];

export default function DonateModal({ eventId, eventTitle, onClose, onSuccess }: DonateModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setError('กรุณาระบุจำนวนเงินที่ถูกต้อง');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: num }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setDone(true);
        onSuccess();
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
        >
          <X size={20} />
        </button>

        {done ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-green-500 fill-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ขอบคุณมาก!</h3>
            <p className="text-gray-500 text-sm mb-6">
              คุณบริจาค <strong className="text-green-600">฿{parseFloat(amount).toLocaleString()}</strong> ให้กับ{' '}
              <strong>{eventTitle}</strong> แล้ว
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-green-500 text-white rounded-2xl font-medium hover:bg-green-600"
            >
              ปิด
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Heart size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">บริจาคให้กิจกรรม</h3>
                <p className="text-sm text-gray-400 line-clamp-1">{eventTitle}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Preset amounts */}
              <p className="text-xs text-gray-500 mb-2 font-medium">เลือกจำนวนที่ต้องการบริจาค</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(String(p))}
                    className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                      amount === String(p)
                        ? 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-200 text-gray-600 hover:border-green-300'
                    }`}
                  >
                    ฿{p}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 font-medium mb-1 block">
                  หรือกรอกจำนวนเอง (บาท)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    ฿
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !amount}
                className="w-full py-3 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'กำลังดำเนินการ...' : `บริจาค ฿${amount || '0'}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
