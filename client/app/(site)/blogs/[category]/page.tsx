import { listBlogs } from "@/lib/api/posts";
import TagTabs from "@/app/components/Filters/TagTabs";
import BlogsInfiniteListClient from "@/app/components/Cards/BlogsInfiniteListClient";

import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

/** 유틸: parseTags, matchAnyTag, compareByDateDesc (위와 동일) */
function parseTags(params: Record<string, string | string[] | undefined>) {
  const raw = params?.tags;
  if (!raw) return [];
  if (Array.isArray(raw))
    return raw
      .flatMap((x) => x.split(","))
      .map((s) => s.trim())
      .filter(Boolean);
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
function matchAnyTag(itemTags: unknown, selected: string[]) {
  if (!selected.length) return true;
  if (!Array.isArray(itemTags)) return false;
  const set = new Set(itemTags as string[]);
  return selected.some((t) => set.has(t));
}
function compareByDateDesc(a?: string | null, b?: string | null) {
  const da = a ? Date.parse(a) : NaN;
  const db = b ? Date.parse(b) : NaN;
  const va = Number.isNaN(da) ? -Infinity : da;
  const vb = Number.isNaN(db) ? -Infinity : db;
  return vb - va;
}

export default async function CategoryBlogsPage({
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

  const res = await listBlogs({ page: 1, limit: 500, category });
  const allItems = Array.isArray(res?.items) ? (res.items as Post[]) : [];

  const filtered = tags.length ? allItems.filter((p) => matchAnyTag(p.tags, tags)) : allItems;
  const sorted = [...filtered].sort((a, b) => compareByDateDesc(a.date, b.date));

  const key = `blog-${category}-${tags.slice().sort().join(",")}`;

  return (
    <main className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10 py-6 md:py-7 lg:py-8">
      <h2 className="text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        {category} <span className="text-sm opacity-70">({sorted.length})</span>
      </h2>

      <TagTabs type="blog" category={category} />

      {sorted.length === 0 ? (
        <p className="text-[var(--color-muted)] mt-6 md:mt-7 lg:mt-8">
          조건에 맞는 블로그가 없습니다.
        </p>
      ) : (
        <section aria-label={`${category} 블로그 목록`} className="mt-6 md:mt-7 lg:mt-8">
          <BlogsInfiniteListClient key={key} allItems={sorted} pageSize={8} />
        </section>
      )}
    </main>
  );
}
