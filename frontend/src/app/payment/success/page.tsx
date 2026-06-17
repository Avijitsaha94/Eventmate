'use client'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-10 max-w-md w-full text-center border border-gray-200 dark:border-gray-800">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          You have successfully joined the event. A confirmation email has been sent to you.
        </p>
        <div className="space-y-3">
          <Link
            href="/dashboard/user"
            className="block w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition text-center"
          >
            View My Events
          </Link>
          <Link
            href="/events"
            className="block w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-center"
          >
            Explore More Events
          </Link>
        </div>
      </div>
    </div>
  )
}