interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-muted rounded-lg ${className}`} style={style} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-4 md:p-6">
      <div className="flex items-start justify-between">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-20 h-7 mt-3" />
      <Skeleton className="w-28 h-4 mt-2" />
    </div>
  );
}

export function RecommendationCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-5 mb-2" />
      <Skeleton className="w-full h-4 mb-1" />
      <Skeleton className="w-2/3 h-4 mb-4" />
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-14 h-5 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex gap-3">
          <Skeleton className="w-14 h-4" />
          <Skeleton className="w-14 h-4" />
        </div>
        <Skeleton className="w-16 h-4" />
      </div>
    </div>
  );
}

export function LearningProgressSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-4 md:p-6">
      <Skeleton className="w-36 h-5 mb-5" />
      <div className="space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
            <Skeleton className="w-full h-2 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-4 md:p-6">
      <Skeleton className="w-40 h-5 mb-1" />
      <Skeleton className="w-48 h-4 mb-5" />
      <div className="h-56 flex items-end gap-3 px-4">
        {[40, 65, 30, 55, 80, 90, 45].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}
