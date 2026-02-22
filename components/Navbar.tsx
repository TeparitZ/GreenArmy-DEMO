'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Leaf, LogOut, LogIn, UserPlus, Info, Phone } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setMenuOpen(false);
  };

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setMenuOpen(false)}
      className={`text-sm font-medium transition-colors ${
        pathname === href
          ? 'text-green-600'
          : 'text-gray-600 hover:text-green-600'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-bold text-green-700 text-lg tracking-tight">GreenArmy</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('/', 'หน้าแรก')}
            {navLink('/about', 'เกี่ยวกับเรา')}
            {navLink('/contact', 'ติดต่อเรา')}
            {user && navLink('/events/create', 'สร้างกิจกรรม')}
            {user && navLink('/profile', 'โปรไฟล์ของฉัน')}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-500">
                  สวัสดี,{' '}
                  <span className="font-medium text-gray-700">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={15} />
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                >
                  <LogIn size={15} />
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
                >
                  <UserPlus size={15} />
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {navLink('/', 'หน้าแรก')}
          <div className="flex items-center gap-1.5">
            <Info size={14} className="text-gray-400" />
            {navLink('/about', 'เกี่ยวกับเรา')}
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={14} className="text-gray-400" />
            {navLink('/contact', 'ติดต่อเรา')}
          </div>
          {user && (
            <>
              <div className="block">{navLink('/events/create', 'สร้างกิจกรรม')}</div>
              <div className="block">{navLink('/profile', 'โปรไฟล์ของฉัน')}</div>
            </>
          )}
          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-500"
              >
                <LogOut size={15} /> ออกจากระบบ ({user.name})
              </button>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 text-sm text-green-600"
                >
                  <LogIn size={15} /> เข้าสู่ระบบ
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 text-sm text-green-600 font-semibold"
                >
                  <UserPlus size={15} /> สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
