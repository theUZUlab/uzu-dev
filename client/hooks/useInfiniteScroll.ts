// hooks/useInfiniteScroll.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useInfiniteScroll<T>({
  initialItems,
  total,
  loadMore,
}: {
  initialItems: T[];
  total: number;
  // _ 프리픽스: 타입 위치의 매개변수 이름에도 적용
  loadMore: (_nextPage: number) => Promise<{ items: T[]; total: number }>;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState(1); // 1페이지 로드 완료
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasNext = items.length < total;
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);

  // 최신 loadMore 참조 유지
  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

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
