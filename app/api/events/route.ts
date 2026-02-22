import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { EventStatus } from '@/lib/generated/prisma/enums';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as EventStatus | null;

    const events = await prisma.event.findMany({
      where: status ? { status } : undefined,
      include: {
        organizer: { select: { id: true, name: true } },
        _count: { select: { participants: true } },
        donations: { select: { amount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date.toISOString(),
      address: e.address,
      lat: e.lat,
      lng: e.lng,
      imageUrl: e.imageUrl,
      status: e.status,
      acceptDonations: e.acceptDonations,
      acceptVolunteers: e.acceptVolunteers,
      totalTrees: e.totalTrees,
      organizerId: e.organizerId,
      organizerName: e.organizer.name,
      participantCount: e._count.participants,
      totalDonations: e.donations.reduce((sum, d) => sum + d.amount, 0),
      createdAt: e.createdAt.toISOString(),
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'โหลดข้อมูลล้มเหลว' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      date,
      address,
      lat,
      lng,
      imageUrl,
      status,
      acceptDonations,
      acceptVolunteers,
    } = body;

    if (!title || !description || !date || !address) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบ' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        address,
        lat: parseFloat(lat) || 13.7563,
        lng: parseFloat(lng) || 100.5018,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        status: status || 'UPCOMING',
        acceptDonations: Boolean(acceptDonations),
        acceptVolunteers: Boolean(acceptVolunteers),
        organizerId: authUser.userId,
      },
    });

    return NextResponse.json({ id: event.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'สร้างกิจกรรมล้มเหลว' }, { status: 500 });
  }
}
