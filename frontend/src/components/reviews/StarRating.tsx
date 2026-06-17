'use client'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: number
}

export default function StarRating({ rating, onChange, readonly = false, size = 20 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={readonly ? 'cursor-default' : 'cursor-pointer'}
        >
          <Star
            size={size}
            className={
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700'
            }
          />
        </button>
      ))}
    </div>
  )
}