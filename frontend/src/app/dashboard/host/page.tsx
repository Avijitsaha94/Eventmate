/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/axios'
import { getUser } from '@/utils/auth'
import { format } from 'date-fns'
import { Users, Calendar, PlusCircle, TrendingUp } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

export default function HostDashboard() {
  const [events, setEvents] = useState<any[]>([])
  const [revenue, setRevenue] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming')
  const user = getUser()

  useEffect(() => {
  const fetchData = async () => {
    if (!user) return
    try {
      const [eventsRes, revenueRes, chartRes] = await Promise.all([
        api.get(`/api/events/host/${user._id}`),
        api.get('/api/payments/host/revenue'),
        api.get('/api/payments/host/revenue-chart'),
      ])
      setEvents(eventsRes.data.data)
      setRevenue(revenueRes.data.data)
      setChartData(chartRes.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [])

  const handleStatusUpdate = async (eventId: string, status: string) => {
    try {
      await api.patch(`/api/events/${eventId}/status`, { status })
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, status } : e))
      )
    } catch (error) {
      console.error(error)
    }
  }

  const now = new Date()
  const upcomingEvents = events.filter(
    (e) => new Date(e.date) >= now && e.status !== 'cancelled'
  )
  const pastEvents = events.filter(
    (e) => new Date(e.date) < now || e.status === 'completed'
  )
  const cancelledEvents = events.filter((e) => e.status === 'cancelled')

  const tabEvents =
    activeTab === 'upcoming'
      ? upcomingEvents
      : activeTab === 'past'
      ? pastEvents
      : cancelledEvents

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-sm text-gray-500 mb-1">Total Events</p>
          <p className="text-2xl font-bold text-gray-900">{events.length}</p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-sm text-gray-500 mb-1">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">
            {upcomingEvents.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ৳{revenue?.totalRevenue || 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-sm text-gray-500 mb-1">Total Participants</p>
          <p className="text-2xl font-bold text-purple-600">
            {events.reduce((sum, e) => sum + e.currentParticipants, 0)}
          </p>
        </div>
      </div>
{/* Charts */}
{chartData && (
  <div className="grid md:grid-cols-2 gap-4">
    {/* Revenue Line Chart */}
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">
        Revenue — Last 6 Months
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData.revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" fontSize={12} stroke="#9CA3AF" />
          <YAxis fontSize={12} stroke="#9CA3AF" />
          <Tooltip
            formatter={(value) => [`৳${value}`, 'Revenue']}
            contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Events by Status Bar Chart */}
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">
        Events by Status
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData.eventsByStatus}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="status" fontSize={12} stroke="#9CA3AF" />
          <YAxis fontSize={12} stroke="#9CA3AF" allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
          <Bar dataKey="count" fill="#2563EB" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)}
      {/* Create Event Button */}
      <Link
        href="/events/create"
        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-2xl font-medium hover:bg-blue-700 transition"
      >
        <PlusCircle size={18} />
        Create New Event
      </Link>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="flex border-b">
          {(['upcoming', 'past', 'cancelled'] as const).map((tab) => {
            const count =
              tab === 'upcoming'
                ? upcomingEvents.length
                : tab === 'past'
                ? pastEvents.length
                : cancelledEvents.length
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition
                  ${activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                {tab} ({count})
              </button>
            )
          })}
        </div>

        <div className="divide-y">
          {tabEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">📅</p>
              <p>No {activeTab} events</p>
            </div>
          ) : (
            tabEvents.map((event: any) => (
              <div key={event._id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/events/${event._id}`}
                      className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                    >
                      {event.title}
                    </Link>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(event.date), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {event.currentParticipants}/{event.maxParticipants}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        ৳{event.fee * event.currentParticipants}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status Badge */}
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        event.status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : event.status === 'full'
                          ? 'bg-red-100 text-red-700'
                          : event.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {event.status}
                    </span>

                    {/* Actions */}
                    {event.status === 'open' && (
                      <select
                        onChange={(e) =>
                          handleStatusUpdate(event._id, e.target.value)
                        }
                        defaultValue=""
                        className="text-xs border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled>
                          Update
                        </option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    )}

                    <Link
                      href={`/events/edit/${event._id}`}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Revenue Breakdown */}
      {revenue?.revenueByEvent?.length > 0 && (
        <div className="bg-white rounded-2xl border p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            {revenue.revenueByEvent
              .filter((r: any) => r.revenue > 0)
              .map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.event}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.participants} participants
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    ৳{item.revenue}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}