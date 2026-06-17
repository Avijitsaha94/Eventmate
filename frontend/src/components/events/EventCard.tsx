import Link from 'next/link'
import Image from 'next/image'
import { IEvent } from '@/types'
import { format } from 'date-fns'
import { MapPin, Calendar, Users, } from 'lucide-react'

interface Props {
  event: IEvent
}

export default function EventCard({ event }: Props) {
  const isFree = event.fee === 0
  const isFull = event.status === 'full'

  return (
    <Link href={`/events/${event._id}`}>
      <div className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition overflow-hidden group">
        {/* Event Image */}
        <div className="relative h-40 w-full bg-gray-100">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <span className="text-4xl">🎪</span>
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isFull
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {isFull ? 'Full' : 'Open'}
            </span>
          </div>
          {/* Fee Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isFree
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {isFree ? 'Free' : `৳${event.fee}`}
            </span>
          </div>
        </div>

        {/* Event Info */}
        <div className="p-4">
          <div className="mb-1">
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
              {event.type}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-1.5 mb-2 line-clamp-1 text-sm">
            {event.title}
          </h3>

          <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{format(new Date(event.date), 'MMM dd, yyyy — h:mm a')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} />
              <span>
                {event.currentParticipants}/{event.maxParticipants} joined
              </span>
            </div>
          </div>

          {/* Host */}
          <div className="mt-3 pt-3 border-t flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
              {event.hostId?.avatar && (
                <Image
                  src={event.hostId.avatar}
                  alt={event.hostId.name}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              )}
            </div>
            <span className="text-xs text-gray-500">
              by {event.hostId?.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}