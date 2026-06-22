export default function PostsListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 mt-6 md:mt-7 lg:mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full rounded-[var(--radius-xl)] border-2 border-[var(--color-line)] bg-[var(--color-panel)] animate-pulse"
        >
          <div className="flex flex-col md:flex-row md:items-stretch gap-2.5 md:gap-5 lg:gap-7 p-2.5 md:p-5 lg:p-7">
            {/* 썸네일 skeleton */}
            <div className="w-full aspect-[16/9] md:w-56 md:h-36 lg:w-80 lg:h-52 rounded-[var(--radius-md)] bg-[var(--color-line)] shrink-0" />
            {/* 텍스트 skeleton */}
            <div className="flex-1 flex flex-col justify-between gap-3">
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded bg-[var(--color-line)]" />
                <div className="h-5 w-12 rounded bg-[var(--color-line)]" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-3/4 rounded bg-[var(--color-line)]" />
                <div className="h-4 w-1/2 rounded bg-[var(--color-line)]" />
              </div>
              <div className="h-4 w-24 rounded bg-[var(--color-line)]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
