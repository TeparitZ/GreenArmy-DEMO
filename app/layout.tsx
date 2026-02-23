import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const kanit = Kanit({
  variable: '--font-kanit',
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GreenArmy — รวมพลังคน เพื่อโลกที่ดีกว่า',
  description: 'พื้นที่รวมพลังกิจกรรมปลูกป่า โปร่งใส เห็นผลลัพธ์จริง',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} antialiased min-h-screen bg-gray-50`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
