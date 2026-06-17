/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/axios'
import { getUser } from '@/utils/auth'
import { format } from 'date-fns'
import { MapPin, Pencil } from 'lucide-react'

export default function ProfilePage() {
  const { id } = useParams()
  const currentUser = getUser()
  const [profile, setProfile] = useState<any>(null)
  const [hostedEvents, setHostedEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'events' | 'reviews'>('events')
  const [reviews, setReviews] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get(`/api/users/${id}`)
        setProfile(profileRes.data.data)

        if (profileRes.data.data.role === 'host') {
          const eventsRes = await api.get(`/api/events/host/${id}`)
          setHostedEvents(eventsRes.data.data)
          const reviewsRes = await api.get(`/api/reviews/host/${id}`)
          setReviews(reviewsRes.data.data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
        <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
      </div>
    )
  }

  const isOwnProfile = currentUser?._id === profile._id

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Profile header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-950/40 overflow-hidden shrink-0">
              {profile.avatar ? (
                <Image src={profile.avatar} alt={profile.name} width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.name}</h1>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      profile.role === 'host'
                        ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                        : profile.role === 'admin'
                        ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                        : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {profile.role}
                  </span>
                </div>
                {isOwnProfile && (
                  <Link
                    href="/dashboard/user/settings"
                    className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <Pencil size={14} /> Edit Profile
                  </Link>
                )}
              </div>
              {profile.location && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {profile.location}
                </p>
              )}
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
              </p>
            </div>
          </div>

          {profile.bio && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              {profile.bio}
            </p>
          )}

          {profile.interests?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.interests.map((interest: string) => (
                <span
                  key={interest}
                  className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>

        {profile.role === 'host' && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{hostedEvents.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Events Hosted</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {reviews?.averageRating || 0}⭐
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{reviews?.totalReviews || 0} reviews</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                {(['events', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium capitalize transition ${
                      activeTab === tab
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {activeTab === 'events' ? (
                  hostedEvents.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                      No events hosted yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {hostedEvents.map((event: any) => (
                        <Link
                          key={event._id}
                          href={`/events/${event._id}`}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition border border-gray-200 dark:border-gray-800"
                        >
                          <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                            {event.image && (
                              <Image src={event.image} alt={event.title} width={56} height={56} className="object-cover w-full h-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{event.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full font-medium ${
                                  event.status === 'open'
                                    ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                                    : event.status === 'full'
                                    ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}
                              >
                                {event.status}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )
                ) : reviews?.reviews?.length === 0 || !reviews ? (
                  <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                    No reviews yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.reviews.map((review: any) => (
                      <div key={review._id} className="p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {review.reviewerId?.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}