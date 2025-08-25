// app/components/InfiniteList.tsx
"use client";

import React from "react";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

type LoadResult<T> = { items: T[]; total: number };

type InfiniteListProps<T> = {
  initialItems: T[];
  total: number;
  // _ 프리픽스: 미사용 경고 방지
  loadMore: (_nextPage: number) => Promise<LoadResult<T>>;
  renderItem: (_item: T) => React.ReactNode;
  getKey?: (_item: T, _index: number) => React.Key;
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

      {/* 상태 표시 (필요한 것만 노출) */}
      {loading && null}
      {error && (
        <p className="py-3 text-sm text-red-500">
          {errorPrefix} {error}
        </p>
      )}
      {!hasNext && null}
    </>
  );
}
