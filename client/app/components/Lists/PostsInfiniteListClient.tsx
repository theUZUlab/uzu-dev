"use client";

import { memo, useCallback } from "react";
import Link from "next/link";

import Card from "@/app/components/Cards/Card";
import InfiniteList from "@/app/components/Lists/InfiniteList";
import { listProjects, listBlogs } from "@/lib/api/posts";

import type { Post } from "@/lib/types";

type Props = {
  initialItems: Post[];
  total: number;
  pageSize?: number;
  type: "project" | "blog";
  category?: string;
  tags?: string[];
  basePath: "/projects" | "/blogs";
};

function PostsInfiniteListClient({
  initialItems,
  total,
  pageSize = 8,
  type,
  category,
  tags,
  basePath,
}: Props) {
  const getId = useCallback((p: Post) => p.id, []);

  const loadMore = useCallback(
    async (nextPage: number) => {
      const fn = type === "project" ? listProjects : listBlogs;
      const res = await fn({
        page: nextPage,
        limit: pageSize,
        category,
        tags: tags?.length ? tags : undefined,
      });
      return { items: res.items, total: res.total };
    },
    [type, pageSize, category, tags]
  );

  const renderItem = useCallback(
    (p: Post) => (
      <Link
        key={p.id}
        href={`${basePath}/${encodeURIComponent(p.category || "uncategorized")}/${p.id}`}
        className="block w-full"
        prefetch
        aria-label={`${p.title} 상세 보기`}
      >
        <Card post={p} />
      </Link>
    ),
    [basePath]
  );

  return (
    <InfiniteList<Post>
      initialItems={initialItems}
      total={total}
      loadMore={loadMore}
      renderItem={renderItem}
      getKey={getId}
      dedupeKey={getId}
      className="flex flex-col gap-4 md:gap-5 lg:gap-6"
      errorPrefix="목록 불러오기 실패:"
    />
  );
}

export default memo(PostsInfiniteListClient);
