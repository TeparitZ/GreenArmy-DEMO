import { EventStatus } from '@/lib/types';

const config: Record<
  EventStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  UPCOMING: {
    label: 'กำลังรับสมัคร',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  ONGOING: {
    label: 'กำลังดำเนินการ',
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  COMPLETED: {
    label: 'สำเร็จแล้ว',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  },
};

export default function StatusBadge({ status }: { status: EventStatus }) {
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
