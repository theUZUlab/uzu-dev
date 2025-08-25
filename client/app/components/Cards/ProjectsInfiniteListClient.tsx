"use client";

import { useCallback } from "react";
import Link from "next/link";

import { listProjects } from "@/lib/api/posts";
import Card from "@/app/components/Cards/Card";

import InfiniteList from "./InfiniteList";

import type { Post } from "@/lib/types";

type Props = {
  initialItems: Post[];
  total: number;
  pageSize?: number; // 기본 8
  category?: string;
  tags?: string[];
};

export default function ProjectsInfiniteListClient({
  initialItems,
  total,
  pageSize = 8,
  category,
  tags,
}: Props) {
  const loadMore = useCallback(
    async (nextPage: number) => {
      const res = await listProjects({
        page: nextPage, // ✅ 훅에서 받은 페이지 사용
        limit: pageSize,
        category,
        tags,
      });
      return { items: res.items, total: res.total };
    },
    [pageSize, category, tags]
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
      className="flex flex-col gap-4 md:gap-5 lg:gap-6"
      getKey={(p) => p.id}
      renderItem={renderItem}
    />
  );
}
