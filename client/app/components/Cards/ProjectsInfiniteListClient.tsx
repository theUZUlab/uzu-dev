// app/components/lists/ProjectsInfiniteListClient.tsx
"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";

import Card from "@/app/components/Cards/Card";

import InfiniteList from "./InfiniteList";

import type { Post } from "@/lib/types";

type Props = {
  /** 필터/정렬까지 끝난 전체 배열 */
  allItems: Post[];
  pageSize?: number; // 기본 8
};

export default function ProjectsInfiniteListClient({ allItems, pageSize = 8 }: Props) {
  // 첫 페이지 아이템
  const initialItems = useMemo(() => allItems.slice(0, pageSize), [allItems, pageSize]);
  const total = allItems.length;

  // 클라에서 정적 배열을 슬라이싱해서 페이징
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
      href={`/projects/${encodeURIComponent(p.category || "uncategorized")}/${p.id}`}
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
      errorPrefix="프로젝트 불러오기 실패:"
    />
  );
}
