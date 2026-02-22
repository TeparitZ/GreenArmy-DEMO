import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, name: true } },
        participants: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { joinedAt: 'desc' },
        },
        donations: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'ไม่พบกิจกรรมนี้' }, { status: 404 });
    }

    const result = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      address: event.address,
      lat: event.lat,
      lng: event.lng,
      imageUrl: event.imageUrl,
      status: event.status,
      acceptDonations: event.acceptDonations,
      acceptVolunteers: event.acceptVolunteers,
      totalTrees: event.totalTrees,
      organizerId: event.organizerId,
      organizerName: event.organizer.name,
      participantCount: event.participants.length,
      totalDonations: event.donations.reduce((sum, d) => sum + d.amount, 0),
      createdAt: event.createdAt.toISOString(),
      participants: event.participants.map((p) => ({
        id: p.id,
        userId: p.userId,
        userName: p.user.name,
        joinedAt: p.joinedAt.toISOString(),
      })),
      donations: event.donations.map((d) => ({
        id: d.id,
        userId: d.userId,
        userName: d.user.name,
        amount: d.amount,
        createdAt: d.createdAt.toISOString(),
      })),
      activities: event.activities.map((a) => ({
        id: a.id,
        authorId: a.authorId,
        authorName: a.author.name,
        description: a.description,
        imageUrl: a.imageUrl,
        treesPlanted: a.treesPlanted,
        createdAt: a.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'โหลดข้อมูลล้มเหลว' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    if (event.organizerId !== authUser.userId && authUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ลบกิจกรรมนี้' }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.activityPost.deleteMany({ where: { eventId: id } }),
      prisma.donation.deleteMany({ where: { eventId: id } }),
      prisma.participant.deleteMany({ where: { eventId: id } }),
      prisma.event.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'ลบกิจกรรมล้มเหลว' }, { status: 500 });
  }
}
