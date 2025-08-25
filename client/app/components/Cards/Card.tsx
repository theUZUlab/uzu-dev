"use client";

import Image from "next/image";
import type { Post } from "@/lib/types";

export default function Card({ post }: { post: Post }) {
  const dateObj = post.date ? new Date(post.date) : null;
  const isValidDate = !!(dateObj && !Number.isNaN(dateObj.getTime()));

  return (
    <article
      className="w-full relative rounded-[var(--radius-xl)] p-0.5 transition-colors aurora-frame"
      aria-label={post.title}
    >
      <div
        className="
          bg-[var(--color-panel)] aurora-inner
          flex flex-col md:flex-row md:items-stretch gap-2.5 md:gap-5 lg:gap-7
          w-full p-2.5 md:p-5 lg:p-7 rounded-[var(--radius-xl)]
        "
      >
        {/* 왼쪽: 썸네일 */}
        {post.thumbnail && (
          <figure aria-label="프로젝트 썸네일">
            {/* 모바일 */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[var(--radius-md)] md:hidden">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw"
                priority={false}
              />
            </div>

            {/* 데스크톱 */}
            <div
              className="
                relative hidden md:block
                md:w-56 lg:w-80 
                md:h-36 lg:h-52 
                overflow-hidden rounded-[var(--radius-md)] shrink-0
              "
            >
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 320px"
                priority={false}
              />
            </div>
            <figcaption className="sr-only">{post.title} 썸네일</figcaption>
          </figure>
        )}

        {/* 오른쪽: 태그 / (제목+요약) / 날짜 */}
        <div className="flex-1 min-w-0 flex flex-col justify-between md:min-h-[9rem] lg:min-h-[10rem] gap-3 md:gap-0">
          {/* 태그 */}
          {post.tags?.length ? (
            <nav aria-label="프로젝트 태그">
              <ul className="flex flex-wrap gap-1 md:gap-1.5 lg:gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <span
                      className="
                        inline-flex items-center rounded-[var(--radius-md)]
                        bg-[var(--color-bg)] text-[var(--color-text)] font-semibold
                        px-3 py-1 text-xs md:text-sm lg:text-base
                      "
                    >
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {/* 제목 + 요약 */}
          <header>
            <h2 className="text-base lg:text-xl font-black text-[var(--color-text)] truncate">
              {post.title}
            </h2>
            {post.summary && (
              <p
                className="mt-0.5 md:mt-1.5 lg:mt-2 text-sm lg:text-lg text-[var(--color-text)] truncate"
                title={post.summary}
              >
                {post.summary}
              </p>
            )}
          </header>

          {/* 날짜 */}
          {isValidDate && (
            <p className="text-sm md:text-base lg:text-lg text-[var(--color-text)]">
              <time dateTime={dateObj!.toISOString()}>
                {new Intl.DateTimeFormat("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).format(dateObj!)}
              </time>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
