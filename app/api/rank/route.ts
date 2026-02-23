import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Top participants: group by userId, count events joined
    const participantGroups = await prisma.participant.groupBy({
      by: ['userId'],
      _count: { eventId: true },
      orderBy: { _count: { eventId: 'desc' } },
      take: 10,
    });

    const participantUserIds = participantGroups.map((p) => p.userId);
    const participantUsers = await prisma.user.findMany({
      where: { id: { in: participantUserIds } },
      select: { id: true, name: true },
    });
    const participantUserMap = Object.fromEntries(
      participantUsers.map((u) => [u.id, u.name])
    );

    const topParticipants = participantGroups.map((p, index) => ({
      rank: index + 1,
      userId: p.userId,
      name: participantUserMap[p.userId] ?? 'ไม่ทราบชื่อ',
      eventCount: p._count.eventId,
    }));

    // Top donors: group by userId, sum total donation amount
    const donationGroups = await prisma.donation.groupBy({
      by: ['userId'],
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 10,
    });

    const donorUserIds = donationGroups.map((d) => d.userId);
    const donorUsers = await prisma.user.findMany({
      where: { id: { in: donorUserIds } },
      select: { id: true, name: true },
    });
    const donorUserMap = Object.fromEntries(
      donorUsers.map((u) => [u.id, u.name])
    );

    const topDonors = donationGroups.map((d, index) => ({
      rank: index + 1,
      userId: d.userId,
      name: donorUserMap[d.userId] ?? 'ไม่ทราบชื่อ',
      totalAmount: d._sum.amount ?? 0,
    }));

    return NextResponse.json({ topParticipants, topDonors });
  } catch (error) {
    console.error('Rank API error:', error);
    return NextResponse.json({ error: 'โหลดข้อมูลล้มเหลว' }, { status: 500 });
  }
}
