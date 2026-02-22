import { Leaf, TreePine, Users, Heart, Target, Eye, Shield } from 'lucide-react';

export const metadata = {
  title: 'เกี่ยวกับเรา — GreenArmy',
  description: 'รู้จัก GreenArmy พันธกิจ วิสัยทัศน์ และทีมงานที่อยู่เบื้องหลัง',
};

const steps = [
  {
    step: '01',
    title: 'สร้างกิจกรรม',
    desc: 'ผู้จัดงานสร้างกิจกรรมปลูกป่าพร้อมระบุสถานที่บนแผนที่ เป้าหมายจำนวนต้นไม้ และช่วงเวลา',
  },
  {
    step: '02',
    title: 'เข้าร่วม / บริจาค',
    desc: 'อาสาสมัครสมัครเข้าร่วม หรือผู้สนับสนุนบริจาคเงินเพื่อช่วยซื้อต้นกล้าและอุปกรณ์',
  },
  {
    step: '03',
    title: 'ลงมือปลูก',
    desc: 'วันจัดงานทีมอาสาลงพื้นที่ปลูกป่าจริง บันทึกภาพและจำนวนต้นไม้ที่ปลูกได้',
  },
  {
    step: '04',
    title: 'รายงานผล',
    desc: 'ผู้จัดอัปเดตความคืบหน้าแบบเรียลไทม์ ผู้สนับสนุนเห็นผลลัพธ์จริงอย่างโปร่งใส',
  },
];

const values = [
  {
    icon: Target,
    title: 'มุ่งเน้นผลลัพธ์',
    desc: 'วัดผลได้จริงเป็นจำนวนต้นไม้ พื้นที่ป่า และปริมาณคาร์บอนที่ลดลง',
  },
  {
    icon: Eye,
    title: 'โปร่งใส 100%',
    desc: 'ทุกบาทของการบริจาคถูกบันทึกและรายงานสาธารณะ ไม่มีปิดบัง',
  },
  {
    icon: Shield,
    title: 'ปลอดภัยน่าเชื่อถือ',
    desc: 'ระบบตรวจสอบกิจกรรมก่อนเผยแพร่ ทีมงานดูแลคุณภาพตลอด 24 ชั่วโมง',
  },
  {
    icon: Users,
    title: 'ชุมชนแห่งการเปลี่ยนแปลง',
    desc: 'เครือข่ายอาสาสมัครทั่วประเทศที่มีใจเดียวกัน อยากเห็นโลกสีเขียว',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Leaf size={14} />
            เกี่ยวกับ GreenArmy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            เราเชื่อว่าทุกต้นไม้
            <span className="text-green-500"> คือการเปลี่ยนแปลง</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            GreenArmy เกิดขึ้นจากกลุ่มคนที่อยากเห็นโลกสีเขียว และเชื่อว่าการปลูกป่าต้องโปร่งใส
            วัดผลได้จริง และทุกคนสามารถมีส่วนร่วมได้
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-500">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="flex items-center justify-center gap-2 text-4xl font-bold mb-2">
                <TreePine size={32} />
                50,000+
              </div>
              <p className="text-green-100">ต้นไม้ที่ปลูกแล้ว</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-4xl font-bold mb-2">
                <Users size={32} />
                3,200+
              </div>
              <p className="text-green-100">อาสาสมัครที่ร่วมใจ</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-4xl font-bold mb-2">
                <Heart size={32} />
                120+
              </div>
              <p className="text-green-100">กิจกรรมที่สำเร็จแล้ว</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-5">
              <Target size={24} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">พันธกิจของเรา</h2>
            <p className="text-gray-500 leading-relaxed">
              สร้างแพลตฟอร์มที่ช่วยให้ทุกคนสามารถเริ่มต้น เข้าร่วม หรือสนับสนุนกิจกรรมปลูกป่าได้อย่างง่ายดาย
              โปร่งใส และมั่นใจได้ว่าทุกการกระทำของตนสร้างผลกระทบเชิงบวกต่อโลกจริงๆ
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-5">
              <Eye size={24} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">วิสัยทัศน์</h2>
            <p className="text-gray-500 leading-relaxed">
              ประเทศไทยมีพื้นที่ป่าไม้เพิ่มขึ้นอย่างน้อย 40% ภายในปี 2040
              โดยมีประชาชนทุกกลุ่มวัยมีส่วนร่วมในการฟื้นฟูและรักษาระบบนิเวศ
              ผ่านชุมชนอาสาสมัครที่เข้มแข็งและยั่งยืน
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">วิธีการทำงาน</h2>
            <p className="text-gray-400">ขั้นตอนง่ายๆ จากไอเดียสู่ป่าที่เขียวขจี</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-500">{s.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">ค่านิยมของเรา</h2>
          <p className="text-gray-400">หลักการที่เราใช้ดำเนินการทุกอย่าง</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-green-200 hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <v.icon size={20} className="text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
