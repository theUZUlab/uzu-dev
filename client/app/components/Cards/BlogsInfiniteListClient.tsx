// app/components/lists/BlogsInfiniteListClient.tsx
"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";

import Card from "@/app/components/Cards/Card";

import InfiniteList from "./InfiniteList";

import type { Post } from "@/lib/types";

type Props = {
  allItems: Post[];
  pageSize?: number; // 기본 8
};

export default function BlogsInfiniteListClient({ allItems, pageSize = 8 }: Props) {
  const initialItems = useMemo(() => allItems.slice(0, pageSize), [allItems, pageSize]);
  const total = allItems.length;

  const loadMore = useCallback(
    async (nextPage: number) => {
      const start = (nextPage - 1) * pageSize;
      const end = start + pageSize;
      const chunk = allItems.slice(start, end);
      return { items: chunk, total };
    },
    [allItems, pageSize, total]
  );

  const renderItem = (p: Post) => (
    <Link
      key={p.id}
      href={`/blogs/${encodeURIComponent(p.category || "uncategorized")}/${p.id}`}
      className="block w-full"
      prefetch
      aria-label={`${p.title} 상세 보기`}
    >
      <Card post={p} />
    </Link>
  );

  return (
    <InfiniteList<Post>
      initialItems={initialItems}
      total={total}
      loadMore={loadMore}
      renderItem={renderItem}
      getKey={(p) => p.id}
      className="flex flex-col gap-4 md:gap-5 lg:gap-6"
      errorPrefix="블로그 불러오기 실패:"
    />
  );
}
