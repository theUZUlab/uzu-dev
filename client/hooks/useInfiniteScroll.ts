// hooks/useInfiniteScroll.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type LoadResult<T> = { items: T[]; total: number };

export function useInfiniteScroll<T>({
  initialItems,
  total,
  loadMore,
}: {
  initialItems: T[];
  total: number;
  loadMore: (nextPage: number) => Promise<LoadResult<T>>;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState(1); // SSR로 1페이지 로드됨
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasNext = items.length < total;

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);

  // 최신 loadMore 유지
  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  // initialItems / total 변경 시 상태 리셋
  useEffect(() => {
    setItems(initialItems);
    setPage(1);
    setError(null);
    lockRef.current = false;
    setLoading(false);
  }, [initialItems, total]);

  const fetchNext = useCallback(async () => {
    if (!hasNext || loading || lockRef.current) return;
    lockRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const res = await loadMoreRef.current(nextPage);
      setItems((prev) => prev.concat(res.items));
      setPage(nextPage);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      lockRef.current = false;
    }
  }, [hasNext, loading, page]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) fetchNext();
      },
      { root: null, rootMargin: "120px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [fetchNext]);

  return { items, sentinelRef, hasNext, loading, error };
}
