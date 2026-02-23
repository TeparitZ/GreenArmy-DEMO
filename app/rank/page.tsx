'use client';

import { useEffect, useState } from 'react';
import { Trophy, Users, Heart, TreePine } from 'lucide-react';

interface ParticipantRank {
  rank: number;
  userId: string;
  name: string;
  eventCount: number;
}

interface DonorRank {
  rank: number;
  userId: string;
  name: string;
  totalAmount: number;
}

interface RankData {
  topParticipants: ParticipantRank[];
  topDonors: DonorRank[];
}

const AVATAR_COLORS = [
  'bg-green-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-orange-500',
  'bg-rose-500',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const color = getAvatarColor(name);
  const sizeClass = size === 'lg' ? 'w-14 h-14 text-xl' : size === 'md' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  return (
    <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

const MEDAL = {
  1: { emoji: '🥇', bg: 'bg-yellow-50', border: 'border-yellow-300', rankText: 'text-yellow-600', badge: 'bg-yellow-400 text-yellow-900' },
  2: { emoji: '🥈', bg: 'bg-slate-50', border: 'border-slate-300', rankText: 'text-slate-500', badge: 'bg-slate-400 text-slate-900' },
  3: { emoji: '🥉', bg: 'bg-orange-50', border: 'border-orange-200', rankText: 'text-orange-500', badge: 'bg-orange-400 text-orange-900' },
} as const;

function TopThreeCard({
  rank,
  name,
  value,
  suffix,
}: {
  rank: 1 | 2 | 3;
  name: string;
  value: number;
  suffix: string;
}) {
  const m = MEDAL[rank];
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${m.bg} ${m.border} shadow-sm`}>
      <span className="text-3xl leading-none">{m.emoji}</span>
      <Avatar name={name} size="lg" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate text-base">{name}</p>
        <p className={`text-sm font-bold ${m.rankText}`}>
          {typeof value === 'number' && suffix === 'บาท'
            ? value.toLocaleString('th-TH')
            : value.toLocaleString()}{' '}
          {suffix}
        </p>
      </div>
    </div>
  );
}

function RankListItem({
  rank,
  name,
  value,
  suffix,
}: {
  rank: number;
  name: string;
  value: number;
  suffix: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
      <span className="w-7 text-center text-sm font-bold text-gray-400 flex-shrink-0">#{rank}</span>
      <Avatar name={name} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-700 truncate text-sm">{name}</p>
      </div>
      <span className="text-sm font-semibold text-gray-500 flex-shrink-0">
        {suffix === 'บาท' ? value.toLocaleString('th-TH') : value.toLocaleString()} {suffix}
      </span>
    </div>
  );
}

function LeaderboardCard({
  title,
  subtitle,
  icon,
  iconBg,
  items,
  valueKey,
  suffix,
  emptyText,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  items: { rank: number; name: string; value: number }[];
  valueKey: string;
  suffix: string;
  emptyText: string;
}) {
  const top3 = items.filter((i) => i.rank <= 3) as { rank: 1 | 2 | 3; name: string; value: number }[];
  const rest = items.filter((i) => i.rank > 3);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className={`${iconBg} px-6 py-5`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-xs text-white/80">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {items.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Trophy className="mx-auto mb-2 opacity-30" size={36} />
            <p className="text-sm">{emptyText}</p>
          </div>
        ) : (
          <>
            {/* Top 3 */}
            <div className="space-y-2.5">
              {top3.map((item) => (
                <TopThreeCard
                  key={item.rank}
                  rank={item.rank as 1 | 2 | 3}
                  name={item.name}
                  value={item.value}
                  suffix={suffix}
                />
              ))}
            </div>

            {/* 4-10 */}
            {rest.length > 0 && (
              <div className="pt-2 border-t border-gray-100 space-y-0.5">
                {rest.map((item) => (
                  <RankListItem
                    key={item.rank}
                    rank={item.rank}
                    name={item.name}
                    value={item.value}
                    suffix={suffix}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function RankPage() {
  const [data, setData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/rank')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('โหลดข้อมูลล้มเหลว'))
      .finally(() => setLoading(false));
  }, []);

  const participantItems = (data?.topParticipants ?? []).map((p) => ({
    rank: p.rank,
    name: p.name,
    value: p.eventCount,
  }));

  const donorItems = (data?.topDonors ?? []).map((d) => ({
    rank: d.rank,
    name: d.name,
    value: d.totalAmount,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-2xl mb-4">
            <Trophy size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">กระดานผู้นำ</h1>
          <p className="text-green-100 text-base max-w-md mx-auto">
            ยกย่องผู้ที่มีส่วนร่วมปกป้องสิ่งแวดล้อมมากที่สุด
          </p>

          {/* Stats summary */}
          {data && (
            <div className="flex justify-center gap-6 mt-8">
              <div className="bg-white/10 rounded-2xl px-6 py-3 text-center">
                <div className="text-2xl font-bold">{data.topParticipants.length}</div>
                <div className="text-xs text-green-100 mt-0.5">นักกิจกรรม</div>
              </div>
              <div className="bg-white/10 rounded-2xl px-6 py-3 text-center">
                <div className="text-2xl font-bold">{data.topDonors.length}</div>
                <div className="text-xs text-green-100 mt-0.5">ผู้บริจาค</div>
              </div>
              <div className="bg-white/10 rounded-2xl px-6 py-3 text-center">
                <div className="text-2xl font-bold">
                  {data.topDonors
                    .reduce((sum, d) => sum + d.totalAmount, 0)
                    .toLocaleString('th-TH')}
                </div>
                <div className="text-xs text-green-100 mt-0.5">บาทที่บริจาครวม</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Participant Leaderboard */}
            <LeaderboardCard
              title="นักกิจกรรมยอดเยี่ยม"
              subtitle="ผู้เข้าร่วมกิจกรรมมากที่สุด"
              icon={<Users size={20} className="text-white" />}
              iconBg="bg-gradient-to-r from-green-500 to-emerald-600"
              items={participantItems}
              valueKey="eventCount"
              suffix="กิจกรรม"
              emptyText="ยังไม่มีข้อมูลการเข้าร่วมกิจกรรม"
            />

            {/* Donor Leaderboard */}
            <LeaderboardCard
              title="ผู้ใจบุญยอดเยี่ยม"
              subtitle="ผู้บริจาคเงินมากที่สุด"
              icon={<Heart size={20} className="text-white" />}
              iconBg="bg-gradient-to-r from-rose-500 to-pink-600"
              items={donorItems}
              valueKey="totalAmount"
              suffix="บาท"
              emptyText="ยังไม่มีข้อมูลการบริจาค"
            />
          </div>
        )}

        {/* Note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          <TreePine className="inline-block mr-1" size={13} />
          อัปเดตแบบเรียลไทม์ · แสดงผู้ร่วมกิจกรรมและผู้บริจาค 10 อันดับแรก
        </p>
      </div>
    </div>
  );
}
