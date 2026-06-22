import { Suspense } from "react";
import TagTabs from "@/app/components/Filters/TagTabs";
import PostsSection from "@/app/components/Lists/PostsSection";
import PostsListSkeleton from "@/app/components/Lists/PostsListSkeleton";
import { parseTags } from "@/lib/query";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

export default async function CategoryBlogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const tags = parseTags((await searchParams) ?? {});
  const key = `blog-${category}-${tags.slice().sort().join(",")}`;

  return (
    <main className="page-container">
      <h3 className="text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        {category}
      </h3>

      <TagTabs type="blog" category={category} />

      <Suspense key={key} fallback={<PostsListSkeleton />}>
        <PostsSection
          type="blog"
          category={category}
          tags={tags}
          pageSize={PAGE_SIZE}
          basePath="/blogs"
          emptyMsg="조건에 맞는 블로그가 없습니다."
          ariaLabel={`${category} 블로그 목록`}
        />
      </Suspense>
    </main>
  );
}
