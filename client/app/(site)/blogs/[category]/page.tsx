import { listBlogs } from "@/lib/api/posts";
import TagTabs from "@/app/components/Filters/TagTabs";
import BlogsInfiniteListClient from "@/app/components/Cards/BlogsInfiniteListClient";

export const dynamic = "force-dynamic";

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

  const res = await listBlogs({ page: 1, limit: 8, category, tags });
  const initialItems = Array.isArray(res.items) ? res.items : [];

  return (
    <main className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10 py-6 md:py-7 lg:py-8">
      <h2 className="text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        {category} <span className="text-sm opacity-70">({res.total})</span>
      </h2>

      <TagTabs type="blog" category={category} />

      <section aria-label={`${category} 블로그 목록`} className="mt-6 md:mt-7 lg:mt-8">
        <BlogsInfiniteListClient
          initialItems={initialItems}
          total={res.total}
          pageSize={8}
          category={category}
          tags={tags}
        />
      </section>
    </main>
  );
}
