import { listProjects } from "@/lib/api/posts";
import TagTabs from "@/app/components/Filters/TagTabs";
import PostsInfiniteListClient from "@/app/components/Lists/PostsInfiniteListClient";
import { parseTags, matchAnyTag, compareByDateDesc } from "@/lib/query";

import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CategoryProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const sp = (await searchParams) ?? {};
  const tags = parseTags(sp);

  const res = await listProjects({ page: 1, limit: 500 });
  const allItems = Array.isArray(res?.items) ? (res.items as Post[]) : [];

  const inCategory = allItems.filter(
    (p) => (p.category ?? "").trim().toLowerCase() === category.trim().toLowerCase()
  );

  const filtered = tags.length ? inCategory.filter((p) => matchAnyTag(p.tags, tags)) : inCategory;
  const sorted = [...filtered].sort((a, b) => compareByDateDesc(a.date, b.date));

  const key = `proj-${category}-${tags.slice().sort().join(",")}`;

  return (
    <main className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10 py-6 md:py-7 lg:py-8">
      <h2 className="text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        {category} <span className="text-sm opacity-70">({sorted.length})</span>
      </h2>

      <TagTabs type="project" category={category} />

      {sorted.length === 0 ? (
        <p className="text-[var(--color-muted)] mt-6 md:mt-7 lg:mt-8">
          조건에 맞는 프로젝트가 없습니다.
        </p>
      ) : (
        <section aria-label={`${category} 프로젝트 목록`} className="mt-6 md:mt-7 lg:mt-8">
          <PostsInfiniteListClient key={key} allItems={sorted} pageSize={8} basePath="/projects" />
        </section>
      )}
    </main>
  );
}
