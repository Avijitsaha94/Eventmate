/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import { format } from 'date-fns'
import StarRating from './StarRating'

interface ReviewCardProps {
  review: any
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
          {review.reviewerId?.avatar ? (
            <Image
              src={review.reviewerId.avatar}
              alt={review.reviewerId.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium text-sm">
              {review.reviewerId?.name?.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{review.reviewerId?.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {format(new Date(review.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
          <StarRating rating={review.rating} readonly size={14} />
          <p className="text-xs text-blue-500 dark:text-blue-400 mb-2 mt-1 font-medium">
            {review.eventId?.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  )
}