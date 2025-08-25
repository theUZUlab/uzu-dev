"use client";

import React, { useId } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

type LoadResult<T> = { items: T[]; total: number };

type InfiniteListProps<T> = {
  initialItems: T[];
  total: number;
  loadMore: (nextPage: number) => Promise<LoadResult<T>>;
  renderItem: (item: T) => React.ReactNode;
  getKey?: (item: T, index: number) => React.Key;
  className?: string;
  errorPrefix?: string;
};

export default function InfiniteList<T>({
  initialItems,
  total,
  loadMore,
  renderItem,
  getKey,
  className,
  errorPrefix = "Failed to load:",
}: InfiniteListProps<T>) {
  const { items, sentinelRef, hasNext, loading, error } = useInfiniteScroll<T>({
    initialItems,
    total,
    loadMore,
  });

  const listId = useId();
  const statusId = `${listId}-status`;

  if (initialItems.length === 0) return null;

  return (
    <>
      <div
        id={listId}
        role="feed"
        aria-busy={loading || undefined}
        aria-describedby={statusId}
        className={className}
      >
        {items.map((it, idx) => (
          <React.Fragment key={getKey ? getKey(it, idx) : idx}>{renderItem(it)}</React.Fragment>
        ))}
      </div>

      {/* 관찰용 센티넬 */}
      <div ref={sentinelRef} className="h-10" aria-hidden />

      {/* 상태 영역(보이스오버용) */}
      <p id={statusId} className="sr-only" aria-live="polite">
        {loading ? "더 불러오는 중…" : hasNext ? "더 불러올 항목이 있습니다." : "모든 항목을 불러왔습니다."}
      </p>

      {/* 오류 표시 */}
      {error && (
        <p className="py-3 text-sm text-red-500">
          {errorPrefix} {error}
        </p>
      )}
    </>
  );
}
