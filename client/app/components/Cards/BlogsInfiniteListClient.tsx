"use client";

import Link from "next/link";

import { listBlogs } from "@/lib/api/posts";
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

export default function BlogsInfiniteListClient({
  initialItems,
  total,
  pageSize = 8,
  category,
  tags,
}: Props) {
  const loadMore = async (nextPage: number) => {
    const res = await listBlogs({
      page: nextPage,
      limit: pageSize,
      category,
      tags,
    });
    return { items: res.items, total: res.total };
  };

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
      getKey={(p) => p.id}
      renderItem={renderItem}
      className="flex flex-col gap-4 md:gap-5 lg:gap-6"
      errorPrefix="블로그 불러오기 실패:"
    />
  );
}
