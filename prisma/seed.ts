import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.activityPost.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin GreenArmy',
      email: 'admin@greenamy.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const somchai = await prisma.user.create({
    data: {
      name: 'สมชาย ใจดี',
      email: 'somchai@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'USER',
    },
  });

  console.log('✅ Users created');

  // Create Event 1 — UPCOMING
  const event1 = await prisma.event.create({
    data: {
      title: 'ปลูกป่าชายเลน บางปู',
      description:
        'ร่วมกันปลูกป่าชายเลนเพื่อฟื้นฟูระบบนิเวศริมทะเล ณ บริเวณบางปู จ.สมุทรปราการ เราต้องการอาสาสมัครที่มีใจรักสิ่งแวดล้อม มาร่วมกันสร้างสิ่งดีๆ ให้โลกของเรา ไม่ต้องมีประสบการณ์ มาแค่มีใจก็พอ',
      date: new Date('2025-03-15T08:00:00Z'),
      address: 'บางปู จ.สมุทรปราการ',
      lat: 13.538,
      lng: 100.7866,
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      status: 'UPCOMING',
      acceptDonations: true,
      acceptVolunteers: true,
      organizerId: admin.id,
    },
  });

  await prisma.participant.create({
    data: { userId: somchai.id, eventId: event1.id },
  });

  await prisma.donation.create({
    data: { userId: somchai.id, eventId: event1.id, amount: 500 },
  });

  await prisma.activityPost.create({
    data: {
      eventId: event1.id,
      authorId: admin.id,
      description:
        'เปิดรับสมัครอาสาสมัครแล้ว! มาร่วมกันปลูกป่าชายเลนกันเถอะ ตอนนี้มีผู้สนใจเข้าร่วมกว่า 20 คนแล้ว เป้าหมายของเราคือปลูกต้นแสม 200 ต้น',
      treesPlanted: 0,
    },
  });

  // Create Event 2 — ONGOING
  const event2 = await prisma.event.create({
    data: {
      title: 'ฟื้นฟูป่าต้นน้ำ เชียงราย',
      description:
        'โครงการฟื้นฟูป่าต้นน้ำในพื้นที่ภาคเหนือ เพื่อแก้ปัญหาภัยแล้งและน้ำท่วม ร่วมกันปลูกต้นไม้พื้นเมืองกว่า 500 ต้น พื้นที่ป่าที่เคยถูกทำลายจะกลับมาเขียวขจีอีกครั้ง',
      date: new Date('2025-01-20T07:00:00Z'),
      address: 'อ.แม่ฟ้าหลวง จ.เชียงราย',
      lat: 20.0647,
      lng: 99.882,
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
      status: 'ONGOING',
      acceptDonations: true,
      acceptVolunteers: false,
      totalTrees: 350,
      organizerId: somchai.id,
    },
  });

  await prisma.donation.createMany({
    data: [
      { userId: admin.id, eventId: event2.id, amount: 2000 },
      { userId: somchai.id, eventId: event2.id, amount: 1000 },
    ],
  });

  const act2a = await prisma.activityPost.create({
    data: {
      eventId: event2.id,
      authorId: somchai.id,
      description:
        'เริ่มต้นปฏิบัติการ! ทีมงานเดินทางถึงพื้นที่แล้ว พร้อมกล้าไม้ 300 ต้น อากาศดีมาก ทุกคนพร้อมลุย',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
      treesPlanted: 150,
      createdAt: new Date('2025-01-20T07:30:00Z'),
    },
  });

  await prisma.activityPost.create({
    data: {
      eventId: event2.id,
      authorId: somchai.id,
      description:
        'วันที่ 2 ปลูกต้นไม้ได้อีก 200 ต้น! บรรยากาศดีมาก ทุกคนตั้งใจมาก เด็กๆ จากหมู่บ้านใกล้เคียงมาช่วยด้วย',
      treesPlanted: 200,
      createdAt: new Date('2025-01-21T16:00:00Z'),
    },
  });

  console.log('✅ Event 2 created', act2a.id);

  // Create Event 3 — COMPLETED
  const event3 = await prisma.event.create({
    data: {
      title: 'ปลูกป่า 1000 ต้น กาญจนบุรี',
      description:
        'กิจกรรมปลูกป่าครั้งยิ่งใหญ่ที่กาญจนบุรี ร่วมมือกันสร้างผืนป่าใหม่ให้กับประเทศไทย ปลูกต้นไม้พื้นเมืองกว่า 1,000 ต้น เพื่อคืนความสมบูรณ์ให้กับผืนดิน',
      date: new Date('2024-11-10T08:00:00Z'),
      address: 'อุทยานแห่งชาติเอราวัณ จ.กาญจนบุรี',
      lat: 14.37,
      lng: 99.12,
      imageUrl: 'https://images.unsplash.com/photo-1467767094537-a4e4d56f2e55?w=800&q=80',
      status: 'COMPLETED',
      acceptDonations: false,
      acceptVolunteers: true,
      totalTrees: 1247,
      organizerId: admin.id,
    },
  });

  await prisma.participant.create({
    data: { userId: somchai.id, eventId: event3.id },
  });

  await prisma.activityPost.createMany({
    data: [
      {
        eventId: event3.id,
        authorId: admin.id,
        description: 'ก่อนกิจกรรม: เตรียมกล้าไม้ 1,200 ต้น และอุปกรณ์สำหรับวันงาน ทีมงานพร้อมแล้ว 85 คน',
        treesPlanted: 0,
        createdAt: new Date('2024-11-08T10:00:00Z'),
      },
      {
        eventId: event3.id,
        authorId: admin.id,
        description:
          'สำเร็จแล้ว! เราปลูกต้นไม้ได้ทั้งหมด 1,247 ต้น ขอบคุณอาสาสมัครทุกคน 85 คนที่มาร่วมในวันนี้ นี่คือพลังของคนที่รวมกัน',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
        treesPlanted: 1247,
        createdAt: new Date('2024-11-10T17:00:00Z'),
      },
    ],
  });

  console.log('✅ All events seeded');
  console.log('');
  console.log('🎉 Seed complete!');
  console.log('   admin@greenamy.com  / admin123');
  console.log('   somchai@example.com / password123');
  console.log('   Events:', event1.id, event2.id, event3.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
