'use client'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

const EVENT_TYPES = ['Concert', 'Hiking', 'Food', 'Gaming', 'Sports', 'Tech', 'Art', 'Travel', 'Other']

interface FilterDrawerProps {
  filters: { type: string; fee: string; location: string }
  onChange: (filters: { type: string; fee: string; location: string }) => void
}

export default function FilterDrawer({ filters, onChange }: FilterDrawerProps) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState(filters)

  const handleApply = () => {
    onChange(local)
    setOpen(false)
  }

  const handleReset = () => {
    const reset = { type: '', fee: '', location: '' }
    setLocal(reset)
    onChange(reset)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
      >
        <SlidersHorizontal size={16} /> Filter
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
              <button onClick={() => setOpen(false)}>
                <X size={20} className="text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            <div className="mb-5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {['All', ...EVENT_TYPES].map((type) => (
                  <button
                    key={type}
                    onClick={() => setLocal({ ...local, type: type === 'All' ? '' : type })}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      (local.type === '' && type === 'All') || local.type === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Price
              </p>
              <div className="flex gap-2">
                {[
                  { label: 'All', value: '' },
                  { label: 'Free', value: 'free' },
                  { label: 'Paid', value: 'paid' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLocal({ ...local, fee: opt.value })}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      local.fee === opt.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Location
              </p>
              <input
                type="text"
                placeholder="e.g. Dhaka"
                value={local.location}
                onChange={(e) => setLocal({ ...local, location: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}