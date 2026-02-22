import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
                <Leaf size={20} className="text-white" />
              </div>
              <span className="font-bold text-green-700 text-xl tracking-tight">GreenArmy</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              พื้นที่รวมพลังกิจกรรมปลูกป่า โปร่งใส เห็นผลลัพธ์จริง
              ไม่เน้นธุรกิจ ไม่เน้นกำไร เน้นผลกระทบ
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/greenarmy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Facebook size={17} />
              </a>
              <a
                href="https://instagram.com/greenarmy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition-colors"
              >
                <Instagram size={17} />
              </a>
              <a
                href="https://youtube.com/@greenarmy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Youtube size={17} />
              </a>
              {/* Line icon as SVG (lucide has no Line icon) */}
              <a
                href="https://line.me/ti/p/~@greenarmy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Line"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">เมนูหลัก</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'หน้าแรก' },
                { href: '/about', label: 'เกี่ยวกับเรา' },
                { href: '/contact', label: 'ติดต่อเรา' },
                { href: '/events/create', label: 'สร้างกิจกรรม' },
                { href: '/auth/register', label: 'สมัครสมาชิก' },
                { href: '/auth/login', label: 'เข้าสู่ระบบ' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-green-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mission */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">พันธกิจ</h3>
            <ul className="space-y-3 text-sm text-gray-500 leading-relaxed">
              <li>ปลูกป่าเพื่อลดโลกร้อน</li>
              <li>สร้างความโปร่งใสในการบริจาค</li>
              <li>เชื่อมโยงอาสาสมัครทั่วประเทศ</li>
              <li>ติดตามผลลัพธ์จริงแบบเรียลไทม์</li>
              <li>ส่งเสริมจิตสำนึกรักษ์สิ่งแวดล้อม</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">ติดต่อเรา</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@greenarmy.th"
                  className="flex items-start gap-2.5 text-sm text-gray-500 hover:text-green-600 transition-colors"
                >
                  <Mail size={15} className="shrink-0 mt-0.5 text-green-400" />
                  hello@greenarmy.th
                </a>
              </li>
              <li>
                <a
                  href="tel:+6620001234"
                  className="flex items-start gap-2.5 text-sm text-gray-500 hover:text-green-600 transition-colors"
                >
                  <Phone size={15} className="shrink-0 mt-0.5 text-green-400" />
                  02-000-1234
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-gray-500">
                  <MapPin size={15} className="shrink-0 mt-0.5 text-green-400" />
                  <span>123 ถนนสีเขียว แขวงลาดพร้าว<br />เขตลาดพร้าว กรุงเทพฯ 10230</span>
                </div>
              </li>
            </ul>

            <div className="mt-5 p-3 bg-green-50 rounded-xl">
              <p className="text-xs text-green-700 font-medium mb-1">เวลาทำการ</p>
              <p className="text-xs text-green-600">จันทร์ – ศุกร์: 9:00 – 18:00 น.</p>
              <p className="text-xs text-green-600">เสาร์: 9:00 – 13:00 น.</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} GreenArmy. สงวนลิขสิทธิ์.
          </p>
          <p className="text-xs text-gray-300">
            ไม่เน้นธุรกิจ · ไม่เน้นกำไร · เน้นผลกระทบ
          </p>
        </div>
      </div>
    </footer>
  );
}
