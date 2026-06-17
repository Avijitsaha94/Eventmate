'use client'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">⚠️</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}