import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 });
    }

    const { id } = await params;
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'กรุณาระบุจำนวนเงินที่ถูกต้อง' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return NextResponse.json({ error: 'ไม่พบกิจกรรมนี้' }, { status: 404 });
    }

    if (!event.acceptDonations) {
      return NextResponse.json({ error: 'กิจกรรมนี้ไม่รับบริจาค' }, { status: 400 });
    }

    await prisma.donation.create({
      data: { userId: authUser.userId, eventId: id, amount: parseFloat(amount) },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'บริจาคล้มเหลว' }, { status: 500 });
  }
}
