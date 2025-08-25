import { listBlogs } from "@/lib/api/posts";
import TagTabs from "@/app/components/Filters/TagTabs";
import BlogsInfiniteListClient from "@/app/components/Cards/BlogsInfiniteListClient";

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

export default async function BlogsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const tags = parseTags(sp);

  const res = await listBlogs({ page: 1, limit: 8, tags });
  const initialItems = Array.isArray(res.items) ? res.items : [];

  return (
    <main className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10 py-6 md:py-7 lg:py-8">
      <h2 className="text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        All Blogs <span className="text-sm opacity-70">({res.total})</span>
      </h2>

      <TagTabs type="blog" />

      <section aria-label="블로그 목록" className="mt-6 md:mt-7 lg:mt-8">
        <BlogsInfiniteListClient
          initialItems={initialItems}
          total={res.total}
          pageSize={8}
          tags={tags}
        />
      </section>
    </main>
  );
}
