import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            EventMate
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            Find your next adventure
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}