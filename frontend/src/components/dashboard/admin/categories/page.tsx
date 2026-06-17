/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'

const EVENT_TYPES = ['Concert', 'Hiking', 'Food', 'Gaming', 'Sports', 'Tech', 'Art', 'Travel', 'Other']

export default function CategoriesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/events?limit=1000')
      .then((res) => {
        const events = res.data.data.events
        const c: Record<string, number> = {}
        EVENT_TYPES.forEach((t) => (c[t] = 0))
        events.forEach((e: any) => {
          c[e.type] = (c[e.type] || 0) + 1
        })
        setCounts(c)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Event Categories</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of open events per category
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {EVENT_TYPES.map((type) => (
          <div
            key={type}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{type}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {counts[type] || 0}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">open events</p>
          </div>
        ))}
      </div>
    </div>
  )
}