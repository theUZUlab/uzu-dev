"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type LoadResult<T> = { items: T[]; total: number };

/**
 * SSR에서 1페이지를 받은 상태를 기준으로, sentinel가 보이면 다음 페이지를 로드합니다.
 * - API 시그니처는 그대로 유지합니다.
 */
export function useInfiniteScroll<T>({
  initialItems,
  total,
  loadMore,
  dedupeKey,
}: {
  initialItems: T[];
  total: number;
  loadMore: (nextPage: number) => Promise<LoadResult<T>>;
  dedupeKey?: (item: T) => React.Key;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState(1); // SSR로 1페이지 로드됨
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasNext = items.length < total;

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);

  // page/hasNext를 ref로도 유지 — fetchNext deps에서 제거해 Observer 재연결 방지
  const pageRef = useRef(page);
  pageRef.current = page;
  const hasNextRef = useRef(hasNext);
  hasNextRef.current = hasNext;

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
    if (!hasNextRef.current || lockRef.current) return;
    lockRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const nextPage = pageRef.current + 1;
      const res = await loadMoreRef.current(nextPage);
      setItems((prev) => {
        if (!dedupeKey) return prev.concat(res.items);
        const seen = new Set(prev.map(dedupeKey));
        return prev.concat(res.items.filter((it) => !seen.has(dedupeKey(it))));
      });
      setPage(nextPage);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      lockRef.current = false;
      setLoading(false);
    }
  }, [dedupeKey]);

  // IntersectionObserver로 sentinel 관찰
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          // requestIdleCallback로 메인스레드 경쟁 완화(지원 안 되면 fallback)
          const run = () => fetchNext();
          if ("requestIdleCallback" in window) {
            (window as any).requestIdleCallback(run, { timeout: 250 });
          } else {
            setTimeout(run, 0);
          }
        }
      },
      { root: null, rootMargin: "120px", threshold: 0 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, [fetchNext]);

  // 에러 후 재시도용 함수(선택 사용)
  const retry = useCallback(() => {
    if (!lockRef.current) fetchNext();
  }, [fetchNext]);

  return { items, sentinelRef, hasNext, loading, error, retry };
}
