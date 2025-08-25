import { listProjects } from "@/lib/api/posts";
import TagTabs from "@/app/components/Filters/TagTabs";
import ProjectsInfiniteListClient from "@/app/components/Cards/ProjectsInfiniteListClient";

import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

/** URL ?tags= 값 파싱 */
function parseTags(params: Record<string, string | string[] | undefined>) {
  /* 위 유틸 코드 그대로 */
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
  /* 위 유틸 코드 그대로 */
  if (!selected.length) return true;
  if (!Array.isArray(itemTags)) return false;
  const set = new Set(itemTags as string[]);
  return selected.some((t) => set.has(t));
}
/** 최신순 */
function compareByDateDesc(a?: string | null, b?: string | null) {
  /* 위 유틸 코드 그대로 */
  const da = a ? Date.parse(a) : NaN;
  const db = b ? Date.parse(b) : NaN;
  const va = Number.isNaN(da) ? -Infinity : da;
  const vb = Number.isNaN(db) ? -Infinity : db;
  return vb - va;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const tags = parseTags(sp);

  // 백엔드 원본을 넉넉히 받아와서 클라에서 필터/정렬
  const res = await listProjects({ page: 1, limit: 500 });
  const allItems = Array.isArray(res?.items) ? (res.items as Post[]) : [];

  const filtered = tags.length ? allItems.filter((p) => matchAnyTag(p.tags, tags)) : allItems;
  const sorted = [...filtered].sort((a, b) => compareByDateDesc(a.date, b.date));

  const key = `proj-all-${tags.slice().sort().join(",")}`;

  return (
    <main className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10 py-6 md:py-7 lg:py-8">
      <h2 className="text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        All Projects <span className="text-sm opacity-70">({sorted.length})</span>
      </h2>

      <TagTabs type="project" />

      {sorted.length === 0 ? (
        <p className="text-[var(--color-muted)] mt-6 md:mt-7 lg:mt-8">
          조건에 맞는 프로젝트가 없습니다.
        </p>
      ) : (
        <section aria-label="프로젝트 목록" className="mt-6 md:mt-7 lg:mt-8">
          <ProjectsInfiniteListClient key={key} allItems={sorted} pageSize={8} />
        </section>
      )}
    </main>
  );
}
