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

    if (event.organizerId !== authUser.userId) {
      return NextResponse.json({ error: 'เฉพาะเจ้าของกิจกรรมเท่านั้น' }, { status: 403 });
    }

    const { description, imageUrl, treesPlanted } = await req.json();

    if (!description) {
      return NextResponse.json({ error: 'กรุณากรอกคำอธิบาย' }, { status: 400 });
    }

    const trees = parseInt(treesPlanted) || 0;

    const [activity] = await prisma.$transaction([
      prisma.activityPost.create({
        data: {
          eventId: id,
          authorId: authUser.userId,
          description,
          imageUrl: imageUrl || null,
          treesPlanted: trees,
        },
      }),
      prisma.event.update({
        where: { id },
        data: { totalTrees: { increment: trees } },
      }),
    ]);

    return NextResponse.json({ id: activity.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'โพสต์อัปเดตล้มเหลว' }, { status: 500 });
  }
}
