/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/axios'
import { format } from 'date-fns'
import { Calendar, MapPin, Ticket } from 'lucide-react'
import ReviewForm from '@/components/reviews/ReviewForm'

export default function UserDashboard() {
  const [bookings, setBookings] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [reviewingEventId, setReviewingEventId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, paymentsRes] = await Promise.all([
          api.get('/api/bookings/my'),
          api.get('/api/payments/my'),
        ])
        setBookings(bookingsRes.data.data)
        setPayments(paymentsRes.data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const now = new Date()
  const upcomingBookings = bookings.filter(
    (b) =>
      b.eventId &&
      new Date(b.eventId.date) >= now &&
      b.eventId.status !== 'cancelled'
  )
  const pastBookings = bookings.filter(
    (b) =>
      b.eventId &&
      (new Date(b.eventId.date) < now ||
        b.eventId.status === 'completed')
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-sm text-gray-500 mb-1">Total Joined</p>
          <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-sm text-gray-500 mb-1">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">
            {upcomingBookings.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-sm text-gray-500 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-green-600">
            ৳{payments.reduce((sum: number, p: any) => sum + p.amount, 0)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="flex border-b">
          {(['upcoming', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition
                ${activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {tab} ({tab === 'upcoming' ? upcomingBookings.length : pastBookings.length})
            </button>
          ))}
        </div>

        <div className="divide-y">
          {(activeTab === 'upcoming' ? upcomingBookings : pastBookings).length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">📅</p>
              <p className="font-medium">No {activeTab} events</p>
              <Link
                href="/events"
                className="text-blue-500 text-sm hover:underline mt-2 inline-block"
              >
                Browse events
              </Link>
            </div>
          ) : (
            (activeTab === 'upcoming' ? upcomingBookings : pastBookings).map(
              (booking: any) => (
                <div key={booking._id}>
                  <div className="p-4 flex gap-4 items-start">
                    {/* Event Image */}
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      {booking.eventId?.image ? (
                        <Image
                          src={booking.eventId.image}
                          alt={booking.eventId.title}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🎪
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/events/${booking.eventId?._id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                      >
                        {booking.eventId?.title}
                      </Link>

                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {booking.eventId?.date &&
                            format(new Date(booking.eventId.date), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {booking.eventId?.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Ticket size={12} />
                          {booking.paymentStatus === 'free'
                            ? 'Free'
                            : booking.paymentStatus === 'paid'
                            ? 'Paid'
                            : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Review button for past completed events */}
                    {activeTab === 'past' &&
                      booking.eventId?.status === 'completed' && (
                        <button
                          onClick={() =>
                            setReviewingEventId(
                              reviewingEventId === booking.eventId._id
                                ? null
                                : booking.eventId._id
                            )
                          }
                          className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition shrink-0"
                        >
                          ⭐ Review
                        </button>
                      )}
                  </div>

                  {/* Review Form inline */}
                  {reviewingEventId === booking.eventId?._id && (
                    <div className="px-4 pb-4">
                      <ReviewForm
                        eventId={booking.eventId._id}
                         hostId={booking.eventId.hostId}
                        onSuccess={() => setReviewingEventId(null)}
                      />
                    </div>
                  )}
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  )
}