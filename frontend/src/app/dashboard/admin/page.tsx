/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { Users, Calendar, Star, CreditCard } from 'lucide-react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444']

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    hosts: 0,
    events: 0,
    revenue: 0,
  })
  const [users, setUsers] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'users' | 'events'>('users')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, eventsRes, chartRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/events?limit=100'),
          api.get('/api/users/admin/chart-data'),
        ])

        const allUsers = usersRes.data.data
        const allEvents = eventsRes.data.data.events
        setChartData(chartRes.data.data)

        setUsers(allUsers)
        setEvents(allEvents)
        setStats({
          users: allUsers.filter((u: any) => u.role === 'user').length,
          hosts: allUsers.filter((u: any) => u.role === 'host').length,
          events: allEvents.length,
          revenue: 0,
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleBlockUser = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/api/users/${userId}/status`, {
        isActive: !isActive,
      })
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !isActive } : u
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await api.patch(`/api/users/${userId}/role`, { role })
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u))
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      await api.delete(`/api/events/${eventId}`)
      setEvents((prev) => prev.filter((e) => e._id !== eventId))
    } catch (error) {
      console.error(error)
    }
  }

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
        {[
          { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600' },
          { label: 'Total Hosts', value: stats.hosts, icon: Star, color: 'text-purple-600' },
          { label: 'Total Events', value: stats.events, icon: Calendar, color: 'text-green-600' },
          { label: 'Platform Revenue', value: `৳${stats.revenue}`, icon: CreditCard, color: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {chartData && (
        <div className="grid md:grid-cols-3 gap-4">
          {/* User Role Distribution Pie */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">
              Users by Role
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData.roleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  labelLine={false}
                  fontSize={11}
                >
                  {chartData.roleData.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Event Status Distribution Pie */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">
              Events by Status
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData.statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  labelLine={false}
                  fontSize={11}
                >
                  {chartData.statusData.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Events Created Per Month */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">
              New Events — 6 Months
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.eventsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" fontSize={11} stroke="#9CA3AF" />
                <YAxis fontSize={11} stroke="#9CA3AF" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="events" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="flex border-b">
          {(['users', 'events'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition
                ${activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {tab === 'users' ? `Users (${users.length})` : `Events (${events.length})`}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Role</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        disabled={user.role === 'admin'}
                        className="text-xs border rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="host">Host</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() =>
                            handleBlockUser(user._id, user.isActive)
                          }
                          className={`text-xs px-3 py-1 rounded-lg border transition ${
                            user.isActive
                              ? 'text-red-500 border-red-200 hover:bg-red-50'
                              : 'text-green-500 border-green-200 hover:bg-green-50'
                          }`}
                        >
                          {user.isActive ? 'Block' : 'Unblock'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Events Table */}
        {activeTab === 'events' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Participants</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {events.map((event: any) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                      <p className="line-clamp-1">{event.title}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{event.type}</td>
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
                    <td className="px-4 py-3 text-gray-500">
                      {event.currentParticipants}/{event.maxParticipants}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}