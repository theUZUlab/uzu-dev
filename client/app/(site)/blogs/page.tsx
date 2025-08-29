import { listBlogs } from "@/lib/api/posts";
import TagTabs from "@/app/components/Filters/TagTabs";
import PostsInfiniteListClient from "@/app/components/Lists/PostsInfiniteListClient";
import { parseTags, matchAnyTag, compareByDateDesc } from "@/lib/query";

import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const tags = parseTags(sp);

  const res = await listBlogs({ page: 1, limit: 500 });
  const allItems = Array.isArray(res?.items) ? (res.items as Post[]) : [];

  const filtered = tags.length ? allItems.filter((p) => matchAnyTag(p.tags, tags)) : allItems;
  const sorted = [...filtered].sort((a, b) => compareByDateDesc(a.date, b.date));

  const key = `blog-all-${tags.slice().sort().join(",")}`;

  return (
    <main className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10 py-6 md:py-7 lg:py-8">
      <h3 className="text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        All Blogs <span className="text-sm opacity-70">({sorted.length})</span>
      </h3>

      <TagTabs type="blog" />

      {sorted.length === 0 ? (
        <p className="text-[var(--color-muted)] mt-6 md:mt-7 lg:mt-8">조건에 맞는 블로그가 없습니다.</p>
      ) : (
        <section aria-label="블로그 목록" className="mt-6 md:mt-7 lg:mt-8">
          <PostsInfiniteListClient key={key} allItems={sorted} pageSize={8} basePath="/blogs" />
        </section>
      )}
    </main>
  );
}
