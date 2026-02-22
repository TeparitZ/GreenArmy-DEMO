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
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return NextResponse.json({ error: 'ไม่พบกิจกรรมนี้' }, { status: 404 });
    }

    if (!event.acceptVolunteers) {
      return NextResponse.json({ error: 'กิจกรรมนี้ไม่รับอาสาสมัคร' }, { status: 400 });
    }

    const existing = await prisma.participant.findUnique({
      where: { userId_eventId: { userId: authUser.userId, eventId: id } },
    });

    if (existing) {
      return NextResponse.json({ error: 'คุณเข้าร่วมกิจกรรมนี้แล้ว' }, { status: 400 });
    }

    await prisma.participant.create({
      data: { userId: authUser.userId, eventId: id },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'เข้าร่วมกิจกรรมล้มเหลว' }, { status: 500 });
  }
}
