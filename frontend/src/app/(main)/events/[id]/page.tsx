/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/axios'
import { IEvent, IBooking } from '@/types'
import { getUser } from '@/utils/auth'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react'
import ReviewsSection from '@/components/reviews/ReviewsSection'
import EventCard from '@/components/events/EventCard'

export default function EventDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const user = getUser()

  const [event, setEvent] = useState<IEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [myBookings, setMyBookings] = useState<IBooking[]>([])
  const [relatedEvents, setRelatedEvents] = useState<IEvent[]>([])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`)
        setEvent(res.data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchEvent()
  }, [id])

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!user) return
      try {
        const res = await api.get('/api/bookings/my')
        setMyBookings(res.data.data)
      } catch {}
    }
    fetchMyBookings()
  }, [user])

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await api.get(`/api/events/${id}/related`)
        setRelatedEvents(res.data.data)
      } catch {}
    }
    if (id) fetchRelated()
  }, [id])

  const isJoined = myBookings.some(
    (b) => String(b.eventId._id) === String(id) && b.status === 'confirmed'
  )

  const handleJoin = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    if (!event) return

    if (event.fee > 0) {
      try {
        setJoining(true)
        const res = await api.post('/api/payments/create-intent', { eventId: id })
        window.location.href = res.data.data.gatewayUrl
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to start payment')
        setJoining(false)
      }
      return
    }

    try {
      setJoining(true)
      await api.post(`/api/bookings/${id}/join`)
      toast.success('Successfully joined the event!')
      const res = await api.get(`/api/events/${id}`)
      setEvent(res.data.data)
      const bookingsRes = await api.get('/api/bookings/my')
      setMyBookings(bookingsRes.data.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join event')
    } finally {
      setJoining(false)
    }
  }

  const handleLeave = async () => {
    try {
      setJoining(true)
      await api.post(`/api/bookings/${id}/leave`)
      toast.success('You have left the event')
      const res = await api.get(`/api/events/${id}`)
      setEvent(res.data.data)
      const bookingsRes = await api.get('/api/bookings/my')
      setMyBookings(bookingsRes.data.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to leave event')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">Event not found</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/events"
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Back to events
        </Link>

        {/* Image */}
        <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-800">
          {event.image ? (
            <Image src={event.image} alt={event.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/40 dark:to-purple-950/40">
              <Calendar size={48} className="text-blue-300 dark:text-blue-700" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow text-gray-900 dark:text-gray-100">
              {event.type}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{event.title}</h1>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Calendar size={18} className="text-blue-500 dark:text-blue-400" />
                <span className="text-sm">{format(new Date(event.date), 'MMMM dd, yyyy — h:mm a')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <MapPin size={18} className="text-blue-500 dark:text-blue-400" />
                <span className="text-sm">{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Users size={18} className="text-blue-500 dark:text-blue-400" />
                <span className="text-sm">
                  {event.currentParticipants}/{event.maxParticipants} participants
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">About this event</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <ReviewsSection hostId={event.hostId._id} eventId={event._id} eventStatus={event.status} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {event.fee === 0 ? 'Free' : `৳${event.fee}`}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">per person</p>

              {event.status === 'full' && !isJoined ? (
                <p className="text-center text-sm text-red-500 dark:text-red-400 font-medium py-2">
                  Event is full
                </p>
              ) : event.status === 'completed' ? (
                <p className="text-center text-sm text-gray-400 dark:text-gray-500 font-medium py-2">
                  Event completed
                </p>
              ) : event.status === 'cancelled' ? (
                <p className="text-center text-sm text-gray-400 dark:text-gray-500 font-medium py-2">
                  Event cancelled
                </p>
              ) : isJoined ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium justify-center py-2">
                    ✅ You&apos;re going
                  </div>
                  <button
                    onClick={handleLeave}
                    disabled={joining}
                    className="w-full border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
                  >
                    {joining ? 'Leaving...' : 'Leave Event'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {joining ? 'Please wait...' : event.fee === 0 ? 'Join Event' : 'Join & Pay'}
                </button>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Hosted by</h3>
              <Link href={`/profile/${event.hostId._id}`} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                  {event.hostId.avatar ? (
                    <Image src={event.hostId.avatar} alt={event.hostId.name} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium">
                      {event.hostId.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{event.hostId.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{event.hostId.location}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Similar Events You Might Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedEvents.map((relEvent) => (
                <EventCard key={relEvent._id} event={relEvent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}