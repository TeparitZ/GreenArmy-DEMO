'use client';

import { useState } from 'react';
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Send, CheckCircle } from 'lucide-react';

const channels = [
  {
    icon: Mail,
    label: 'อีเมล',
    value: 'hello@greenarmy.th',
    href: 'mailto:hello@greenarmy.th',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Phone,
    label: 'โทรศัพท์',
    value: '02-000-1234',
    href: 'tel:+6620001234',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: Facebook,
    label: 'Facebook',
    value: 'facebook.com/greenarmy',
    href: 'https://facebook.com/greenarmy',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@greenarmy_th',
    href: 'https://instagram.com/greenarmy_th',
    color: 'text-pink-500',
    bg: 'bg-pink-50',
  },
  {
    icon: Youtube,
    label: 'YouTube',
    value: 'youtube.com/@greenarmy',
    href: 'https://youtube.com/@greenarmy',
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  {
    icon: MapPin,
    label: 'ที่อยู่',
    value: '123 ถนนสีเขียว แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230',
    href: 'https://maps.google.com/?q=ลาดพร้าว+กรุงเทพ',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would call an API
    setSent(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Leaf size={14} />
            ติดต่อเรา
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            มีคำถาม? <span className="text-green-500">เราพร้อมช่วยเสมอ</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            ไม่ว่าจะเป็นคำถาม ข้อเสนอแนะ หรืออยากร่วมเป็นพาร์ตเนอร์
            ทีมงาน GreenArmy ยินดีรับฟังเสมอ
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Channels */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ช่องทางติดต่อ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {channels.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target={ch.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-green-200 hover:shadow-sm transition-all group"
                >
                  <div className={`w-10 h-10 ${ch.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <ch.icon size={18} className={ch.color} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">{ch.label}</p>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors break-all">
                      {ch.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Line QR */}
            <div className="mt-6 bg-green-50 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-800 mb-0.5">Line Official</p>
                <p className="text-sm text-green-700">@greenarmy</p>
                <a
                  href="https://line.me/ti/p/~@greenarmy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:underline mt-1 inline-block"
                >
                  เพิ่มเพื่อนบน Line →
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">เวลาทำการ</h3>
              <div className="space-y-1.5 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>จันทร์ – ศุกร์</span>
                  <span className="font-medium text-gray-700">9:00 – 18:00 น.</span>
                </div>
                <div className="flex justify-between">
                  <span>เสาร์</span>
                  <span className="font-medium text-gray-700">9:00 – 13:00 น.</span>
                </div>
                <div className="flex justify-between">
                  <span>อาทิตย์ / วันหยุดนักขัตฤกษ์</span>
                  <span className="font-medium text-red-400">ปิดทำการ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ส่งข้อความถึงเรา</h2>
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              {sent ? (
                <div className="text-center py-10">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">ส่งข้อความเรียบร้อย!</h3>
                  <p className="text-gray-400 text-sm">
                    ทีมงานจะติดต่อกลับภายใน 1-2 วันทำการ
                  </p>
                  <button
                    onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }}
                    className="mt-6 px-6 py-2.5 bg-green-50 text-green-600 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    ส่งข้อความอีกครั้ง
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      ชื่อ <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="สมชาย ใจดี"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800 placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      อีเมล <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800 placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      ข้อความ <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      placeholder="บอกเล่าสิ่งที่ต้องการให้เราช่วยเหลือ..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-800 placeholder-gray-300 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    <Send size={16} />
                    ส่งข้อความ
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
