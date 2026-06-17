export default function EventCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
      {/* Image area */}
      <div className="h-40 w-full bg-gray-200 dark:bg-gray-800" />

      <div className="p-3.5 space-y-2.5">
        {/* Category badge */}
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />

        {/* Title */}
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />

        {/* Meta rows */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-2/5 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>

        {/* Host row */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  )
}