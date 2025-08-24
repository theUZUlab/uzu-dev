import Link from "next/link";

import { listBlogs } from "@/lib/api/posts";
import Card from "@/app/components/Cards/Card";
import TagTabs from "@/app/components/Filters/TagTabs";

export const dynamic = "force-dynamic";

/** URL ?tags= 값 파싱 */
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

/** OR 매칭 */
function matchAnyTag(itemTags: unknown, selected: string[]) {
  if (!selected.length) return true;
  if (!Array.isArray(itemTags)) return false;
  const set = new Set(itemTags as string[]);
  return selected.some((t) => set.has(t));
}

/** 날짜 최신순 정렬(비어있으면 뒤로) */
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
  const sp = (await searchParams) ?? {};

  const category = decodeURIComponent(rawCategory);
  const tags = parseTags(sp);

  // 응답 안전 가드
  const res = await listBlogs({ page: 1, limit: 200, category, tags });
  const allItems = Array.isArray(res?.items) ? res.items : [];

  // OR 폴백 + 최신순
  const filtered = tags.length ? allItems.filter((p) => matchAnyTag(p.tags, tags)) : allItems;
  const sorted = [...filtered].sort((a, b) => compareByDateDesc(a.date, b.date));

  return (
    <main className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10 py-6 md:py-7 lg:py-8">
      {/* 페이지 섹션 제목: 전역 헤더에 h1이 있으므로 h2 사용 */}
      <h2 className="text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        {category} <span className="text-sm opacity-70">({sorted.length})</span>
      </h2>

      {/* 카테고리 한정 태그만 노출 */}
      <TagTabs type="blog" category={category} />

      {sorted.length === 0 ? (
        <p className="text-[var(--color-muted)] mt-6 md:mt-7 lg:mt-8">
          조건에 맞는 블로그가 없습니다.
        </p>
      ) : (
        <section aria-label="블로그 목록" className="mt-6 md:mt-7 lg:mt-8">
          <ul className="flex flex-col gap-4 md:gap-5 lg:gap-6">
            {sorted.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/blogs/${encodeURIComponent(p.category || "uncategorized")}/${p.id}`}
                  className="block w-full"
                  prefetch
                  aria-label={`${p.title} 상세 보기`}
                >
                  <Card post={p} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
