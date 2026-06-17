/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/axios'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    api.get('/api/events?limit=100')
      .then((res) => {
        setEvents(res.data.data.events)
        setFiltered(res.data.data.events)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = events
    if (search) {
      result = result.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter) result = result.filter((e) => e.status === statusFilter)
    setFiltered(result)
  }, [search, statusFilter, events])

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      await api.delete(`/api/events/${eventId}`)
      setEvents((prev) => prev.filter((e) => e._id !== eventId))
      toast.success('Event deleted')
    } catch {
      toast.error('Failed to delete event')
    }
  }

  const handleStatusChange = async (eventId: string, status: string) => {
    try {
      await api.patch(`/api/events/${eventId}/status`, { status })
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, status } : e))
      )
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-white rounded-xl border animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Manage Events ({filtered.length})
        </h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="full">Full</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Host</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Participants</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No events found
                  </td>
                </tr>
              ) : (
                filtered.map((event: any) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 max-w-xs">
                      <Link
                        href={`/events/${event._id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                      >
                        {event.title}
                      </Link>
                      <p className="text-xs text-gray-400">{event.type}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {event.hostId?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {format(new Date(event.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {event.currentParticipants}/{event.maxParticipants}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {event.status === 'open' && (
                          <button
                            onClick={() =>
                              handleStatusChange(event._id, 'cancelled')
                            }
                            className="text-xs text-amber-500 border border-amber-200 px-2 py-1 rounded-lg hover:bg-amber-50 transition"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}