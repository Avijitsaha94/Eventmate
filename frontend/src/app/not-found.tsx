import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-8xl font-bold text-blue-100 mb-2">404</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Page not found
        </h2>
        <p className="text-gray-500 mb-6">
          The page you are looking for does not exist.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            Go home
          </Link>
          <Link
            href="/events"
            className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Browse events
          </Link>
        </div>
      </div>
    </div>
  )
}