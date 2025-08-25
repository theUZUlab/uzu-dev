"use client";

import GhostButton from "../Ui/GhostButton";
import type { Post } from "@/lib/types";

export default function RecentProjectsList({ items }: { items: Post[] }) {
  if (!items.length) {
    return (
      <p className="px-3.5 py-3.5 md:px-7 md:py-4 lg:px-10 lg:py-7 text-sm text-[var(--color-text)]/80">
        아직 표시할 프로젝트가 없습니다.
      </p>
    );
  }

  return (
    <div className="divide-y-2 divide-[var(--color-line)]">
      {items.map((p) => (
        <article
          key={p.id}
          className="px-3.5 py-3.5 md:px-7 md:py-4 lg:px-10 lg:py-7"
          aria-labelledby={`proj-${p.id}-title`}
        >
          <h4 id={`proj-${p.id}-title`} className="text-base md:text-lg font-black">
            {p.title}
          </h4>
          {p.summary && (
            <p className="text-sm md:text-base line-clamp-1 text-[var(--color-text)]/90">
              {p.summary}
            </p>
          )}
          <div className="mt-3 md:mt-5 grid grid-cols-2 gap-1.5 md:gap-2 lg:gap-2.5 w-full">
            <GhostButton href={p.deployUrl} label="View" />
            <GhostButton href={p.repoUrl} label="Repo" />
          </div>
        </article>
      ))}
    </div>
  );
}
