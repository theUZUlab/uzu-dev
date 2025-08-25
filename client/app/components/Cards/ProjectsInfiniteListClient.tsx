"use client";

import Image from "next/image";

import type { Post } from "@/lib/types";

export default function Card({ post }: { post: Post }) {
  const dateObj = post.date ? new Date(post.date) : null;

  return (
    <article
      className="
        w-full relative rounded-[var(--radius-xl)] p-0.5
        transition-colors aurora-frame
      "
      aria-label={post.title}
    >
      <div
        className="
          bg-[var(--color-panel)] aurora-inner
          /* PC에서 좌우 레이아웃 + 같은 높이로 늘리기 */
          flex flex-col md:flex-row md:items-stretch gap-2.5 md:gap-5 lg:gap-7
          w-full p-2.5 md:p-5 lg:p-7 rounded-[var(--radius-xl)]
        "
      >
        {/* 왼쪽: 썸네일 */}
        {post.thumbnail && (
          <figure aria-label="프로젝트 썸네일">
            {/* 모바일 썸네일 */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[var(--radius-md)] md:hidden">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 0px"
              />
            </div>

            {/* PC 썸네일 (고정 높이) */}
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
                sizes="(min-width: 768px) 320px, 0px"
              />
            </div>
          </figure>
        )}

        {/* 오른쪽: 태그 / (제목+요약) / 날짜 → 세로 justify-between */}
        <div
          className="
            flex-1 min-w-0 flex flex-col justify-between md:min-h-[9rem] lg:min-h-[10rem] gap-3 md:gap-0
          "
        >
          {/* ↑ 태그 */}
          {post.tags?.length ? (
            <nav aria-label="프로젝트 태그">
              <ul className="flex flex-wrap gap-1 md:gap-1.5 lg:gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <span
                      className="
                        inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-bg)] text-[var(--color-text)] font-semibold px-3 py-1 text-xs md:text-sm lg:text-base
                      "
                    >
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            <p>불러오는 중...</p>
          )}

          {/* • 가운데: 제목 + 요약 */}
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

          {/* ↓ 날짜 (PC 전용, 맨 아래 정렬) */}
          {dateObj ? (
            <p className="text-sm md:text-base lg:text-lg text-[var(--color-text)]">
              <time dateTime={dateObj.toISOString()}>
                {dateObj.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </time>
            </p>
          ) : (
            <p>불러오는 중...</p>
          )}
        </div>
      </div>
    </article>
  );
}
