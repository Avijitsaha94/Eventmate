/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    api.get('/api/users')
      .then((res) => {
        setUsers(res.data.data)
        setFiltered(res.data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = users
    if (search) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (roleFilter) result = result.filter((u) => u.role === roleFilter)
    setFiltered(result)
  }, [search, roleFilter, users])

  const handleBlock = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/api/users/${userId}/status`, { isActive: !isActive })
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !isActive } : u
        )
      )
      toast.success(isActive ? 'User blocked' : 'User unblocked')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await api.patch(`/api/users/${userId}/role`, { role })
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u))
      )
      toast.success('Role updated')
    } catch {
      toast.error('Failed to update role')
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
          Manage Users ({filtered.length})
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
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="host">Host</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user: any) => (
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
                        className="text-xs border rounded-lg px-2 py-1 focus:outline-none bg-white"
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
                            handleBlock(user._id, user.isActive)
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}