import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { getProjectById } from "@/lib/api/posts";
import { renderMarkdown } from "@/lib/markdown";

import type { Metadata } from "next";
import type { Post } from "@/lib/types";

type Params = { category: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  let post: Post | null = null;
  try {
    post = await getProjectById(slug);
  } catch {
    return {};
  }
  if (!post) return {};

  const title = post.title ?? "";
  const description = post.summary ?? "";
  const thumbnail = post.thumbnail ?? "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: thumbnail ? [thumbnail] : [],
    },
  };
}

export default async function ProjectPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  let post: Post | null = null;
  try {
    post = await getProjectById(slug);
  } catch {
    return notFound();
  }
  if (!post) return notFound();

  const dateObj = post.date ? new Date(post.date) : null;
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
    : "";

  const bodyHtml = await renderMarkdown(post.description ?? "");

  return (
    <main className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10 py-6 md:py-7 lg:py-8">
      {/* 태그 */}
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/projects?tags=${encodeURIComponent(tag)}`}
              className="aurora-frame hover:cursor-pointer rounded-[var(--radius-md)] p-0.5 shrink-0 snap-start"
            >
              <span
                className="
                  aurora-inner
                  w-full bg-[var(--color-panel)]
                  flex flex-nowrap gap-2 
                  md:flex-wrap md:overflow-visible md:snap-none
                  px-3 py-1 md:px:4 lg:px-5 
                  text-sm md:text-base lg:text-lg font-bold text-[var(--color-text)]
                  rounded-[var(--radius-md)]
                "
              >
                {tag}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* 제목 / 요약 / 날짜 */}
      <h2 className="mt-6 md:mt-7 lg:mt-8 text-lg md:text-xl lg:text-2xl font-black text-[var(--color-text)]">
        {post.title}
      </h2>
      {post.summary && (
        <p className="mt-0.5 md:mt-1.5 lg:mt-2 text-sm lg:text-lg text-[var(--color-text)]">
          {post.summary}
        </p>
      )}
      {formattedDate && (
        <p className="mt-3 md:mt-4 lg:mt-5 text-sm md:text-base lg:text-lg text-[var(--color-text)]">
          {formattedDate}
        </p>
      )}

      {/* 썸네일 */}
      {post.thumbnail && (
        <div className="mt-6 md:mt-7 lg:mt-8 relative  aspect-[3/2] w-full overflow-hidden rounded-md mb-10 md:mb-15 lg:mb-20">
          <Image
            src={post.thumbnail}
            alt={`${post.title} 썸네일`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>
      )}

      {/* 본문 */}
      <article className="md-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </main>
  );
}
