import { Suspense } from "react";
import TagTabs from "@/app/components/Filters/TagTabs";
import PostsSection from "@/app/components/Lists/PostsSection";
import PostsListSkeleton from "@/app/components/Lists/PostsListSkeleton";
import { parseTags } from "@/lib/query";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const tags = parseTags((await searchParams) ?? {});
  const key = `proj-all-${tags.slice().sort().join(",")}`;

  return (
    <main className="page-container">
      <h3 className="text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        All Projects
      </h3>

      <TagTabs type="project" />

      <Suspense key={key} fallback={<PostsListSkeleton />}>
        <PostsSection
          type="project"
          tags={tags}
          pageSize={PAGE_SIZE}
          basePath="/projects"
          emptyMsg="조건에 맞는 프로젝트가 없습니다."
          ariaLabel="프로젝트 목록"
        />
      </Suspense>
    </main>
  );
}
