export function CardSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-2xl border bg-white p-5 space-y-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}