// app/components/InfiniteList.tsx
"use client";

import React from "react";

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

  if (initialItems.length === 0) return null;

  return (
    <>
      <div className={className}>
        {items.map((it, idx) => (
          <React.Fragment key={getKey ? getKey(it, idx) : idx}>{renderItem(it)}</React.Fragment>
        ))}
      </div>

      {/* 관찰용 센티넬 */}
      <div ref={sentinelRef} className="h-10" />

      {/* 상태 (문구 비노출) */}
      {error && (
        <p className="py-3 text-sm text-red-500">
          {errorPrefix} {error}
        </p>
      )}
      {!hasNext && null}
      {loading && null}
    </>
  );
}
