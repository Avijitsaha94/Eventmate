'use client'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-10 max-w-md w-full text-center border border-gray-200 dark:border-gray-800">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          You cancelled the payment process. No charges were made.
        </p>
        <div className="space-y-3">
          <Link
            href="/events"
            className="block w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition text-center"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  )
}