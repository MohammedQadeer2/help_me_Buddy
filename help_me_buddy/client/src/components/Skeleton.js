export function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-800 rounded-xl ${className}`}></div>;
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex gap-4 w-full">
      <Skeleton className="w-16 h-16 rounded-full shrink-0" />
      <div className="flex-1 space-y-3 py-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center mt-2 pt-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}