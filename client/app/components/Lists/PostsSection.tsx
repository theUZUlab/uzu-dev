import { listProjects, listBlogs } from "@/lib/api/posts";
import PostsInfiniteListClient from "./PostsInfiniteListClient";

type Props = {
  type: "project" | "blog";
  category?: string;
  tags: string[];
  pageSize: number;
  basePath: "/projects" | "/blogs";
  emptyMsg: string;
  ariaLabel: string;
};

export default async function PostsSection({
  type,
  category,
  tags,
  pageSize,
  basePath,
  emptyMsg,
  ariaLabel,
}: Props) {
  const fn = type === "project" ? listProjects : listBlogs;
  const res = await fn({
    page: 1,
    limit: pageSize,
    category,
    tags: tags.length ? tags : undefined,
  });

  if (res.total === 0) {
    return <p className="text-[var(--color-muted)] mt-6 md:mt-7 lg:mt-8">{emptyMsg}</p>;
  }

  return (
    <section aria-label={ariaLabel} className="mt-6 md:mt-7 lg:mt-8">
      <PostsInfiniteListClient
        initialItems={res.items}
        total={res.total}
        pageSize={pageSize}
        type={type}
        category={category}
        tags={tags}
        basePath={basePath}
      />
    </section>
  );
}
