import Link from 'next/link';
import { MapPin, Calendar, Users, Heart, TreePine, Navigation } from 'lucide-react';
import { EventListItem } from '@/lib/types';
import StatusBadge from './StatusBadge';

export default function EventCard({ event, distance }: { event: EventListItem; distance?: number }) {
  const dateStr = new Date(event.date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-200"
    >
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/800x450/f0fdf4/22c55e?text=GreenArmy';
          }}
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={event.status} />
        </div>
        {distance !== undefined && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-medium px-2 py-1 rounded-lg shadow-sm">
            <Navigation size={11} />
            {distance < 1 ? `${Math.round(distance * 1000)} ม.` : `${distance.toFixed(1)} กม.`}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors leading-snug">
          {event.title}
        </h3>

        <p className="text-sm text-gray-400 mb-1 flex items-center gap-1.5">
          <Calendar size={13} className="shrink-0" />
          {dateStr}
        </p>

        <p className="text-sm text-gray-400 mb-4 flex items-center gap-1.5 line-clamp-1">
          <MapPin size={13} className="shrink-0" />
          {event.address}
        </p>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>

        <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
          {event.acceptVolunteers && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Users size={13} className="text-green-400" />
              {event.participantCount} คน
            </span>
          )}
          {event.acceptDonations && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Heart size={13} className="text-green-400" />
              ฿{event.totalDonations.toLocaleString()}
            </span>
          )}
          {event.totalTrees > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <TreePine size={13} className="text-green-400" />
              {event.totalTrees.toLocaleString()} ต้น
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
