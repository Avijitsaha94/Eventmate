/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import api from '@/lib/axios'
import { IEvent } from '@/types'
import EventCard from '@/components/events/EventCard'
import EventCardSkeleton from '@/components/events/EventCardSkeleton'
import FilterDrawer from '@/components/events/FilterDrawer'
import { Search } from 'lucide-react'


const EVENT_TYPES = [
  'All', 'Concert', 'Hiking', 'Food',
  'Gaming', 'Sports', 'Tech', 'Art', 'Travel', 'Other',
]

function EventsContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [events, setEvents] = useState<IEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    fee: searchParams.get('fee') || '',
    sort: searchParams.get('sort') || 'newest',
  })
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  const updateURL = useCallback(
    (newFilters: typeof filters, newPage: number) => {
      const params = new URLSearchParams()
      if (newFilters.search) params.set('search', newFilters.search)
      if (newFilters.type) params.set('type', newFilters.type)
      if (newFilters.location) params.set('location', newFilters.location)
      if (newFilters.fee) params.set('fee', newFilters.fee)
      if (newFilters.sort && newFilters.sort !== 'newest') params.set('sort', newFilters.sort)
      if (newPage > 1) params.set('page', String(newPage))
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname]
  )

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const params: any = { page, limit: 8 }
      if (filters.search) params.search = filters.search
      if (filters.type) params.type = filters.type
      if (filters.location) params.location = filters.location
      if (filters.fee) params.fee = filters.fee
      if (filters.sort) params.sort = filters.sort

      const res = await api.get('/api/events', { params })
      setEvents(res.data.data.events)
      setTotal(res.data.data.total)
      setTotalPages(res.data.data.totalPages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setPage(1)
    updateURL(newFilters, 1)
  }

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
    setPage(1)
    updateURL(newFilters, 1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateURL(filters, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Explore Events</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{total} events available</p>
        </div>

        {/* Search + Sort + Mobile Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
            className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>

          {/* Mobile Filter Drawer */}
          <FilterDrawer
            filters={{
              type: filters.type,
              fee: filters.fee,
              location: filters.location,
            }}
            onChange={(f) => handleFilterChange({ ...filters, ...f })}
          />
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="w-56 shrink-0 hidden md:block">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 sticky top-24">
              <h3 className="font-semibold mb-4 text-sm text-gray-900 dark:text-gray-100">Filters</h3>

              {/* Category */}
              <div className="mb-5">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Category
                </p>
                <div className="space-y-1">
                  {EVENT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        handleFilterChange({
                          ...filters,
                          type: type === 'All' ? '' : type,
                        })
                      }
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
                        (filters.type === '' && type === 'All') ||
                        filters.type === type
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee */}
              <div className="mb-5">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Price
                </p>
                <div className="space-y-1">
                  {[
                    { label: 'All', value: '' },
                    { label: 'Free', value: 'free' },
                    { label: 'Paid', value: 'paid' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        handleFilterChange({ ...filters, fee: opt.value })
                      }
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
                        filters.fee === opt.value
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Location
                </p>
                <input
                  type="text"
                  placeholder="e.g. Dhaka"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      location: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Reset */}
              {(filters.type || filters.fee || filters.location) && (
                <button
                  onClick={() =>
                    handleFilterChange({
                      search: filters.search,
                      type: '',
                      fee: '',
                      location: '',
                      sort: filters.sort,
                    })
                  }
                  className="w-full mt-4 text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                >
                  Clear filters
                </button>
              )}
            </div>
          </aside>

          {/* Events Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-lg font-medium">No events found</p>
                <p className="text-sm mt-1">Try different filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition"
                    >
                      ← Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                          page === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EventsContent />
    </Suspense>
  )
}