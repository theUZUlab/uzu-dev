import { listProjects } from "@/lib/api/posts";
import TagTabs from "@/app/components/Filters/TagTabs";
import ProjectsInfiniteListClient from "@/app/components/Cards/ProjectsInfiniteListClient";

import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 8;

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

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const tags = parseTags(sp);

  // 서버에서 초기 8개만
  const { items, total } = await listProjects({
    page: 1,
    limit: PAGE_SIZE,
    tags,
    revalidateSec: 30,
  });

  return (
    <main className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10 py-6 md:py-7 lg:py-8">
      <h2 className="text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        All Projects <span className="text-sm opacity-70">({total})</span>
      </h2>

      <TagTabs type="project" />

      <section aria-label="프로젝트 목록" className="mt-6 md:mt-7 lg:mt-8">
        <ProjectsInfiniteListClient
          initialItems={items as Post[]}
          total={total}
          pageSize={PAGE_SIZE}
          tags={tags}
        />
      </section>
    </main>
  );
}
